import React, { Component, useCallback, useEffect, useState } from 'react';
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
import ReactPlayer from 'react-player';
import CountUp from 'react-countup';


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
	const { previousBidPrice } = useSelector((state) => state.store)

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

	if (!currentPlayer) return <></>

	const playerHasProfileVideo = currentPlayer?.Video

	// if (playerHasProfileVideo) {
	// 	return <VideoUpperRow playerHasProfileVideo={playerHasProfileVideo} />
	// }

	return (
		<div class="container left-c" style={{
			paddingTop: "10px"
		}}>
			<div className={`rowX upper-row ${playerHasProfileVideo ? ' upper-has-video' : ''}`}>
				{
					playerHasProfileVideo ?
					<VideoUpperRow
						playerHasProfileVideo={playerHasProfileVideo}
					/> :
					<div>
					<div className='current-bid-price'>
						{/* {currentBidPrice} */}
						<CountUp start={previousBidPrice ?? 0} end={currentBidPrice} duration={2} />
					</div>
					<div id="player-image-div" class={`pr-0 ${currentPlayer.GameChanger ? ' game-changer' : ''
						}`}>
						{/* <img id="player-photo" src={'./SatishDesai.jpg'} */}
						<img id="player-photo"
							className={currentPlayer.GameChanger ? 'game-changer' : ''}
							src={currentPlayer.Photo}
							loading='eager'
						></img>
					</div>
				</div>
				}
				<div class="col player-info pl-0 ">
					{false && <Row className='align-items-center'>
						<Col>
							<Row>
								{!playerHasProfileVideo && <Col className='p-0'>
									<div class="info-row name mb-2">{currentPlayer.Name}</div>
								</Col>}
							</Row>
						</Col>
						<Col sm={1}>
							<MoreOption />
						</Col>
					</Row>}
					{/* <div class="info-row info-row-dark age mb-2">{
                            currentPlayer.Gender === 'S' ? 'Senior member' : 'Player'
                        }</div> */}

					{/* <div class="info-row number mb-4"> Number</div> */}
					{/* <div class="info-row add-on-info mb-4"> add-on-info</div> */}
					<Row className='slider-btns mb-4'>
						<Col className=" numeric-row">
							<Row className='gap-1 btns-c'>
								<Col sm={1}>
									<MoreOption playerHasProfileVideo />
								</Col>
								<Col className='horiz-btn-col px-0'>
									<Button className="five-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice - 10)) }}>
										-10
									</Button>
								</Col>
								<Col className='horiz-btn-col px-0'>
									<Button className="five-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice - 5)) }}>
										-5
									</Button>
								</Col>
								<Col className='horiz-btn-col px-0'>
									<Button className="one-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice - 1)) }}>
										-
									</Button>
								</Col>
								{/* <Col className='horiz-btn-col px-0'>
																	<div className='current-bid-price-sm'>
																			{currentBidPrice}
																	</div>
															</Col> */}
								<Col className='horiz-btn-col px-0'>
									<Button className="one-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice + 1)) }}>
										+
									</Button>
								</Col>
								<Col className='horiz-btn-col px-0'>
									<Button className="five-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice + 5)) }}>
										+5
									</Button>
								</Col>
								<Col className='horiz-btn-col px-0'>
									<Button className="five-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice + 10)) }}>
										+10
									</Button>
								</Col>
							</Row>
						</Col>
					</Row>
					{false && <Row className='slider-btns mb-4'>
						<Col className=" numeric-row">
							<Row className='gap-1'>
								<Col className='horiz-btn-col px-0'>
									<Button className="five-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice - 10)) }}>
										-10
									</Button>
								</Col>
								<Col className='horiz-btn-col px-0'>
									<Button className="five-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice - 5)) }}>
										-5
									</Button>
								</Col>
								<Col className='horiz-btn-col px-0'>
									<Button className="one-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice - 1)) }}>
										-
									</Button>
								</Col>
								{/* <Col className='horiz-btn-col px-0'>
                                    <div className='current-bid-price-sm'>
                                        {currentBidPrice}
                                    </div>
                                </Col> */}
								<Col className='horiz-btn-col px-0'>
									<Button className="one-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice + 1)) }}>
										+
									</Button>
								</Col>
								<Col className='horiz-btn-col px-0'>
									<Button className="five-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice + 5)) }}>
										+5
									</Button>
								</Col>
								<Col className='horiz-btn-col px-0'>
									<Button className="five-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice + 10)) }}>
										+10
									</Button>
								</Col>
							</Row>
						</Col>
					</Row>}
					{false && <Row className='slider-btns'>
						<Col>
							<Button className="bg-color-faint" onClick={e => setShowModal(true)}>
								Fetch From history ?
							</Button>
						</Col>
						<Col>
							<Button className="bg-color-faint" 
								disabled={!shouldStartForPendingRedux}
							 onClick={e => handlePendingListStartClick(e)}>
								Start pending player's auction
							</Button>
						</Col>
						<Col className="">
							{/* <Button className="bg-color-faint width-inherit" disabled={disableNextRedux} onClick={e => handleNextPlayer(e, currentAuctionPlayerList)}> */}
							<Button className="bg-color-faint width-inherit" disabled={disableNextRedux} onClick={e => TriggerFetchConfirmationModal(e, currentAuctionPlayerList)}>
								Next Player
							</Button>
						</Col>
					</Row>}
					<div className="add-on-btns-row">
						<Button size='sm' className="bg-color-faint" onClick={e => setShowModal(true)}>
							Fetch From history ?
						</Button>
						<Button size='sm' className="bg-color-faint" 
						disabled={!shouldStartForPendingRedux}
						 onClick={e => handlePendingListStartClick(e)}>
							Start pending player's auction
						</Button>
						{/* <Button size='sm' className="bg-color-faint width-inherit" disabled={disableNextRedux} onClick={e => handleNextPlayer(e, currentAuctionPlayerList)}> */}
						<Button size='sm' className="bg-color-faint width-inherit" disabled={disableNextRedux} onClick={e => TriggerFetchConfirmationModal(e, currentAuctionPlayerList)}>
							Next Player
						</Button>
					</div>
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


const VideoUpperRow = ({
	playerHasProfileVideo,

}) => {
	const dispatch = useDispatch()
	const initialPlayerListRedux = useSelector((state) => state.store.initialPlayerList)
	const currentBidPrice = useSelector((state) => state.store.currentBidPrice)
	const shouldStartForPendingRedux = useSelector((state) => state.store.shouldStartForPending)
	const disableNextRedux = useSelector((state) => state.store.disableNext)
	const { previousBidPrice
	} = useSelector((state) => state.store)

	const [showModal, setShowModal] = useState(false)
	const [showNextFetchModal, setShowNextFetchModal] = useState(false)

	const [currentAuctionPlayerList, setcurrentAuctionPlayerList] = useState(initialPlayerListRedux)
	const [tempPlayerList, setTempPlayerList] = useState(initialPlayerListRedux)

	const TriggerFetchConfirmationModal = (e, currentAuctionPlayerListPassed) => {
		e.preventDefault && e.preventDefault()

		setShowNextFetchModal(true)
		setTempPlayerList(currentAuctionPlayerListPassed)

	}

	useEffect(() => {

	}, [currentBidPrice])

	const handlePendingListStartClick = (e) => {
		dispatch(handlePendingList())
	}

	return <div className='react-player-wrapper'>
		<VideoPlayer
			playerHasProfileVideo={playerHasProfileVideo}
		/>
		<div className='current-bid-price'>
			<CountUp start={previousBidPrice ?? 0} end={currentBidPrice} duration={2} />
			{/* {currentBidPrice} */}
		</div>
	</div>

	return (
		<div class="left-c upper-has-video" style={{
			paddingTop: "10px"
		}}>
			<div class="video-upper-row">
				<div className='react-player-wrapper'>
					<VideoPlayer
						playerHasProfileVideo={playerHasProfileVideo}
					/>
					<div className='current-bid-price'>
						<CountUp start={previousBidPrice ?? 0} end={currentBidPrice} />
						{/* {currentBidPrice} */}
					</div>
				</div>
				<div class="player-info ">
					<Row className='slider-btns mb-4'>
						<Col className=" numeric-row">
							<Row className='gap-1 btns-c'>
								<Col sm={1}>
									<MoreOption playerHasProfileVideo />
								</Col>
								<Col className='horiz-btn-col px-0'>
									<Button className="five-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice - 10)) }}>
										-10
									</Button>
								</Col>
								<Col className='horiz-btn-col px-0'>
									<Button className="five-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice - 5)) }}>
										-5
									</Button>
								</Col>
								<Col className='horiz-btn-col px-0'>
									<Button className="one-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice - 1)) }}>
										-
									</Button>
								</Col>
								{/* <Col className='horiz-btn-col px-0'>
																	<div className='current-bid-price-sm'>
																			{currentBidPrice}
																	</div>
															</Col> */}
								<Col className='horiz-btn-col px-0'>
									<Button className="one-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice + 1)) }}>
										+
									</Button>
								</Col>
								<Col className='horiz-btn-col px-0'>
									<Button className="five-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice + 5)) }}>
										+5
									</Button>
								</Col>
								<Col className='horiz-btn-col px-0'>
									<Button className="five-btn" onClick={e => { dispatch(setCurrentBidPrice(currentBidPrice + 10)) }}>
										+10
									</Button>
								</Col>
							</Row>
						</Col>
					</Row>
					<div className="add-on-btns-row">
						<Button size='sm' className="bg-color-faint" onClick={e => setShowModal(true)}>
							Fetch From history ?
						</Button>
						<Button size='sm' className="bg-color-faint" disabled={!shouldStartForPendingRedux} onClick={e => handlePendingListStartClick(e)}>
							Start pending player's auction
						</Button>
						{/* <Button size='sm' className="bg-color-faint width-inherit" disabled={disableNextRedux} onClick={e => handleNextPlayer(e, currentAuctionPlayerList)}> */}
						<Button size='sm' className="bg-color-faint width-inherit" disabled={disableNextRedux} onClick={e => TriggerFetchConfirmationModal(e, currentAuctionPlayerList)}>
							Next Player
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

const VideoPlayer = ({
	playerHasProfileVideo
}) => {
	const [playing, setPlaying] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setPlaying(true);
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	return <ReactPlayer
		url={playerHasProfileVideo}
		muted={true}    // Mute video
		controls={false} // Hide controls
		playing={playing}
		width="100%"
		height="450px"
	/>
}


export default PlayerCard;