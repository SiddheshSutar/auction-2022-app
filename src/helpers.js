import teams from "./externalLists/ListOfTeams";

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

function shuffle(array) {
    let start = 0, end = array.length - 1
    let count = 0
    while(start < end ) {
        if((count%2 === 0)) {
            console.log('hex: ', start, end, count)
            let temp = array[start];
            array[start] = array[end]
            array[end] = temp
        }
        start++
        end--
        count++
    }
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    
    

    return array;
}
  
export const generateMatches = () => {
    
    const storedTeams = teams.map(item => item.Name)
    
    const a = [...storedTeams]
    let b = []
    

    for (let i = 0; i < a.length; i++) {
        let subArr = a.slice(i, a.length)

        subArr.forEach(item => {
            if (a[i] === item) return

            b.push([a[i], item])
        })


    }
    
    /** Shuffled */
    b = shuffle(b)
        
    const foundTeam = (name) => {
        
        return teams.find(item => item.Name === name)
    }
    
    /** css specific */
    b = b.map((item, index) => {
        return `<span class="match-name">
           <span>${index+1}.</span><span class="team-name" style="color: ${(foundTeam(item[0])).Color};">${item[0]}</span> vs <span class="team-name" style="color: ${(foundTeam(item[1])).Color};">${item[1]}</span>
        </span>`
    })
    return b
}

export const checkFemaleOrSenior = ({
    currentTeam, teams, currentPlayer
}) => {
    return (
        currentPlayer.Gender === 'S' && currentTeam.Players.length > 0 && currentTeam.Players.some((player) => player.Gender === 'S')
    ) || (
        currentPlayer.Gender === 'F' && currentTeam.Players.length > 0 && currentTeam.Players.some((player) => player.Gender === 'F')
    )
}

export const isSelfSenior = ({
    currentTeam, teams, currentPlayer
}) => {
    /** TO-DO */
    /** WHen to disable:
     * when cur player is owner & teamBtn.Name == plyBtn.Name
     */
    
    return (
        currentPlayer.Gender === 'S' && currentTeam.Name === currentPlayer.Name && currentPlayer.Owner 
    ) 
}

export const MAX_AMOUNT = 1000
export const DEFAULT_BID_PRICE = 30