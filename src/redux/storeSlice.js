import { createSlice } from '@reduxjs/toolkit'
import players_array from '../externalLists/ListOfPlayers'
import teams from '../externalLists/ListOfTeams'
import cloneDeep from 'lodash/cloneDeep'

const initialState = {
  value: 0,
  currentPlayer: players_array[0],
  initialTeamList: teams,
  initialPlayerList: players_array
}

export const storeSlice = createSlice({
  name: 'storeSlice',
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
    setCurrentPlayerInRedux: (state, action) => {
        state.currentPlayer = action.payload
    },
    assignteamToPlayer: (state, action) => { // ({teamClicked, currentPlayer})
        // assign teamname in player obj in playerlist
        // let currentPlayerList = [...state.initialPlayerList]
        let currentPlayerList = cloneDeep(state.initialPlayerList)

        let playerBought = action.payload.currentPlayer
        
        currentPlayerList.map(playerObj => {

            if(playerBought.Name === playerObj.Name) {
                // playerObj.TeamName = action.payload.teamClicked //To-DO
                console.log('Player bought:: ', playerObj)
            }
        })
    }
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount,
        setCurrentPlayerInRedux, assignteamToPlayer
 } = storeSlice.actions

export default storeSlice.reducer