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
  playerIndexFromJson: 0,
  shouldStartForPending: false,
  lastPlayerRemoved: null,
  playersGenerated: []
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
      if (action.payload >= 0) state.currentBidPrice = action.payload
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

        if (playerBought.Name === playerObj.Name) {

          // Push player to team
          state.initialTeamList.map(team => {

            if (action.payload.teamClicked === team.Name) {
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
          state.lastPlayerRemoved = { ...playerObj }

          // reset displayed bid price
          state.currentBidPrice = 0
        }
      })
    },
    nextPlayerAction: (state, action) => {

      let { playerList } = action.payload
      const localPlayerArr = playerList

      // Check if next click has happened till length of layer json
      if (state.playerIndexFromJson + 1 === playerList.length) {
        // setshouldStartPending(true)
        state.shouldStartForPending = true
        return
      }

      // Check if not already present in generated ones
      let new_player_obj = localPlayerArr[state.playerIndexFromJson + 1]
      if (state.playersGenerated.every(item => item.id !== new_player_obj.id)) {

        state.playersGenerated = [ //to-do
          ...initialState.playersGenerated,
          new_player_obj,
        ]
        console.log('gen Player: ', initialState.playersGenerated)
        state.currentPlayer = new_player_obj
        state.playerIndexFromJson += 1

        //reset bid price being shown]
        // dispatch(setCurrentBidPrice(0))
        state.currentBidPrice = 0
      } else {
        // console.log('already done: ', new_player_obj)

      }

    },
    handlePendingListStartClick: (state, action) => {

    }
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount,
  setCurrentPlayerInRedux, assignteamToPlayer, setCurrentBidPrice,
  nextPlayerAction
} = storeSlice.actions

export default storeSlice.reducer