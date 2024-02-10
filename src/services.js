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