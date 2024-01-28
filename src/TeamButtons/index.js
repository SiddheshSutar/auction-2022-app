import React, { Component, useEffect, useState } from "react";
import "./index.css";
import teams from "../externalLists/ListOfTeams";
import { Modal, Button } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux'
import { assignteamToPlayer, deletePlayer, storeMatches } from '../redux/storeSlice'
import { MAX_AMOUNT, checkFemaleOrSenior, generateMatches, isSelfSenior } from "../helpers";
import parse from 'html-react-parser'

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
                <Button className="fs-2" variant="primary" onClick={e => handleYes(e)}>yes</Button>
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
    const {team, player} = show
    
    if(!team || !player) return <></>
    
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
                <Button className="fs-2" variant="primary" onClick={e => handleYes({team, player})}>yes</Button>
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
                        setMatches(generateMatches())
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
                                {parse(item)}
                            </div>
                        })
                    }
                </div>
            </Modal.Body>
        </Modal>
    </>
}
const TeamButtons = () => {
    const [showModal, setShowModal] = useState(false)
    const [openDeleteModal, setDeleteModal] = useState(null)
    const [openMatchListModal, toggleMatchListModal] = useState(false)
    
    const currentPlayer = useSelector((state) => state.store.currentPlayer)
    const currentTeamList = useSelector((state) => state.store.initialTeamList)
    const currentBidPrice = useSelector((state) => state.store.currentBidPrice)
    const [teamClicked, setTeamClicked] = useState(null)
    const dispatch = useDispatch()

    const handleClickBuyTeam = (e, teamNamePassed) => {
        setTeamClicked(teamNamePassed)
        setShowModal(true)
    }

    const handleBuyPlayer = () => {
        // alert('success: ', JSON.stringify(currentPlayer))
        // console.log('Team player:',currentPlayer )
        dispatch(assignteamToPlayer({teamClicked, currentPlayer}))
        setShowModal(false)
    }

    const handleDeletePlayer = ({player, team}) => {
        dispatch(deletePlayer({player, team}))
        setDeleteModal(null)
    }

    useEffect(() => {
        //reset team once player bought
        if(!showModal) setTeamClicked(null)
    }, [showModal])

    return (
        <div class="container-tb team-buttons-cntr">
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
                    handleYes={({player, team}) => handleDeletePlayer({player, team})}
                    handleNo={() => setDeleteModal(null)}
                    setShowModal={setDeleteModal}
                /> 
            }
            {
                (openMatchListModal) &&
                <MatchListModal
                    show={openMatchListModal}
                    handleYes={() => {}}
                    handleNo={() => toggleMatchListModal(null)}
                    setShowModal={toggleMatchListModal}
                /> 
            }
            <div class="row title">
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
            </div>
            <div class="row team-buttons">
                
                {currentTeamList.map((team) => (
                    <div class="col col-3 main-col team-col pr-0">
                        <div class="row">
                            <div class="col">
                                <button
                                    type="button"
                                    class={`btn btn-primary team-action-button fs-1dot5 ${
                                        team.Color
                                    }`}
                                    disabled={currentBidPrice <= 0 || (
                                        MAX_AMOUNT - team.Amount_Used < currentBidPrice
                                    ) || (
                                        checkFemaleOrSenior({
                                            currentTeam: team,
                                            teams: currentTeamList,
                                            currentPlayer: currentPlayer
                                        })
                                    ) 
                                    // || (
                                    //     isSelfSenior({
                                    //         currentTeam: team,
                                    //         currentPlayer: currentPlayer
                                    //     })
                                    // )
                                }
                                    name={team.Name}
                                    style={{
                                        backgroundColor: team.Color,
                                        borderColor: team.Color
                                    }}
                                    onClick={e => handleClickBuyTeam(e, team.Name)}
                                >
                                    <div class="team-btn-row">
                                        <div class="team-name text-left">
                                            {team.Name}
                                        </div>
                                        <div class="team-coins text-right pl-0">
                                            <div class="row">
                                                <div class="col">
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
                                </button>
                            </div>
                        </div>
                        <div class="team-player-list row">
                            <div class="col">
                                {
                                    team.Players.map((player, index) => (
                                        player ?
                                            <div class={`player-entry row mx-1 ${
                                                player.Gender === 'F' ? 'pale-yellow-bg' :
                                                player.Gender === 'S' ? 'green-bg' : ''
                                            }`}>
                                                <div class="player-name col col-9 text-align-left pr-0">{
                                                    player.Name.length < 20 ? player.Name : player.Name.substring(0,20) + '...'
                                                }&nbsp;&nbsp;{
                                                    player.Captain ? <span className="captain"></span> : 
                                                         player.GameChanger ? <span className="star"></span>: ''
                                                }</div>
                                                <div class="player-coins col col-3 text-right pl-0">{player.SoldFor}</div>
                                                {/* <div className="del-btn display-none col col-1"
                                                    onClick={e => {
                                                        e.preventDefault()
                                                        setDeleteModal({team, player})
                                                    }}
                                                >
                                                    X
                                                </div> */}
                                            </div> :
                                            <div class="player-entry row mx-1" style={{ minHeight: '30px' }}>
                                                <div class="player-name col col-9 "></div>
                                                <div class="player-coins col col-3 text-right pl-0"></div>
                                            </div>
                                    ))
                                }

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamButtons;
