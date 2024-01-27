import React, { Component, useState } from 'react';
import './index.css'
import { Modal, Button } from "react-bootstrap";
import players_array from '../externalLists/ListOfPlayers';


const PlayerCard = () => {

    const [playersgenerated, setPlayersGenerated] = useState([])
    const [playersNextRound, setPlayersNextRound] = useState([])
    const [player, setPlayer] = useState(players_array[0])

    const generateNewPlayer = (playerArr) => {
        const localPlayerArr = playerArr
        return localPlayerArr[Math.floor(Math.random()*(localPlayerArr.length) )];
    }

    const handleNextPlayer = (e) => {
        const localPlayerArr = players_array
        // let new_player_obj = localPlayerArr[Math.floor(Math.random()*(localPlayerArr.length) )];
        let new_player_obj = generateNewPlayer(players_array);

        // until get unique player,repeat
        while(playersgenerated.every(item => item.id === new_player_obj.id)) {
            new_player_obj = generateNewPlayer(players_array)
        }

        // Check if not already present in generated ones
        if(playersgenerated.every(item => item.id !== new_player_obj.id)){

            // if unique player, push to state for reuse
            setPlayersGenerated(state => {
                let newArr = state
                newArr.push(new_player_obj)
                return newArr
            })

            console.log('New Player: ', new_player_obj)
            setPlayer(new_player_obj)
        } else {
            console.log('already done: ', new_player_obj)
            alert('Bad')
        }
        
    }
    return (
        <div class="container">
            <div class="row">
                <div class="col col-lg-6 padding pr-0">
                    {player.Photo && <div class="player-image" style={{
                        backgroundImage: `url(${player.Photo})`
                    }}>

                    </div>}
                </div>
                <div class="col player-info padding pl-0 ">
                    <div class="info-row name mb-4">{player.Name}</div>
                    <div class="info-row age mb-4">{player.Age}</div>
                    {/* <div class="info-row number mb-4"> Number</div> */}
                    {/* <div class="info-row add-on-info mb-4"> add-on-info</div> */}
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