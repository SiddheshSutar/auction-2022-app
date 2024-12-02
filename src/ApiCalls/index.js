import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPlayers, getTeams, setPlayer, setTeam } from "../services";
import teams from "../externalLists/ListOfTeams";
import players_array from "../externalLists/ListOfPlayersLatest";
import { API_BASED_APP, removeIdKeyFromArry } from "../helpers";
import { cloneDeep } from "lodash";
import { setReduxState } from "../redux/storeSlice";
import { teamsFinal } from "../externalLists/teamsFinal";
import { apiPlayers } from "../externalLists/apiPlayers";
import { apiTeams } from "../externalLists/apiTeams";

const ApiCalls = () => {
    const { initialPlayerList, initialTeamList, playersGenerated, currentPlayer, playerIndexFromJson } = useSelector(state => state.store)

    const dispatch = useDispatch()
    
    const loadJsonIntoDb = async () => {
         /** To insert players when app loads */
        // await setPlayer({
        //     data: removeIdKeyFromArry(cloneDeep(
        //         players_array.filter((item) => {
        //           return true
        //           // return !item.Captain && !item.GameChanger
        //         })
        //       ))
        // })
        
        // /** To insert teams when app loads */
        // await setTeam({
        //     data: removeIdKeyFromArry(cloneDeep(teams))
        // })
        
        
        const teamsResp = API_BASED_APP ? await getTeams() : { success: true, data: teams }
        const playersResp = API_BASED_APP ? await getPlayers() : { success: true, data: players_array }

        if(!teamsResp.success || !playersResp.success) { /** Alert used in case API fails to access BE  */
            alert('Sync failed ! Using local state..')
        }
        
        dispatch(setReduxState({
            key: 'initialTeamList',
            // data: teamsResp.data
            data: apiTeams
        }))
        dispatch(setReduxState({
            key: 'initialPlayerList',
            // data: playersResp.data
            data: apiPlayers
        }))
        
        playersGenerated.length <=0 && dispatch(setReduxState({ /** Initially set 1st player as generated player*/
            key: 'playersGenerated',
            data: [playersResp.data[0]]
            // data: [players_array[0]]
        }))
        
        /** Check sold players and accordingly set playerIndexFromJson */
        const playerIndexToResumeFrom = playersResp.data.findIndex(item => !item.SoldFor)
        
        if(playerIndexToResumeFrom >= 0) {
            dispatch(setReduxState({ /** Initially set 1st player */
                key: 'playerIndexFromJson',
                data: playerIndexToResumeFrom
            }))
            
            !currentPlayer && dispatch(setReduxState({ /** Initially set 1st player */
                key: 'currentPlayer',
                data: playersResp.data[playerIndexToResumeFrom]
                // data:players_array[playerIndexToResumeFrom]
            }))
        }
        
        
    }

    useEffect(() => {
        
        loadJsonIntoDb()
        
    }, [])
    
    return (<></>);
}

export default ApiCalls;