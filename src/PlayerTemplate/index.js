import React, { Component, useEffect, useState } from 'react';
import './index.css'
import { Modal, Button, Row, Col } from "react-bootstrap";
import players_array from '../externalLists/ListOfPlayers';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPlayerInRedux, setCurrentBidPrice } from '../redux/storeSlice'

const PlayerCard = () => {

    // const count = useSelector((state) => state.counter.value)
    const dispatch = useDispatch()
    // onClick={() => dispatch(increment())}

    const [playersgenerated, setPlayersGenerated] = useState([])
    const [player, setPlayer] = useState(players_array[0])
    const [shouldStartPending, setshouldStartPending] = useState(false)
    const [currentAuctionPlayerList, setcurrentAuctionPlayerList] = useState([])
    const [playerIndexFromJson, setplayerIndexFromJson] = useState(0)

    const lastPlayerRemoved = useSelector((state) => state.store.lastPlayerRemoved)
    const currentBidPrice = useSelector((state) => state.store.currentBidPrice)


    //didMount
    useEffect(() => {
        setcurrentAuctionPlayerList(players_array)
    }, [])

    useEffect(() => {
        //send update to redux
        if (!player) return
        dispatch(setCurrentPlayerInRedux(player))
    }, [player])

    // when team list refreshes and player was bought, change the player being displayed
    useEffect(() => {

        if(lastPlayerRemoved) {
            handleNextPlayer({}, currentAuctionPlayerList)
        }
    }, [lastPlayerRemoved])

    const handleNextPlayer = (e, playerList) => {
        const localPlayerArr = playerList

        // Check if next click has happened till length of layer json
        if (playerIndexFromJson + 1 === playerList.length) {
            setshouldStartPending(true)
            return
        }

        // Check if not already present in generated ones
        let new_player_obj = localPlayerArr[playerIndexFromJson + 1]
        if (playersgenerated.every(item => item.id !== new_player_obj.id)) {
            setPlayersGenerated(state => {
                let newArr = state
                newArr.push(new_player_obj)
                return newArr
            })
            // console.log('New Player: ', new_player_obj)
            setPlayer(new_player_obj)
            setplayerIndexFromJson(state => state + 1)
        } else {
            // console.log('already done: ', new_player_obj)

        }

    }

    const handlePendingListStartClick = (e) => {
        setcurrentAuctionPlayerList(players_array)
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
                    <div class="info-row age mb-4">Age: {player.Age}</div>
                    {/* <div class="info-row number mb-4"> Number</div> */}
                    {/* <div class="info-row add-on-info mb-4"> add-on-info</div> */}
                    <Row className='slider-btns mb-4'>
                        <Col>
                            <Button onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice - 5)) }}>
                                -5
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice - 1)) }}>
                                -
                            </Button>
                        </Col>
                        <Col lg={3} >
                            <div className='current-bid-price'>
                                {currentBidPrice}
                            </div>
                        </Col>
                        <Col>
                            <Button onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice + 1)) }}>
                                +
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice + 5)) }}>
                                +5
                            </Button>
                        </Col>
                    </Row>
                    <Row className='slider-btns mb-4'>
                        <Col>
                            <Button onClick={e => handleNextPlayer(e, currentAuctionPlayerList)}>
                                Next Player
                            </Button>
                        </Col>
                    </Row>
                    <Row className='slider-btns'>
                        <Col>
                            <Button disabled={!shouldStartPending} onClick={e => handlePendingListStartClick(e)}>
                                Start pending player's auction
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}

export default PlayerCard;