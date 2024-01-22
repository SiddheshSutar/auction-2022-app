import React, { Component, useEffect, useState } from "react";
import "./index.css";
import teams from "../externalLists/ListOfTeams";
import { Modal, Button } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux'
import { assignteamToPlayer } from '../redux/storeSlice'

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
const TeamButtons = () => {
    const [showModal, setShowModal] = useState(false)
    const currentPlayer = useSelector((state) => state.store.currentPlayer)
    const currentTeamList = useSelector((state) => state.store.initialTeamList)
    const currentBidPrice = useSelector((state) => state.store.currentBidPrice)
    const [teamClicked, setTeamClicked] = useState(null)
    const dispatch = useDispatch()

    const handleClickBuyTeam = (e, teamNamePassed) => {
        console.log('TEAM::', e.target)
        setTeamClicked(teamNamePassed)
        // console.log('Team player:',currentPlayer )

        setShowModal(true)
    }

    const handleBuyPlayer = () => {
        // alert('success: ', JSON.stringify(currentPlayer))
        // console.log('Team player:',currentPlayer )
        dispatch(assignteamToPlayer({teamClicked, currentPlayer}))
        setShowModal(false)
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
            <div class="row title">Team Summary</div>
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
                                    name={team.Name}
                                    style={{
                                        backgroundColor: team.Color,
                                        borderColor: team.Color
                                    }}
                                    onClick={e => handleClickBuyTeam(e, team.Name)}
                                >
                                    <div class="row">
                                        <div class="team-name col col-8 text-left">
                                            {team.Name}
                                        </div>
                                        <div class="team-coins col col-3 text-right pl-0">
                                            <div class="row m-0 ">
                                                <div>
                                                    <span class="team-coins-spent">
                                                        {
                                                            team.Amount_Used
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
                                                player.Gender === 'F' ? 'pink-bg' :
                                                player.Gender === 'S' ? 'green-bg' : ''
                                            }`}>
                                                <div class="player-name col col-9 text-align-left pr-0">{
                                                    player.Name.length < 15 ? player.Name : player.Name.substring(0,17) + '...'
                                                }</div>
                                                <div class="player-coins col col-3 text-right pl-0">{player.SoldFor}</div>
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
