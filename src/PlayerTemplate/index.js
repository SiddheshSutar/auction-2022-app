import React, { Component, useEffect, useState } from 'react';
import './index.css'
import { Modal, Button, Row, Col } from "react-bootstrap";
import players_array from '../externalLists/ListOfPlayers';
import { useSelector, useDispatch } from 'react-redux'
import {
    setCurrentPlayerInRedux, setCurrentBidPrice, nextPlayerAction, handlePendingList,
    addToPending, getLocalStorage, setLocalStorage, setfetcherFlag, askWhetherToFetchNext
} from '../redux/storeSlice'
import axios from 'axios';
import MoreOption from './MoreOption';


const ConfirmfetchHistoryModal = ({
    show,
    handleYes,
    handleNo,
    setShowModal
}) => {
    return <>
        <Modal className="text-center" show={show} onHide={() => setShowModal(false)} >
            <Modal.Header className="justify-content-center">
                <Modal.Title className="fs-2">Confirm ?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="fs-2">are you sure to fetch from history ?</p>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
                <Button className="fs-2" variant="primary" onClick={e => handleYes(e)}>Yes</Button>
                <Button className="fs-2" variant="secondary" onClick={handleNo}>No</Button>
            </Modal.Footer>
        </Modal>
    </>
}

const ConfirmFetchNextModal = ({
    show,
    handleYes,
    handleNo,
    setShowModal
}) => {
    return <>
        <Modal className="text-center" show={show} onHide={() => setShowModal(false)} >
            <Modal.Header className="justify-content-center">
                <Modal.Title className="fs-2">Confirm ?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="fs-2">Show next player ?</p>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
                <Button className="fs-2" variant="primary" onClick={e => handleYes(e)}>yes</Button>
                <Button className="fs-2" variant="secondary" onClick={handleNo}>No</Button>
            </Modal.Footer>
        </Modal>
    </>
}


const PlayerCard = () => {

    const dispatch = useDispatch()

    const lastPlayerBought = useSelector((state) => state.store.lastPlayerBought)
    const currentBidPrice = useSelector((state) => state.store.currentBidPrice)
    const currentPlayer = useSelector((state) => state.store.currentPlayer)
    const playerIndexFromJsonRedux = useSelector((state) => state.store.playerIndexFromJson)
    const shouldStartForPendingRedux = useSelector((state) => state.store.shouldStartForPending)
    const initialPlayerListRedux = useSelector((state) => state.store.initialPlayerList)
    const disableNextRedux = useSelector((state) => state.store.disableNext)
    const doneFetchingFromLocalRedux = useSelector((state) => state.store.doneFetchingFromLocal)
    const pendingPlayersRedux = useSelector((state) => state.store.pendingPlayers)
    const {
    } = useSelector((state) => state.store)

    const [playersgenerated, setPlayersGenerated] = useState([])
    const [shouldStartPending, setshouldStartPending] = useState(false)
    const [fetchfromHistory, setfetchfromHistory] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showNextFetchModal, setShowNextFetchModal] = useState(false)

    const [currentAuctionPlayerList, setcurrentAuctionPlayerList] = useState(initialPlayerListRedux)
    const [playerIndexFromJson, setplayerIndexFromJson] = useState(playerIndexFromJsonRedux)
    const [tempPlayerList, setTempPlayerList] = useState(initialPlayerListRedux)


    //didMount
    useEffect(() => {
        setcurrentAuctionPlayerList(players_array)

        return () => {
            dispatch(setLocalStorage())
        }
    }, [])

    useEffect(() => {
        if (!currentPlayer) return
        // console.log('St Up:', currentPlayer)
        // setPlayer(currentPlayer)
    }, [currentPlayer])

    // when team list refreshes and player was bought, get the player for being displayed
    useEffect(() => {
        const condtn_refresh = pendingPlayersRedux &&
            pendingPlayersRedux.length > 0 &&
            pendingPlayersRedux[pendingPlayersRedux.length - 1].Name !== currentPlayer.Name

        if (lastPlayerBought) {
            // if (lastPlayerBought && condtn_refresh ) {
            handleNextPlayer({}, currentAuctionPlayerList)
            dispatch(addToPending(lastPlayerBought))
            dispatch(setLocalStorage())

        }
    }, [lastPlayerBought])

    // assign latest list, if changed
    useEffect(() => {
        if (initialPlayerListRedux) setcurrentAuctionPlayerList(initialPlayerListRedux)
    }, [initialPlayerListRedux])

    // when don elocal fetchin, close modal
    useEffect(() => {
        if (showModal && doneFetchingFromLocalRedux) {
            dispatch(setfetcherFlag(false))
            setShowModal(false)
        }
    }, [doneFetchingFromLocalRedux])

    const handleNextPlayer = (e, playerList) => {
        e.preventDefault && e.preventDefault()
        dispatch(nextPlayerAction({
            playerList
        }))
        dispatch(setLocalStorage())
        showNextFetchModal && setShowNextFetchModal(false)
    }

    const TriggerFetchConfirmationModal = (e, currentAuctionPlayerListPassed) => {
        e.preventDefault && e.preventDefault()

        setShowNextFetchModal(true)
        setTempPlayerList(currentAuctionPlayerListPassed)

    }

    const handlePendingListStartClick = (e) => {
        dispatch(handlePendingList())
    }

    const handleHistoryFetch = e => {
        dispatch(getLocalStorage())
    }

    // useEffect(() => {
    //     fetch(currentPlayer.Photo)
    //         .then(res => {
    //             console.log('res: ', res)
    //         })
    // }, [])

    return (
        <div class="container max-width-90">
            <div class="row">
                <div id="player-image-div" class="col col-lg-5 padding pr-0">
                    {/* <img id="player-photo" src={'./SatishDesai.jpg'} */}
                    <img id="player-photo" src={currentPlayer.Photo}
                        loading='eager'
                    ></img>
                </div>
                <div class="col player-info padding pl-0 ">
                    <Row className='align-items-center'>
                        <Col>
                            <div class="info-row name mb-2">{currentPlayer.Name}</div>
                           
                        </Col>
                        <Col sm={1}>
                            <MoreOption />
                        </Col>
                    </Row>
                        <div class="info-row age mb-2">{
                            currentPlayer.Gender === 'S' ? 'Senior member' : 'Player'
                        }</div>
                    
                    {/* <div class="info-row number mb-4"> Number</div> */}
                    {/* <div class="info-row add-on-info mb-4"> add-on-info</div> */}
                    <Row className='slider-btns mb-4'>
                        <Col className="col-4 numeric-row">
                            <Row className='mb-2'>
                                <Button className="one-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice - 1)) }}>
                                    -
                                </Button>
                            </Row>
                            <Row className='gap-1'>
                                <Col className='px-0'>
                                    <Button className="five-btn width-100" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice - 5)) }}>
                                        -5
                                    </Button>
                                </Col>
                                <Col className='px-0'>
                                    <Button className="five-btn width-100" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice - 10)) }}>
                                        -10
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="col-4">
                            <div className='current-bid-price'>
                                {currentBidPrice}
                            </div>
                        </Col>
                        <Col className="col-4 numeric-row">
                            <Row className='mb-2'>
                                <Button className="one-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice + 1)) }}>
                                    +
                                </Button>
                            </Row>
                            <Row className='gap-1'>
                                <Col className='px-0'>
                                    <Button className="five-btn width-100" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice + 5)) }}>
                                        +5
                                    </Button>
                                </Col>
                                <Col className='px-0'>
                                    <Button className="five-btn width-100" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice + 10)) }}>
                                        +10
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                            </Row>
                        </Col>

                    </Row>
                    <Row className='slider-btns'>
                        <Col>
                            <Button className="bg-color-faint" onClick={e => setShowModal(true)}>
                                Fetch From history ?
                            </Button>
                        </Col>
                        <Col>
                            <Button className="bg-color-faint" disabled={!shouldStartForPendingRedux} onClick={e => handlePendingListStartClick(e)}>
                                Start pending player's auction
                            </Button>
                        </Col>
                        <Col className="">
                            {/* <Button className="bg-color-faint width-inherit" disabled={disableNextRedux} onClick={e => handleNextPlayer(e, currentAuctionPlayerList)}> */}
                            <Button className="bg-color-faint width-inherit" disabled={disableNextRedux} onClick={e => TriggerFetchConfirmationModal(e, currentAuctionPlayerList)}>
                                Next Player
                            </Button>
                        </Col>
                    </Row>
                    <Row className='slider-btns mt-2'>

                        {
                            showModal &&
                            <ConfirmfetchHistoryModal
                                show={showModal}
                                handleYes={e => handleHistoryFetch(e)}
                                handleNo={() => setShowModal(false)}
                                setShowModal={setShowModal}
                            />
                        }
                        {
                            showNextFetchModal &&
                            <ConfirmFetchNextModal
                                show={showNextFetchModal}
                                handleYes={e => handleNextPlayer(e, tempPlayerList)}
                                handleNo={() => setShowNextFetchModal(false)}
                                setShowModal={setShowNextFetchModal}
                            />
                        }
                    </Row>
                </div>
            </div>
        </div>
    );
}

export default PlayerCard;