import React, { Component, useEffect, useState } from 'react';
import './index.css'
import { Modal, Button } from "react-bootstrap";
import players_array from '../externalLists/ListOfPlayers';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPlayerInRedux } from '../redux/storeSlice'

const PlayerCard = () => {

    // const count = useSelector((state) => state.counter.value)
    const dispatch = useDispatch()
    // onClick={() => dispatch(increment())}

    const [playersgenerated, setPlayersGenerated] = useState([])
    const [player, setPlayer] = useState(players_array[0])
    const [playerIndexFromJson, setplayerIndexFromJson] = useState(0)

    useEffect(() => {
        //send update to redux
        if(!player) return
        dispatch(setCurrentPlayerInRedux(player))
    }, [player])

    const handleNextPlayer = (e) => {
        const localPlayerArr = players_array

        // Check if next click has happened till length of layer json
        if(playerIndexFromJson + 1 === players_array.length) {
            return
        }

        // let new_player_obj = localPlayerArr[Math.floor(Math.random()*(localPlayerArr.length) )];

        // const playerIndexFromJson = playersgenerated.length + 1 < players_array.length ? 
        // playersgenerated.length + 1 : 0

        let new_player_obj = localPlayerArr[playerIndexFromJson + 1]
        // Check if not already present in generated ones
        if(playersgenerated.every(item => item.id !== new_player_obj.id)){
            setPlayersGenerated(state => {
                let newArr = state
                newArr.push(new_player_obj)
                return newArr
            })
            console.log('New Player: ', new_player_obj)
            setPlayer(new_player_obj)
            setplayerIndexFromJson(state => state + 1)
        } else {
            console.log('already done: ', new_player_obj)

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