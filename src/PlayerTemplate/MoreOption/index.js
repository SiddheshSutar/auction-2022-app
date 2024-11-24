import { useState } from 'react';
import styles from './index.module.css'
import { Button, Dropdown, DropdownButton, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_BID_PRICE, MAX_AMOUNT } from '../../helpers';
import { handleDirectPlayerAdd, setReduxState } from '../../redux/storeSlice';
import players2 from '../../externalLists/ListOfPlayersLatest';
import { getTeams, updatePlayerList, updateTeamList } from '../../services';

const AssignDirectModal = ({
    show,
    handleYes,
    handleNo,
    setShowModal
}) => {

    const { initialPlayerList, initialTeamList, pendingPlayers, soldPlayers } = useSelector(state => state.store)
    const dispatch = useDispatch()
    
    
    // const captains = players2.filter(item => item.Captain)
    // const gameChangers = players2.filter(item => item.GameChanger)
    
    const playersToShow = [...initialPlayerList.filter(item => {
        
        return soldPlayers.every(soldPlrObj => soldPlrObj.id !== item.id) 
        // &&
        // pendingPlayers.every(pendingPlayrObj => pendingPlayrObj.id !== item.id)
    })
    // , ...captains, ...gameChangers
]
    
    const [selectedPlayerId, setSelectedPlayerId] = useState(null)
    const [selectedPlayerObj, setSelectedPlayerObj] = useState(null)
    const [selectedTeamId, setSelectedTeamId] = useState(null)
    const [selectedTeamObj, setSelectedTeamObj] = useState(null)
    const [selectedTeamAmountUsed, setSelectedTeamAmountUsed] = useState(MAX_AMOUNT)
    const [soldFor, setSoldFor] = useState(DEFAULT_BID_PRICE)

    const canBuyPlayer = soldFor <= (MAX_AMOUNT - selectedTeamAmountUsed)
    
    const handleSubmit = async e => {
        e.preventDefault()
        
        if(selectedPlayerId && selectedTeamId && soldFor) {
            dispatch(handleDirectPlayerAdd({
                selectedTeamId, selectedPlayerId, soldFor
            }))

            if (selectedTeamObj?._id && selectedPlayerObj?._id) {

                await updateTeamList({
                    data: [{
                        singlePlayer: true,
                        teamId: selectedTeamObj._id,
                        playerId: selectedPlayerObj._id,
                        Amount_Used: (selectedTeamObj.Amount_Used ?? 0) + soldFor
                    }]
                })
                await updatePlayerList({
                    data: [{
                        _id: selectedPlayerObj._id,
                        SoldFor: soldFor
                    }]

                })
            }

            const teamsResp = await getTeams()
            dispatch(setReduxState({
                key: 'initialTeamList',
                data: teamsResp.data
            }))
            setShowModal(false)
        } else {
            alert('Some error occured while assigning player')
            setShowModal(false)
        }
        
        
    }
    
    return <>
        <Modal className="text-center" show={show} onHide={() => setShowModal(false)} >
            <Modal.Header className="justify-content-center">
                <Modal.Title className="fs-2">Assign player to team</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form
                    className={`${styles['form-wrapper']}`}
                    onSubmit={handleSubmit}
                >
                    <Form.Group className={`${styles['form-group']} ${styles['form-wrapper']} mb-4`}>
                        <Form.Label className={`${styles['form-label']}`}>Select player to be assigned</Form.Label>
                        <Form.Control className={`${styles['fs-2']}`} as="select" value={selectedPlayerId} onChange={e => {
                            setSelectedPlayerId(e.target.value)

                            const selectedPlayerObj = initialPlayerList.find((obj) => obj.Name === e.target.value)

                            setSelectedPlayerObj(selectedPlayerObj)
                            
                            // dispatch(handleDirectPlayerAdd({
                            //     selectedPlayerId: e.target.value
                            // }))
                            // setShowModal(false)
                        }}>
                            <option>--select--</option>
                            {
                                playersToShow.map((item, index) => {

                                    return <option key={index} value={item.id}
                                        onClick={e => {
                                        }}
                                    >
                                        {item.Name}
                                    </option>
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    {
                        selectedPlayerId && <Form.Group className={`${styles['form-group']} mb-4`}>
                            <Form.Label className={`${styles['form-label']}`}>Assign to which team ?</Form.Label>
                            <Form.Control className={`${styles['fs-2']}`} as="select" value={selectedTeamId} onChange={e => {
                                const selectedTeamObj = initialTeamList.find((obj) => obj.Name === e.target.value)

                                setSelectedTeamId(e.target.value)
                                setSelectedTeamObj(selectedTeamObj)
                                
                                /** Set max amount which team can use */
                                setSelectedTeamAmountUsed(
                                    initialTeamList.find((item) => item._id === selectedTeamObj._id).Amount_Used
                                )
                            }}>
                                <option>--select--</option>
                                {
                                    initialTeamList.map((item, index) => {

                                        return <option key={index} value={item.id}
                                            onClick={e => {
                                                
                                            }}
                                        >
                                            {item.Name}
                                        </option>
                                    })
                                }
                            </Form.Control>
                        </Form.Group>
                    }
                    {
                        selectedTeamId && <>
                            <div className={`${styles['sold-for']} mb-4`} >
                                <div className={`${styles['sold-for']} ${
                                    !canBuyPlayer ? styles['red'] : ''
                                }`}>
                                    Spent:
                                </div>
                                {selectedTeamAmountUsed &&
                                    <div className={`${
                                        !canBuyPlayer ? styles['red'] : ''
                                    }`}>
                                        {selectedTeamAmountUsed}
                                    </div>
                                }
                                <div>|</div>
                                <div>
                                    Buy for:
                                </div>
                                <input
                                style={{
                                    width: '8ch'
                                }}
                                    type="number"
                                    name="sold-for"
                                    value={soldFor}
                                    onChange={e => {
                                        // if(soldFor >= selectedTeamAmountUsed) return
                                        setSoldFor(e.target.value)
                                    }}
                                />
                            </div>
                        </>
                    }
                    {
                        selectedPlayerId && selectedTeamId && canBuyPlayer && <>
                            <Button type="submit">Submit</Button>
                        </>
                    }
                </Form>
            </Modal.Body>
        </Modal>
    </>
}

const MoreOption = ({
    playerHasProfileVideo
}) => {
    const [moreOptionsList, openMoreOptionsList] = useState(false)

    return (
        <div className={`${styles['container']}`}>
            <img
                src='./Images/find.png'
                alt='find'
                className={`${styles['find']} ${playerHasProfileVideo ? styles['has-video'] : ''}`}
                title="Find Player"
                onClick={e => {
                    openMoreOptionsList(true)
                }}
            />
            {
                moreOptionsList && <>
                    <AssignDirectModal
                        show={moreOptionsList}
                        handleYes={e => { }}
                        handleNo={() => openMoreOptionsList(false)}
                        setShowModal={openMoreOptionsList}
                    />
                </>
            }
        </div>
    );
}

export default MoreOption;