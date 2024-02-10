import { useEffect } from "react";
import { useSelector } from "react-redux";
import { setPlayer, setTeam } from "../services";
import teams from "../externalLists/ListOfTeams";
import players2 from "../externalLists/ListOfPlayersLatest";
import { removeIdKeyFromArry } from "../helpers";

const ApiCalls = () => {
    const { initialPlayerList, initialTeamList } = useSelector(state => state.store)

    useEffect(() => {
        /** To insert players when app loads */
        setPlayer({
            data: removeIdKeyFromArry(initialPlayerList)
        })
        
        /** To insert teams when app loads */
        setTeam({
            data: removeIdKeyFromArry(initialTeamList)
        })
        
        
    }, [])
    
    useEffect(() => {
        
        // initialPlayerList.forEach(item => {
            
        //     const payload = {...item}
        //     if('id' in payload) delete payload.id
        //     if(!payload.Photo) payload.Photo = 'Temp'
        //     setPlayer(payload)
        // })
    }, [])
    
    return (<></>);
}

export default ApiCalls;