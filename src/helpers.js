import teams from "./externalLists/ListOfTeams";

export const checkIfBought = (playerObj, teamList) => {

    //check if some team has bought this player
    let flag = false
    teamList.forEach(element => {
        // console.log('team item:', element, playerObj)

        if(element.Players.some(player => player._id === playerObj._id)) {
            flag = true
        }
    });

    // return flag
    if(flag) console.log('Bought: ', playerObj)
    return false

}

export const parseStringifyArray = input => JSON.parse(JSON.stringify(input))

// function swap(array) {
//     let start = 0, end = array.length - 1
//     let count = 0
//     while(start < end ) {
//         if((count%2 === 0)) {
//             console.log('hex: ', start, end, count)
//             let temp = array[start];
//             array[start] = array[end]
//             array[end] = temp
//         }
//         start++
//         end--
//         count++
//     }
// }
function shuffle(array) {
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

function sect(array) {
    let copy = [...array]
    
    let start = 0
    let end = copy.length - 1
    let count = 0
    let index = 0
    
    while(start <= end) {
        if(++count % 2 === 0) {
            copy[index++] = array[start]
            start++
        } else {
            copy[index++] = array[end]
            end--
        }
    }
    return copy
    
}
  
let staticMatches = [
    [
        "7 Wonders",
        "Sai Prasad"
    ],
    [
        "DSP Sky",
        "Power Hitters"
    ],
    [
        "Mumbai Mafia",
        "Pawar ka Power"
    ],
    [
        "Old Fox",
        "Red Wings"
    ],
    [
        "Power Hitters",
        "Sai Prasad"
    ],
    [
        "DSP Sky",
        "7 Wonders"
    ],
    [
        "Old Fox",
        "Power Hitters"
    ],
    
    // day 2
    [
        "Pawar ka Power",
        "Sai Prasad"
    ],
    [
        "Mumbai Mafia",
        "Old Fox"
    ],
    [
        "DSP Sky",
        "Red Wings"
    ],
    [
        "Pawar ka Power",
        "7 Wonders"
    ],
    [
        "Power Hitters",
        "Red Wings"
    ],
    [
        "Mumbai Mafia",
        "7 Wonders"
    ],
    [
        "Old Fox",
        "DSP Sky"
    ],
    // day 3
    [
        "DSP Sky",
        "Sai Prasad"
    ],
    [
        "Old Fox",
        "7 Wonders"
    ],
    [
        "Sai Prasad",
        "Red Wings"
    ],
    [
        "Pawar ka Power",
        "DSP Sky"
    ],
    [
        "7 Wonders",
        "Red Wings"
    ],
    [
        "Old Fox",
        "Sai Prasad"
    ],
    [
        "Power Hitters",
        "7 Wonders"
    ],
    [
        "Mumbai Mafia",
        "DSP Sky"
    ],
    [
        "Pawar ka Power",
        "Old Fox"
    ],
    [
        "Mumbai Mafia",
        "Power Hitters"
    ],
    [
        "Pawar ka Power",
        "Red Wings"
    ],
    [
        "Mumbai Mafia",
        "Sai Prasad"
    ],
    [
        "Pawar ka Power",
        "Power Hitters"
    ],
    [
        "Mumbai Mafia",
        "Red Wings"
    ],
];

export const generateMatches = (matchesPassed) => {
    
    // if(matchesPassed) {
        
    //     let newMatchesPassed = [matchesPassed.pop(), ...matchesPassed]
    //     newMatchesPassed = sect(newMatchesPassed)
    //     newMatchesPassed = shuffle(newMatchesPassed)
    // console.log('hex: ', newMatchesPassed)
        
    //     return newMatchesPassed
    // } 
    
    const storedTeams = teams.map(item => item.TeamName)
    
    const a = [...storedTeams]
    let b = []
    
    for (let i = 0; i < a.length; i++) {
        let subArr = a.slice(i, a.length)
        subArr.forEach((item, inx) => {
            if (a[i] === item) return
            b.push([a[i], item])
        })

    }
    
    b = sect(b)
    b = shuffle(b)
        
    const foundTeam = (name) => {
        
        return teams.find(item => item.TeamName === name)
    }
    console.log('hex: ', b)
    /** css specific */
    // b = b.map((item, index) => {
    b = staticMatches.map((item, index) => {
        return `<span class="match-name">
           <span class="team-name" style="color: ${(foundTeam(item[0])).Color};">${item[0]}</span> vs <span class="team-name" style="color: ${(foundTeam(item[1])).Color};">${item[1]}</span>
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

export const removeIdKeyFromArry = arr => {
    return arr.map(item => {
        
        let newObj = {...item}
        
        if('id' in newObj) delete newObj.id
        
        return newObj
    })
}

export const MAX_AMOUNT = 1000
export const DEFAULT_BID_PRICE = 30
export const BASE_URL = 'http://localhost:8000/'