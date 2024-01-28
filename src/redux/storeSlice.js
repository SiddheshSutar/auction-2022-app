import { createSlice } from '@reduxjs/toolkit'
import players_array from '../externalLists/ListOfPlayers'
import teams from '../externalLists/ListOfTeams'
import cloneDeep from 'lodash/cloneDeep'
import { DEFAULT_BID_PRICE, checkIfBought, parseStringifyArray } from '../helpers'

const initialState = {
  currentPlayer: players_array[0],
  initialTeamList: cloneDeep(teams),
  initialPlayerList: cloneDeep(
    players_array.filter((item) => {
      return true
      // return !item.Captain && !item.GameChanger
    })
  ),

  currentBidPrice: DEFAULT_BID_PRICE,
  playerIndexFromJson: 0,
  shouldStartForPending: false,
  lastPlayerBought: null,
  soldPlayers: [],
  playersGenerated: [players_array[0]],
  pendingPlayers: [],
  disableNext: false,
  doneFetchingFromLocal: false,
  storedMatches: []
}

export const storeSlice = createSlice({
  name: 'storeSlice',
  initialState,
  reducers: {
    setCurrentBidPrice: (state, action) => {
      if (action.payload >= 0) state.currentBidPrice = action.payload
    },
    assignteamToPlayer: (state, action) => { // ({teamClicked, currentPlayer})
      // assign teamname in player obj in playerlist
      // add player to team's playerlist

      let currentPlayerList = cloneDeep(state.initialPlayerList)

      let playerBought = action.payload.currentPlayer

      currentPlayerList.map((playerObj, index_player) => {

        if (playerBought.Name === playerObj.Name) {

          // Push player to team
          state.initialTeamList.map(team => {

            if (action.payload.teamClicked === team.Name) {
              // console.log('Player bought:: ', playerObj)
              const balance = team.Amount_Assigned - team.Amount_Used
              if(balance - state.currentBidPrice < 0) {
                alert('Not enough balance left. Available balance: ',JSON.stringify(team.Amount_Assigned - state.currentBidPrice))
                return
              } 

              team.Players.push({
                ...playerObj,
                SoldFor: state.currentBidPrice
              })
              state.soldPlayers.push(playerObj)
              
              team.Amount_Used = team.Amount_Used + state.currentBidPrice

              state.initialPlayerList[index_player].SoldFor = state.currentBidPrice 

              // assign lastPlyer got removed
              state.lastPlayerBought = { ...playerObj }

              // reset displayed bid price
              state.currentBidPrice = DEFAULT_BID_PRICE
            }
          })
        }
      })
    },
    handleDirectPlayerAdd: (state, action) => {
      const {
        selectedTeamId, selectedPlayerId, soldFor
      } = action.payload
      
      if(!selectedTeamId || !selectedPlayerId) {
        return null
      }
      
      /** Find selected Team */
      state.initialTeamList.forEach(team => {

        if (parseInt(selectedTeamId) === team.id) {
          
          const balance = team.Amount_Assigned - team.Amount_Used
          if (balance - soldFor < 0) {
            alert('Not enough balance left. Available balance: ', JSON.stringify(team.Amount_Assigned - soldFor))
            return
          } 
      
          let currentPlayerList = cloneDeep(state.initialPlayerList)
              
          /** Find player with id */
          currentPlayerList.forEach((playerObj, index_player) => {

            if (parseInt(selectedPlayerId) === playerObj.id) {
              
              const soldForInt = parseInt(soldFor)
              
              team.Players.push({
                ...playerObj,
                SoldFor: soldForInt
              })
              state.soldPlayers.push(playerObj)
              
              team.Amount_Used = team.Amount_Used + soldForInt

              state.initialPlayerList[index_player].SoldFor = soldForInt
              
              // if(state.currentPlayer.Name === playerObj.Name) {
              //   state.playerIndexFromJson += 1
              // }
              
            }
          })
        }
      })
    },
    nextPlayerAction: (state, action) => {

      const addToPendingBlock = () => {
        // add to pending
        let arr = parseStringifyArray(state.pendingPlayers)
        // add to pending, only if not bought
        if(!state.lastPlayerBought && state.playerIndexFromJson === 0) {
          let newArr = [...arr]
          
          if(state.playersGenerated[0]) {
            newArr.push(parseStringifyArray(state.playersGenerated[0]))
          }
          state.pendingPlayers = newArr
        } else if(state.lastPlayerBought) {
          console.log('Check Player: ', parseStringifyArray(state.lastPlayerBought), parseStringifyArray(state.currentPlayer))

          if(
            (
              state.lastPlayerBought.Name !== state.currentPlayer.Name
            ) 
            // &&
            // ( // if currentPlayer has not been pushed in pending already
            //   state.pendingPlayers && parseStringifyArray(state.pendingPlayers)[parseStringifyArray(state.pendingPlayers).length-1].Name !==
            //   state.currentPlayer.Name
            // )
          ) {
            state.pendingPlayers =  [...arr, state.currentPlayer]
          }

        } else if(!state.lastPlayerBought) {
          state.pendingPlayers =  [...arr, state.currentPlayer]
        }

        console.log('Penddg Player: ', parseStringifyArray(state.pendingPlayers))

      }

      let { playerList } = action.payload
      const localPlayerArr = playerList

      // if counter exceeds this criteria, eit
      // helpful for last element
      // console.log('before', parseStringifyArray(state.currentPlayer))

      if (state.playerIndexFromJson + 1  === playerList.length) { // 19-12
        console.log('before', parseStringifyArray(state.currentPlayer), parseStringifyArray(state.pendingPlayers))
        
        // if already currentPlayer is pushe at last, dont push again
        if(state.currentPlayer &&
          state.pendingPlayers && parseStringifyArray(state.pendingPlayers).length !==0 &&
          (
            parseStringifyArray(state.currentPlayer).Name !== 
            parseStringifyArray(state.pendingPlayers)[state.pendingPlayers.length-1].Name
          )
        ) {
          addToPendingBlock()
        }
        return
      } else {

      }
      
      console.log('afetr')

      addToPendingBlock()


      // Check if not already present in generated ones
      let new_player_obj = localPlayerArr[state.playerIndexFromJson + 1]

      if(
        !new_player_obj.SoldFor ||
        parseStringifyArray(state.pendingPlayers).every(item => {
          return item.Name !== new_player_obj.Name
        })
      ) {
        console.log('NTTTTT BOUGHHH REFRESHHH')
      }

      const arrToIterate = parseStringifyArray(state.playersGenerated)
      if (arrToIterate.length === 0 || 
        arrToIterate.every(item => item.id !== new_player_obj.id)
      ) {


        state.playersGenerated = arrToIterate.concat(new_player_obj)
        // console.log('gen Player: ', arrToIterate.concat(new_player_obj))
        state.currentPlayer = new_player_obj
        state.playerIndexFromJson += 1


        //reset bid price being shown]
        state.currentBidPrice = DEFAULT_BID_PRICE

        
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
        // state.disableNext = true //to-do
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
    storeMatches: (state, action) => {
      
      state.storedMatches = action.payload
    },
    deletePlayer: (state, action) => {

      const { team, player } = action.payload
      
      const currentTeamList  = cloneDeep(state.initialTeamList)
      const currentPlayerList  = cloneDeep(state.initialPlayerList)
      let currentGeneratedPlayerList  = cloneDeep(state.playersGenerated)
      const currentSoldPlayers  = cloneDeep(state.soldPlayers)
      
      state.initialTeamList = currentTeamList.map((teamObj) => {
        
        if(team.id === parseInt(teamObj.id)) {

          teamObj = {
            ...teamObj,
            Amount_Used: teamObj.Amount_Used - (player.soldFor ?? DEFAULT_BID_PRICE),
            Players: teamObj.Players.filter(item => item.id !== parseInt(player.id))
          }
          
          return teamObj
        }
        
        return teamObj
      })
      state.soldPlayers = currentSoldPlayers.filter((playerObj) => playerObj.id !== parseInt(player.id))
      
      // state.initialPlayerList = [
      //   player, ...currentPlayerList
      // ]
      
      currentGeneratedPlayerList = currentGeneratedPlayerList.filter(item => item.id !== parseInt(player.id))
      if(currentGeneratedPlayerList.length > 0) {
        currentGeneratedPlayerList = currentGeneratedPlayerList.slice(0, currentGeneratedPlayerList.length - 1)
      }
      state.playersGenerated = currentGeneratedPlayerList
      state.currentPlayer = player
      state.playerIndexFromJson -= 1
    },
    handlePendingList: (state, action) => {
      console.log('pen Player: ', parseStringifyArray(state.pendingPlayers))

      //assigning pendig to initial to-do : have some diff list
      state.initialPlayerList = parseStringifyArray(state.pendingPlayers)
      state.currentPlayer = parseStringifyArray(state.pendingPlayers)[0]
      state.playersGenerated = []
      state.playerIndexFromJson = 0
      state.pendingPlayers = []
      state.shouldStartForPending = false
      state.disableNext = false
    },
    setLocalStorage: (state, action) => {
      try{

        localStorage.setItem('auctionstate', JSON.stringify(parseStringifyArray(state)))
      } catch(e) {
        console.log('Error in setLocalStorage: ',e)
        alert('Error in setLocalStorage: ',e)
      }
    },
    getLocalStorage: (state, action) => {
      try{
        const newState = JSON.parse(localStorage.getItem('auctionstate', parseStringifyArray(state)))
        // state = JSON.parse(newState)

        // assign individually fo refrsh
        state.currentPlayer = newState.currentPlayer
        state.initialTeamList = newState.initialTeamList
        state.initialPlayerList = newState.initialPlayerList
        state.currentBidPrice = newState.currentBidPrice

        state.playerIndexFromJson = 
        // newState.playerIndexFromJson > 0 ?
        //  newState.playerIndexFromJson-1 : newState.playerIndexFromJson// one player less, since > let new_player_obj = localPlayerArr[state.playerIndexFromJson + 1]
        newState.playerIndexFromJson 
        state.shouldStartForPending = newState.shouldStartForPending
        state.lastPlayerBought = newState.lastPlayerBought
        state.playersGenerated = newState.playersGenerated
        state.pendingPlayers = newState.pendingPlayers

        state.disableNext = newState.disableNext

        console.log('NEW STATE:', newState)

        state.doneFetchingFromLocal = true
      } catch(e) {
        console.log('Error in getLocalStorage: ',e)
        alert('Error in getLocalStorage: ',e)
      }
    }, 
    setfetcherFlag: (state, action) => {
      state.doneFetchingFromLocal = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount,
  setCurrentPlayerInRedux, assignteamToPlayer, setCurrentBidPrice,
  nextPlayerAction, handlePendingList, addToPending,
  getLocalStorage , setLocalStorage, setfetcherFlag,
  handleDirectPlayerAdd, deletePlayer, storeMatches
} = storeSlice.actions

export default storeSlice.reducer