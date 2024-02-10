import axios from "axios";
import { BASE_URL } from "./helpers";

export const setPlayer = (payload) => axios.post(
    `${BASE_URL}add-player`,
    payload
).then(response => response)

export const setTeam = (payload) => axios.post(
    `${BASE_URL}add-team`,
    payload
).then(response => response)

export const getPlayers = () => axios.get(
    `${BASE_URL}get-player-list`
)

export const getTeams = () => axios.get(
    `${BASE_URL}get-team-list`
)