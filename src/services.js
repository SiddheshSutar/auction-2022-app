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
).then(response => response.data)

export const getTeams = () => axios.get(
    `${BASE_URL}get-team-list`
).then(response => response.data)

export const updatePlayerList = (payload) => axios.post(
    `${BASE_URL}update-player-list`,
    payload
).then(response => response)

export const updateTeamList = (payload) => axios.post(
    `${BASE_URL}update-team-list`,
    payload
).then(response => response)