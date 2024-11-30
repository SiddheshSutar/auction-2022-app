import React, { Component, useEffect, useState } from "react";
import "./index.css";
import teams from "../externalLists/ListOfTeams";
import { Modal, Button } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux'
import { assignteamToPlayer, deletePlayer, setReduxState, storeMatches } from '../redux/storeSlice'
import { API_BASED_APP, BASE_AMOUNT, CAPTAIN_BASE_PRICE, DEFAULT_BID_PRICE, GAME_CHANGER_BASE_PRICE, MAX_AMOUNT, MIN_PLAYERS, MIN_PLAYER_COUNT, OWNER_BASE_PRICE, checkFemaleOrSenior, generateMatches, isCurrentPlayerCondition, isSelfSenior } from "../helpers";
import parse from 'html-react-parser'
import players2 from "../externalLists/ListOfPlayersLatest";
import { getPlayers, getTeams, updatePlayerList, updateTeamList } from "../services";
import { cloneDeep, first } from "lodash";

const ConfirmBuyPlayerModal = ({
    show,
    handleYes,
    handleNo,
    setShowModal,
    teamNamePassed,
    currentBidPrice,
    currentPlayer
}) => {
    return <>
        <Modal className="text-center" show={show} onHide={() => setShowModal(false)} >
            <Modal.Header className="justify-content-center">
                <Modal.Title className="fs-2">Confirm ?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="fs-2">Confirming to buy player ?</p>
                <p className="fs-2 fw-bold "><span className="clr-primary">{teamNamePassed}</span> wants:</p>
                <p className="fs-2 fw-bold "><span className="clr-secondary">{currentPlayer.Name}</span> for amount:</p>
                <p className="fs-2 fw-bold clr-tertiary">{currentBidPrice} </p>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
                <Button className="fs-2" variant="primary" onClick={e => handleYes(e)}>Yes</Button>
                <Button className="fs-2" variant="secondary" onClick={handleNo}>no</Button>
            </Modal.Footer>
        </Modal>
    </>
}
const ConfirmDeletePlayerModal = ({
    show,
    handleYes,
    handleNo,
    setShowModal,
}) => {
    const { team, player } = show

    if (!team || !player) return <></>

    return <>
        <Modal className="text-center" show={show} onHide={() => setShowModal(false)} >
            <Modal.Header className="justify-content-center">
                <Modal.Title className="fs-2">Confirm ?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="fs-2">Confirming to delete</p>
                <p className="fs-2 fw-bold "><span className="clr-primary">{player.Name}</span> from</p>
                <p className="fs-2 fw-bold "><span className="clr-secondary">{team.Name}</span>{' '}?</p>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
                <Button className="fs-2" variant="primary" onClick={e => handleYes({ team, player })}>Yes</Button>
                <Button className="fs-2" variant="secondary" onClick={handleNo}>no</Button>
            </Modal.Footer>
        </Modal>
    </>
}
const MatchListModal = ({
    show,
    handleYes,
    handleNo,
    setShowModal,
}) => {

    const { storedMatches } = useSelector(state => state.store)

    const [matches, setMatches] = useState(storedMatches.length > 0 ? storedMatches : generateMatches())

    const dispatch = useDispatch()

    useEffect(() => {

        /** Store in redux when unmounting */
        return () => {
            dispatch(storeMatches(matches))
        }
    }, [matches])

    return <>
        <Modal size="xl" className="text-center" show={show} onHide={() => setShowModal(false)} >
            <Modal.Header className="justify-content-center">
                <Modal.Title className="fs-2">List of matches</Modal.Title>
                <a
                    className="refresh-link"
                    href="#"
                    onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        setMatches(generateMatches(matches))
                    }}
                >
                    Regenerate..
                </a>
            </Modal.Header>

            <Modal.Body>
                <div className="matches-row">
                    {
                        matches.map((item, index) => {
                            return <div className="matches-col" key={index}>
                                <div className="matches-col-index">{index + 1}.</div>&nbsp;
                                {parse(item)}
                            </div>
                        })
                    }
                </div>
            </Modal.Body>
        </Modal>
    </>
}
const CaptainsModal = ({
    show,
    handleYes,
    handleNo,
    setShowModal,
}) => {

    // const { storedMatches } = useSelector(state => state.store)

    // const [matches, setMatches] = useState(storedMatches.length > 0 ? storedMatches : generateMatches())

    // const dispatch = useDispatch()

    // useEffect(() => {

    //     /** Store in redux when unmounting */
    //     return () => {
    //         dispatch(storeMatches(matches))
    //     }
    // }, [matches])

    const [captains, setCaptains] = useState(
        players2.filter(item => item.Captain)
            .map(item => ({ ...item, show: false }))
    )

    return <>
        <Modal size="xl" className="text-center" show={show} onHide={() => setShowModal(false)} >
            <Modal.Header className="justify-content-center">
                <Modal.Title className="fs-2">Select Captains</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="matches-row">
                    <div className="captains-row">
                        {
                            captains.map((captain, index) => {
                                return <div className={
                                    `cap cap-show ${captain.show ? 'show' : ''}`
                                } key={index}
                                    onClick={e => {
                                        let allCaptains = [...captains]

                                        allCaptains = allCaptains.map(item => {

                                            if (item.Name === captain.Name) {
                                                return {
                                                    ...item,
                                                    show: !item.show
                                                }
                                            }

                                            return item
                                        })

                                        setCaptains(allCaptains)
                                    }}
                                >
                                    {captain.Name}
                                </div>
                            })
                        }
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </>
}

const TeamButtons = () => {
    const [showModal, setShowModal] = useState(false)
    const [openDeleteModal, setDeleteModal] = useState(null)
    const [openMatchListModal, toggleMatchListModal] = useState(false)
    const [openCaptainsModal, toggleCaptainsModal] = useState(false)
    const [openGameChangersModal, toggleGameChangersModal] = useState(false)

    const currentPlayer = useSelector((state) => state.store.currentPlayer)
    const currentTeamList = useSelector((state) => state.store.initialTeamList)
    const currentBidPrice = useSelector((state) => state.store.currentBidPrice)

    const [teamClicked, setTeamClicked] = useState(null)
    const [teamIdClicked, setTeamIdClicked] = useState(null)
    const [teamClickedObj, setTeamClickedObj] = useState(null)

    const dispatch = useDispatch()

    const handleClickBuyTeam = (e, teamObj) => {
        setTeamClickedObj(teamObj)
        setTeamClicked(teamObj.TeamName)
        setTeamIdClicked(teamObj._id)
        setShowModal(true)
    }

    const handleBuyPlayer = async () => {
        // alert('success: ', JSON.stringify(currentPlayer))
        // console.log('Team player:',currentPlayer )
        dispatch(assignteamToPlayer({ teamClicked: teamClickedObj.Name, currentPlayer }))

        if (API_BASED_APP) {
            await updateTeamList({
                data: [{
                    singlePlayer: true,
                    teamId: teamIdClicked,
                    playerId: currentPlayer._id,
                    Amount_Used: (teamClickedObj?.Amount_Used ?? 0) + currentBidPrice
                }]
            })
            await updatePlayerList({
                data: [{
                    _id: currentPlayer._id,
                    SoldFor: currentBidPrice,
                    pending: false
                }]

            })


            const teamsResp = await getTeams()
            const playersResp = await getPlayers()

            dispatch(setReduxState({
                key: 'initialTeamList',
                data: teamsResp.data
            }))
            dispatch(setReduxState({
                key: 'initialPlayerList',
                data: playersResp.data
            }))
        }
        setShowModal(false)
    }

    const handleDeletePlayer = async ({ player, team }) => {
        dispatch(deletePlayer({ player, team }))

        if (team?._id && player?._id && API_BASED_APP) {

            await updateTeamList({
                data: [{
                    singlePlayer: true,
                    playerDeleteFlow: true,
                    teamId: team._id,
                    playerId: player._id,
                    Amount_Used: (team.Amount_Used ?? 0) - player.SoldFor
                }]
            })
            await updatePlayerList({
                data: [{
                    _id: player._id,
                    SoldFor: 0,
                    pending: false
                }]

            })
            const teamsResp = await getTeams()
            const playersResp = await getPlayers()

            dispatch(setReduxState({
                key: 'initialTeamList',
                data: cloneDeep(teamsResp.data)
            }))
            dispatch(setReduxState({
                key: 'initialPlayerList',
                data: cloneDeep(playersResp.data)
            }))
            dispatch(setReduxState({
                key: 'currentTeamList',
                data: cloneDeep(teamsResp.data)
            }))
            dispatch(setReduxState({
                key: 'currentPlayerList',
                data: cloneDeep(playersResp.data)
            }))
        }

        setDeleteModal(null)
    }

    useEffect(() => {
        //reset team once player bought
        if (!showModal) {
            setTeamClicked(null)
            setTeamIdClicked(null)
        }
    }, [showModal])


    return (
        <div class="container-tb right-c team-buttons-cntr">
            {
                showModal &&
                <ConfirmBuyPlayerModal
                    show={showModal}
                    handleYes={e => handleBuyPlayer(e)}
                    handleNo={() => setShowModal(false)}
                    setShowModal={setShowModal}
                    currentBidPrice={currentBidPrice}
                    teamNamePassed={teamClicked}
                    currentPlayer={currentPlayer}
                />
            }
            {
                (Boolean(openDeleteModal)) &&
                <ConfirmDeletePlayerModal
                    show={openDeleteModal}
                    handleYes={({ player, team }) => handleDeletePlayer({ player, team })}
                    handleNo={() => setDeleteModal(null)}
                    setShowModal={setDeleteModal}
                />
            }
            {
                (openMatchListModal) &&
                <MatchListModal
                    show={openMatchListModal}
                    handleYes={() => { }}
                    handleNo={() => toggleMatchListModal(null)}
                    setShowModal={toggleMatchListModal}
                />
            }
            {
                (openCaptainsModal) &&
                <CaptainsModal
                    show={openCaptainsModal}
                    handleYes={() => { }}
                    handleNo={() => toggleCaptainsModal(null)}
                    setShowModal={toggleCaptainsModal}
                />
            }
            {
                (openGameChangersModal) &&
                <MatchListModal
                    show={openGameChangersModal}
                    handleYes={() => { }}
                    handleNo={() => toggleGameChangersModal(null)}
                    setShowModal={toggleGameChangersModal}
                />
            }
            {false && <div class="row title">
                <div className="showCaptainSlots">
                    {/* <a
                        style={{
                            color: "#fcfaaf"
                        }}
                        href="#"
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleCaptainsModal(true)
                        }}
                    >
                        Captains
                    </a>
                    <a
                        style={{
                            color: "#fcfaaf"
                        }}
                        href="#"
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleGameChangersModal(true)
                        }}
                    >
                        Gamechangers
                    </a> */}
                </div>
                <div className="text">Team Summary</div>
                <div className="showMatches">
                    <a
                        style={{
                            color: "#fcfaaf"
                        }}
                        href="#"
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleMatchListModal(true)
                        }}
                    >
                        Show matches
                    </a>
                </div>
            </div>}
            <div class="team-buttons">

                {currentTeamList.map((team) => {

                    const alreadySoldPlayer = Boolean(currentPlayer?.SoldFor)
                    const alreadyHasCaptain = team?.Players.some((obj) => obj?.Captain)
                    const alreadyHasOwner = team?.Players.some((obj) => obj?.Owner)
                    const isOwnerPlaying = team?.Is_Owner_Playing
                    const alreadyHasFemale = currentPlayer?.Gender === "F" && team?.Players.some((obj) => obj?.Gender === "F")
                    const alreadyHasGameChanger = team?.Players.some((obj) => obj?.GameChanger)
                    const alreadyBoughtPlayer = currentPlayer?._id && team?.Players.some((obj) => obj?._id === currentPlayer?._id)


                    const isBtnDisabled = currentBidPrice <= 0 || (
                        MAX_AMOUNT - team.Amount_Used < currentBidPrice
                    ) || (
                            checkFemaleOrSenior({
                                currentTeam: team,
                                teams: currentTeamList,
                                currentPlayer: currentPlayer
                            })
                        ) ||
                        (currentPlayer?.Captain && alreadyHasCaptain) || alreadyHasFemale || (currentPlayer?.GameChanger && alreadyHasGameChanger) || alreadyBoughtPlayer || alreadySoldPlayer
                    // || (
                    //     isSelfSenior({
                    //         currentTeam: team,
                    //         currentPlayer: currentPlayer
                    //     })
                    // )

                    // 
                    let predictedAmountSpent = team.Amount_Used
                    let currentTeamPlayersCount = team.Players?.length
                    let playersPendingWithDefaultPrice = MIN_PLAYERS - currentTeamPlayersCount

                    
                    predictedAmountSpent += currentBidPrice
                    if(
                        !(isCurrentPlayerCondition(currentPlayer, "GC") ||
                        isCurrentPlayerCondition(currentPlayer, "C") ||
                        isCurrentPlayerCondition(currentPlayer, "O"))
                    ) {
                        playersPendingWithDefaultPrice--
                    }

                    if (!alreadyHasGameChanger) { //250
                        predictedAmountSpent += GAME_CHANGER_BASE_PRICE
                        playersPendingWithDefaultPrice--
                    }

                    if (!alreadyHasCaptain) { //200
                        predictedAmountSpent += CAPTAIN_BASE_PRICE
                        playersPendingWithDefaultPrice--
                    }

                    if (isOwnerPlaying && !alreadyHasOwner) { //100
                        predictedAmountSpent += OWNER_BASE_PRICE
                        playersPendingWithDefaultPrice--
                    }

                    const basePlayerNewDeductions = playersPendingWithDefaultPrice > 0 ? BASE_AMOUNT * playersPendingWithDefaultPrice : 0
                    predictedAmountSpent += basePlayerNewDeductions


                    let cantBuyCurrentPlayer = predictedAmountSpent > MAX_AMOUNT
                    
                    console.log('hex: ', predictedAmountSpent, team.Name)
                    
                    
                    if (isBtnDisabled) {
                        cantBuyCurrentPlayer = false /** Domt show warning if players are already there in team */
                    }


                    return <div class="main-col team-col pr-0">
                        <div class="">
                            <div class="">
                                <button
                                    type="button"
                                    class={`btn btn-primary team-action-button fs-1dot5 ${team.Color
                                        }`}
                                    disabled={isBtnDisabled}
                                    name={team.Name}
                                    style={{
                                        backgroundColor: team.Color,
                                        borderColor: team.Color
                                    }}
                                    onClick={e => handleClickBuyTeam(e, team)}
                                >
                                    <div class="team-btn-row">
                                        <div class="team-name text-left">
                                            {team.Name}
                                        </div>
                                        <div class="team-coins text-right pl-0">
                                            <div class="rodw">
                                                <div class="col">
                                                    <div className={`${cantBuyCurrentPlayer ? 'cant-buy' : ''}`}>
                                                        {
                                                            cantBuyCurrentPlayer &&
                                                            <span title={
                                                                "This bid price cant be accomodated"
                                                            }>
                                                                    <img
                                                                        className="warning-icon"
                                                                        src={`${window.location.href}Images/warning.svg`}
                                                                        width={20}
                                                                        height={20}
                                                                        alt="img"
                                                                    />
                                                            </span>
                                                        }
                                                        <span class="team-coins-spent">
                                                            {
                                                                parseInt(team.Amount_Used)
                                                            }
                                                        </span>/
                                                        <span class="team-coins-total">
                                                            {
                                                                team.Amount_Assigned
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div class="team-player-list">
                            <div class="team-players-bg"
                                style={{
                                    backgroundImage: `url(${team.Logo})`
                                    // backgroundImage: `url('./NonBg/OldFox.png')`
                                }}
                            >
                            </div>
                            <div className="team-players-bg-fill">
                            </div>
                            <div class="">
                                {
                                    true &&
                                    // team.Players.map((player, index) => (
                                    <RenderPlayersAndSlots
                                        // player={player}
                                        team={team}
                                        setDeleteModal={setDeleteModal}
                                    />
                                    // ))
                                }

                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    );
};

const RenderPlayersAndSlots = ({ team, setDeleteModal }) => {

    /** @param renderPlayers => used to render empty list placeholder in UI  */
    let renderPlayers = team.Players ? [...team.Players] : []

    if (true) {
        let arrWithEmptyPlayerSlots = []
        const placeHolderArr = new Array(MIN_PLAYER_COUNT).fill(0)

        placeHolderArr.forEach((item, index) => {
            if (!renderPlayers?.[index] && (index < MIN_PLAYER_COUNT)) {
                arrWithEmptyPlayerSlots.push({
                    key: 'empty'
                })

                // arrWithEmptyPlayerSlots[index] = {
                //     key: 'empty'
                // }
            } else {
                arrWithEmptyPlayerSlots.push(renderPlayers?.[index])
                // arrWithEmptyPlayerSlots = renderPlayers?.[index]
            }
        })

        // renderPlayers = renderPlayers.forEach((item, index) => {
        //     if (!item?.id && index <= MIN_PLAYER_COUNT) {
        //         arrWithEmptyPlayerSlots.push({
        //             key: 'empty'
        //         })
        //     } else {
        //         arrWithEmptyPlayerSlots.push(item)
        //     }
        // })

        renderPlayers = cloneDeep(arrWithEmptyPlayerSlots)
    }

    return <>
        {
            renderPlayers.map((player, index) => {

                if (player?.key === "empty") {
                    return <div class="player-entry empty-row row mx-1">
                        <div class="player-name col col-10 text-left "></div>
                        <div class="player-coins col col-2 text-right pl-0"></div>
                    </div>
                }

                if (player?._id) {
                    const firstName = player.Name.split(' ')[0]
                    const lastName = player.Name.split(' ')[1]

                    return <div
                        class={`player-entry row mx-1 ${player.Gender === 'F' ? 'pale-yellow-bg' :
                            player.Gender === 'S' ? 'green-bg' : ''
                            }`}
                        style={{
                            background: `linear-gradient(90deg, ${player.Gender === "F" ? 'rgba(252,201,246,0.9)' : player.Gender === "S" ? 'rgba(131,247,113,0.9)' : 'rgba(255,255,255,0.9)'} 0%, rgba(255,255,255,0.9) 74%, ${team.Color} 100%)`
                        }}
                    >
                        <div class="player-name col col-10 text-align-left pr-0">
                            <span className="first-name"
                                style={{
                                    color: team.Color
                                }}
                            >{
                                    firstName
                                }
                                <span className="first-name-bg"
                                    style={{
                                        color: team.Color
                                    }}
                                ></span>
                            </span>
                            &nbsp;&nbsp;
                            <span
                                className={
                                    `${player.Gender === 'F' ? 'female-lastname' : ''}`
                                }
                            >
                                {lastName.length < 10 ? lastName : lastName.substring(0, 10) + '...'}
                            </span>
                            &nbsp;&nbsp;<span className="icon-wrap">
                                {
                                    player.Captain ? <span className="captain"></span> :
                                        player.GameChanger ? <span className="star"></span> : ''
                                }
                            </span>
                        </div>
                        <div class="player-coins col col-2 text-right pl-0">{player.SoldFor}</div>
                        <div className="del-btn display-none col col-1"
                            onClick={e => {
                                e.preventDefault()
                                setDeleteModal({ team, player })
                            }}
                        >
                            X
                        </div>
                    </div>
                }


                return <></>
            })
        }
    </>
}

export default TeamButtons;
