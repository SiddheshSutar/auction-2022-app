import React, { Component, useState } from 'react';
import './index.css'
import { Modal, Button } from "react-bootstrap";
import players_array from '../externalLists/ListOfPlayers';

const PlayerCard = () => {

    const [playersgenerated, setPlayersGenerated] = useState([])

    const handleNextPlayer = (e) => {
        const localPlayerArr = players_array
        let new_player_obj = localPlayerArr[Math.floor(Math.random()*(localPlayerArr.length) )];

        // Check if not already present in generated ones
        if(playersgenerated.every(item => item.id !== new_player_obj.id)){
            setPlayersGenerated(state => {
                let newArr = state
                newArr.push(new_player_obj)
                return newArr
            })
            console.log('New Player: ', new_player_obj)
        } else {
            console.log('already done: ', new_player_obj)

        }
        
    }
    return (
        <div class="container">
            <div class="row">
                <div class="col col-lg-6 padding pr-0">
                    <div class="player-image">

                    </div>
                </div>
                <div class="col player-info padding pl-0 ">
                    <div class="info-row name mb-4">Plyer name</div>
                    <div class="info-row age mb-4">Player age</div>
                    <div class="info-row number mb-4"> Number</div>
                    <div class="info-row add-on-info mb-4"> add-on-info</div>
                </div>
            </div>
            <div className='slider-btns'>
                <Button onClick={handleNextPlayer}>
                    Next
                </Button>
            </div>
        </div>
    );
}
 
export default PlayerCard;