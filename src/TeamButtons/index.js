import React, { Component, useState } from "react";
import "./index.css";
import teams from "../externalLists/ListOfTeams";
import { Modal, Button } from "react-bootstrap";

const ConfirmBuyPlayerModal = ({
    handleYes,
    handleNo
}) => {
    return <>
        <Modal.Dialog>
            <Modal.Header closeButton>
                <Modal.Title>Confirm ?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Confirming to buy player ?</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={handleYes}>yes</Button>
                <Button variant="secondary" onClick={handleNo}>no</Button>
            </Modal.Footer>
        </Modal.Dialog>
    </>
}
const TeamButtons = () => {
    const [showModal, setShowModal] = useState(false)

    const handleClickBuyTeam = (e) => {
        setShowModal(true)
    }

    return (
        <div class="container team-buttons-cntr">
            {
                showModal &&
                <ConfirmBuyPlayerModal
                    handleYes={() => alert('success')}
                    handleNo={() => setShowModal(false)}
                />
            }
            <div class="row title">Team Summary</div>
            <div class="row team-buttons m-0 px-0">
                
                {teams.map((team) => (
                    <div class="col col-3 main-col team-col pr-0">
                        <div class="row">
                            <div class="col">
                                <button
                                    type="button"
                                    class="btn btn-primary team-action-button"
                                    onClick={handleClickBuyTeam}
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
                                                    <span class="team-coins-total">200</span>
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
                                    [
                                        1, 2, 3, 4, 5, 6, 7, 8
                                    ].map((player, index) => (
                                        team.Players[index] ?
                                            <div class="player-entry row mx-1">
                                                <div class="player-name col col-9 ">{team.Players[index].name}</div>
                                                <div class="player-coins col col-3 text-right pl-0">{team.Players[index].soldFor}</div>
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
