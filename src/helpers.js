export const checkIfBought = (playerObj, teamList) => {

    //check if some team has bought this player
    let flag = false
    teamList.forEach(element => {
        // console.log('team item:', element, playerObj)

        if(element.Players.some(player => player.id === playerObj.id)) {
            flag = true
        }
    });

    // return flag
    if(flag) console.log('Bought: ', playerObj)
    return false

}

export const parseStringifyArray = input => JSON.parse(JSON.stringify(input))

export const MAX_AMOUNT = 100
export const DEFAULT_BID_PRICE = 20