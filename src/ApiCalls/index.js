import { useEffect } from "react";
import { useSelector } from "react-redux";
import { setPlayer } from "../services";

const ApiCalls = () => {
    const { initialPlayerList } = useSelector(state => state.store)
    
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