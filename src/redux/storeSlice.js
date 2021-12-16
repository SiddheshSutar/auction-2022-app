import { createSlice } from '@reduxjs/toolkit'
import players_array from '../externalLists/ListOfPlayers'
import teams from '../externalLists/ListOfTeams'
import cloneDeep from 'lodash/cloneDeep'

const initialState = {
  value: 0,
  currentPlayer: players_array[0],
  initialTeamList: cloneDeep(teams),
  initialPlayerList: cloneDeep(players_array),

  currentBidPrice: 0,
  lastPlayerRemoved: null
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
    setCurrentBidPrice: (state, action) => {
      state.currentBidPrice = action.payload
    },
    setCurrentPlayerInRedux: (state, action) => {
        state.currentPlayer = action.payload
    },
    assignteamToPlayer: (state, action) => { // ({teamClicked, currentPlayer})
        // assign teamname in player obj in playerlist
        // add player to team's playerlist

        // let currentPlayerList = [...state.initialPlayerList]
        let currentPlayerList = cloneDeep(state.initialPlayerList)

        let playerBought = action.payload.currentPlayer
        
        currentPlayerList.map(playerObj => {

            if(playerBought.Name === playerObj.Name) {
                
                // Push player to team
                state.initialTeamList.map(team => {
                  
                  if(action.payload.teamClicked === team.Name){
                    // console.log('Player bought:: ', playerObj)

                    team.Players.push({
                      ...playerObj,
                      SoldFor: state.currentBidPrice
                    })
                    team.Amount_Used = team.Amount_Used + state.currentBidPrice
                  }
                })

                // /remove this player from auction list
                let newPlayerList = initialState.initialPlayerList.filter(playeritem => { //Doubtful access
                  return playerObj.Name !== playeritem.Name
                })

                state.initialPlayerList = newPlayerList
                // console.log('Playerremoved: ', playerObj, newPlayerList)

                // assign lastPlyer got removed
                state.lastPlayerRemoved = {...playerObj}
            }
        })
    },

  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount,
        setCurrentPlayerInRedux, assignteamToPlayer, setCurrentBidPrice
 } = storeSlice.actions

export default storeSlice.reducer