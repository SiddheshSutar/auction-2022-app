import React, { Component, useEffect, useState } from 'react';
import './index.css'
import { Modal, Button, Row, Col } from "react-bootstrap";
import players_array from '../externalLists/ListOfPlayers';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPlayerInRedux, setCurrentBidPrice, nextPlayerAction, handlePendingList,
    addToPending } from '../redux/storeSlice'
import axios from 'axios';

const PlayerCard = () => {

    const dispatch = useDispatch()

    const lastPlayerBought = useSelector((state) => state.store.lastPlayerBought)
    const currentBidPrice = useSelector((state) => state.store.currentBidPrice)
    const currentPlayer = useSelector((state) => state.store.currentPlayer)
    const playerIndexFromJsonRedux = useSelector((state) => state.store.playerIndexFromJson)
    const shouldStartForPendingRedux = useSelector((state) => state.store.shouldStartForPending)
    const initialPlayerListRedux = useSelector((state) => state.store.initialPlayerList)
    const disableNextRedux = useSelector((state) => state.store.disableNext)

    const [playersgenerated, setPlayersGenerated] = useState([])
    const [shouldStartPending, setshouldStartPending] = useState(false)
    const [currentAuctionPlayerList, setcurrentAuctionPlayerList] = useState(initialPlayerListRedux)
    const [playerIndexFromJson, setplayerIndexFromJson] = useState(playerIndexFromJsonRedux)


    //didMount
    useEffect(() => {
        setcurrentAuctionPlayerList(players_array)
    }, [])

    useEffect(() => {
        if(!currentPlayer) return
        // console.log('St Up:', currentPlayer)
        // setPlayer(currentPlayer)
    }, [currentPlayer])

    // when team list refreshes and player was bought, get the player for being displayed
    useEffect(() => {

        if(lastPlayerBought) {
            handleNextPlayer({}, currentAuctionPlayerList)
            dispatch(addToPending(lastPlayerBought))
        }
    }, [lastPlayerBought])

    // assign latest list, if changed
    useEffect(() => {
        if(initialPlayerListRedux) setcurrentAuctionPlayerList(initialPlayerListRedux)
    }, [initialPlayerListRedux])

    const handleNextPlayer = (e, playerList) => {
        e.preventDefault && e.preventDefault()
        dispatch(nextPlayerAction({
            playerList
        }))
    }

    const handlePendingListStartClick = (e) => {
        dispatch(handlePendingList())
    }
    return (
        <div class="container">
            <div class="row">
                <div id ="player-image-div" class="col col-lg-4 padding pr-0">
                    <img  id = "player-photo"src ={currentPlayer.Photo}></img>    
                </div>
                <div class="col player-info padding pl-0 ">
                    <div class="info-row name mb-4">{currentPlayer.Name}</div>
                    <div class="info-row age mb-4">Age: {currentPlayer.Age}</div>
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
                    <Row className='slider-btns mb-4 justify-content-end'>
                        <Col className="col col-lg-8">
                            {/* <Button disabled={shouldStartForPendingRedux} onClick={e => handleNextPlayer(e, currentAuctionPlayerList)}> */}
                            <Button disabled={disableNextRedux} onClick={e => handleNextPlayer(e, currentAuctionPlayerList)}>
                                Next Player
                            </Button>
                        </Col>
                    </Row>
                    <Row className='slider-btns'>
                        <Col>
                            <Button disabled={!shouldStartForPendingRedux} onClick={e => handlePendingListStartClick(e)}>
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