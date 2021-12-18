import { createSlice } from '@reduxjs/toolkit'
import players_array from '../externalLists/ListOfPlayers'
import teams from '../externalLists/ListOfTeams'
import cloneDeep from 'lodash/cloneDeep'
import { checkIfBought, parseStringifyArray } from '../helpers'

const initialState = {
  value: 0,
  currentPlayer: players_array[0],
  initialTeamList: cloneDeep(teams),
  initialPlayerList: cloneDeep(players_array),

  currentBidPrice: 0,
  playerIndexFromJson: 0,
  shouldStartForPending: false,
  lastPlayerBought: null,
  playersGenerated: [players_array[0]],
  pendingPlayers: [],
  disableNext: false
}

export const storeSlice = createSlice({
  name: 'storeSlice',
  initialState,
  reducers: {
    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1
    // },
    // decrement: (state) => {

    //   state.value -= 1

    // },
    setCurrentBidPrice: (state, action) => {
      if (action.payload >= 0) state.currentBidPrice = action.payload
    },
    // setCurrentPlayerInRedux: (state, action) => {
    //   state.currentPlayer = action.payload
    // },
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
          state.lastPlayerBought = { ...playerObj }

          // reset displayed bid price
          state.currentBidPrice = 0
        }
      })
    },
    nextPlayerAction: (state, action) => {

      const addToPendingBlock = () => {
        // add to pending
        let arr = parseStringifyArray(state.pendingPlayers)
        // add to pending, only if not bought
        if(!state.lastPlayerBought && state.playerIndexFromJson === 0) {
          state.pendingPlayers = [...arr, parseStringifyArray(state.playersGenerated[0])]
        } else if(state.lastPlayerBought) {
          if(state.lastPlayerBought.Name !== state.currentPlayer.Name) {
            // state.pendingPlayers = arr.concat(parseStringifyArray(state.currentPlayer))
            // state.pendingPlayers =  [...arr, ...parseStringifyArray(state.currentPlayer)]
            state.pendingPlayers =  [...arr, state.currentPlayer]
          }

        } else if(!state.lastPlayerBought) {
          // state.pendingPlayers = arr.concat(parseStringifyArray(state.currentPlayer))
          // state.pendingPlayers =  [...arr, ...parseStringifyArray(state.currentPlayer)]
          state.pendingPlayers =  [...arr, state.currentPlayer]
        }

        console.log('Penddg Player: ', parseStringifyArray(state.pendingPlayers))

      }

      let { playerList } = action.payload
      const localPlayerArr = playerList

      // if counter exceeds this criteria, eit
      // helpful for last element
      // console.log('before', parseStringifyArray(state.currentPlayer))

      if (state.playerIndexFromJson + 1  === playerList.length) {
        console.log('before', parseStringifyArray(state.currentPlayer), parseStringifyArray(state.pendingPlayers))
        
        // if already currentPlayer is pushe at last, dont push again
        if(parseStringifyArray(state.currentPlayer).Name !== parseStringifyArray(state.pendingPlayers)[state.pendingPlayers.length-1].Name) {
          addToPendingBlock()
        }
        return
      } else {

      }
      
      console.log('afetr')

      addToPendingBlock()


      // Check if not already present in generated ones
      let new_player_obj = localPlayerArr[state.playerIndexFromJson + 1]

      const arrToIterate = parseStringifyArray(state.playersGenerated)
      if (arrToIterate.length === 0 || 
        arrToIterate.every(item => item.id !== new_player_obj.id)
      ) {


        state.playersGenerated = arrToIterate.concat(new_player_obj)
        // console.log('gen Player: ', arrToIterate.concat(new_player_obj))
        state.currentPlayer = new_player_obj
        state.playerIndexFromJson += 1

        //reset bid price being shown]
        state.currentBidPrice = 0

        
        // console.log('pen Player: ', arr.concat(parseStringifyArray(state.currentPlayer)))
        // console.log('pen Player genrrr: ', parseStringifyArray(state.playersGenerated))

      } else {
        // console.log('already done: ', new_player_obj)
      }

      //after player is generated
      // Check if next click has happened till length of generated players
      // console.log('TY: ', parseStringifyArray(state.playersGenerated), state.playerIndexFromJson)
      if (state.playersGenerated.length === playerList.length) {
        state.shouldStartForPending = true
      }
      if (state.playerIndexFromJson  === playerList.length-1) {
        // state.disableNext = true
        return
      }

    },
    addToPending: (state, action) => {

      // add to pending
      let arr = parseStringifyArray(state.pendingPlayers)
      // add to pending, only if not bought
      if(state.lastPlayerBought.Name !== action.payload.Name) {

        state.pendingPlayers = arr.concat(parseStringifyArray(action.payload))
      }
    },
    handlePendingList: (state, action) => {
      console.log('pen Player: ', parseStringifyArray(state.pendingPlayers))

    }
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount,
  setCurrentPlayerInRedux, assignteamToPlayer, setCurrentBidPrice,
  nextPlayerAction, handlePendingList, addToPending
} = storeSlice.actions

export default storeSlice.reducer