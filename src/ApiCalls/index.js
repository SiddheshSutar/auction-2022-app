import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPlayers, getTeams, setPlayer, setTeam } from "../services";
import teams from "../externalLists/ListOfTeams";
import players_array from "../externalLists/ListOfPlayersLatest";
import { removeIdKeyFromArry } from "../helpers";
import { cloneDeep } from "lodash";
import { setReduxState } from "../redux/storeSlice";

const ApiCalls = () => {
    const { initialPlayerList, initialTeamList } = useSelector(state => state.store)
    
    const dispatch = useDispatch()
    
    const loadJsonIntoDb = async () => {
         /** To insert players when app loads */
        await setPlayer({
            data: removeIdKeyFromArry(cloneDeep(
                players_array.filter((item) => {
                  return true
                  // return !item.Captain && !item.GameChanger
                })
              ))
        })
        
        /** To insert teams when app loads */
        await setTeam({
            data: removeIdKeyFromArry(cloneDeep(teams))
        })
        
        
        const teamsResp = await getTeams()
        const playersResp = await getPlayers()

        if(!teamsResp.success || !playersResp.success) { /** Alert used in case API fails to access BE  */
            alert('Sync failed ! Using local state..')
        }
        
        dispatch(setReduxState({
            key: 'initialTeamList',
            data: teamsResp.data
        }))
        dispatch(setReduxState({
            key: 'initialPlayerList',
            data: playersResp.data
        }))
        
    }

    useEffect(() => {
        
        loadJsonIntoDb()
        
    }, [])
    
    return (<></>);
}

export default ApiCalls;