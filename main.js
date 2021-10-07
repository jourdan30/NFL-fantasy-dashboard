//// //// //// //// ////    ----    WINS POOL    ----   //// //// //// //// //// 

// Players and team choices //

let players =   ["AJ", "Jourdan", "Wei", "Godwin", "Edward", 
                "AB", "Chathu", "Dak", "Jaffe", "Vic"]

let playerChoices =     {AJ: ["CLE", "WSH", "ATL"],
                        Jourdan: ["GB", "DAL", "CAR"],
                        Wei: ["KC", "JAX", "NYG"],
                        Godwin: ["SF", "IND", "NYJ"],
                        Edward: ["BAL", "CHI", "ARI"],
                        AB: ["NE", "LAC", "MIN"],
                        Chathu: ["BUF", "MIA", "LV"],
                        Dak: ["TEN", "SEA", "PHI"],
                        Jaffe: ["TB", "NO", "CIN"],
                        Vic: ["LAR", "PIT", "DEN"]
                    }

let playerRecords = [];

// Fetch team records and create table after data is fetched //

let winsUrl = "https://site.web.api.espn.com/apis/site/v2/sports/football/nfl/teams?region=us&lang=en&contentorigin=espn&limit=99";
let winsObj;
let winsData;

fetch(winsUrl)
    .then(response => response.json())      // convert to json
    .then(data => winsObj = data)               // assign fetched data to variable "obj"
    .then(winsObj => {                          // assign teams data to variable "winsData"
        winsData = winsObj.sports[0].leagues[0].teams;
        createWinsTable();
    })                      
    .catch(err => console.log('Request Failed', err)); // Catch errors

// Function to calculate wins //

let teamPoints = function (team) {
    for (let i=0; i <winsData.length; i++) {
        if (winsData[i]["team"]["abbreviation"]==team) {
            return winsData[i]["team"]["record"]["items"][0]["stats"][1]["value"] +   // One point for win
            winsData[i]["team"]["record"]["items"][0]["stats"][5]["value"]/2;         // Half point for draw
        }; 
    }
}

let playerPoints = function (player) {        // Function to calculate points per player
    let x = 0;
    for (let i=0; i < 3; i++) {
            x += teamPoints(playerChoices[player][i]);
        }
    return x;
    }

let teamScoreDifferential = function (team) {
    for (let i=0; i < winsData.length; i++) {
        if (winsData[i]["team"]["abbreviation"]==team) {
            return winsData[i]["team"]["record"]["items"][0]["stats"][14]["value"] // Team point differential
        }; 
    }
}

let playerScoreDifferential = function (player) {        // Function to calculate score differential per player
    let x = 0;
    for (let i=0; i < 3; i++) {
            x += teamScoreDifferential(playerChoices[player][i]);
        }
    return x;
    }

function createPlayerRecords() {
    for (i=0; i < players.length; i++) {
        playerRecords[i] = {"Name":players[i],
                            "Teams":playerChoices[players[i]].join(", "),
                            "Points":playerPoints(players[i]),
                            "Differential":playerScoreDifferential(players[i])};
    }
    let sortPlayerRecords = playerRecords.sort(function(a,b) {
        return b.Points - a.Points || b.Differential - a.Differential;
    })
}

function createWinsTable () {
    createPlayerRecords();
    
    let table = document.querySelector("#wins-table");
    
    let header = table.insertRow(-1);
    let winTableHeadings = ["Rank", "Name", "Teams", "Wins", "Differential"];
    
    for (i=0; i < winTableHeadings.length; i++) {
        let headerCell = document.createElement("TH");
        headerCell.innerHTML = winTableHeadings[i];
        header.appendChild(headerCell);
    }
    
    for (i=0; i < playerRecords.length; i++) {
        tr = table.insertRow();
        tr.setAttribute('id', `wins-table-row-${i+1}`)
        td = tr.insertCell();
        td.innerHTML = i + 1;  
        td = tr.insertCell();
        td.innerHTML = playerRecords[i]["Name"];  
        td = tr.insertCell();  
        td.innerHTML = playerRecords[i]["Teams"]; 
        td = tr.insertCell();  
        td.innerHTML = playerRecords[i]["Points"]; 
        td = tr.insertCell();  
        td.innerHTML = playerRecords[i]["Differential"]; 
    }
}

//// //// //// //// ////    ----    REC & RUSH YARDS LEADERS BY TEAM    ----   //// //// //// //// //// 

let leadersUrl = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
let leadersObj;
let leadersData;
let receivingLeaders = [];
let rushingLeaders = [];

async function getLeadersData() {
    let response = await fetch(leadersUrl);
    let leadersObj = await response.json();
    let leadersData = leadersObj["events"];
    function createReceivingLeaders () {
        for (i=0; i < leadersData.length; i++) {
        receivingLeaders[i*2] =     {"Name": leadersData[i]["competitions"][0]["competitors"][0]["leaders"][2]["leaders"][0]["athlete"]["fullName"],
                                    "Team": leadersData[i]["competitions"][0]["competitors"][0]["team"]["abbreviation"],
                                    "Rec Yards":leadersData[i]["competitions"][0]["competitors"][0]["leaders"][2]["leaders"][0]["value"]};
        receivingLeaders[i*2+1] =   {"Name": leadersData[i]["competitions"][0]["competitors"][1]["leaders"][2]["leaders"][0]["athlete"]["fullName"],
                                    "Team": leadersData[i]["competitions"][0]["competitors"][1]["team"]["abbreviation"],
                                    "Rec Yards":leadersData[i]["competitions"][0]["competitors"][1]["leaders"][2]["leaders"][0]["value"]};
        }
        let sortReceivingLeaders = receivingLeaders.sort(function(a,b) {
        return b["Rec Yards"] - a["Rec Yards"];
    }
    )}

    function createRushingLeaders () {
        for (i=0; i < leadersData.length; i++) {
        rushingLeaders[i*2] =   {"Name": leadersData[i]["competitions"][0]["competitors"][0]["leaders"][1]["leaders"][0]["athlete"]["fullName"],
                                "Team": leadersData[i]["competitions"][0]["competitors"][0]["team"]["abbreviation"],
                                "Rush Yards":leadersData[i]["competitions"][0]["competitors"][0]["leaders"][1]["leaders"][0]["value"]};
        rushingLeaders[i*2+1] = {"Name": leadersData[i]["competitions"][0]["competitors"][1]["leaders"][1]["leaders"][0]["athlete"]["fullName"],
                                "Team": leadersData[i]["competitions"][0]["competitors"][1]["team"]["abbreviation"],
                                "Rush Yards":leadersData[i]["competitions"][0]["competitors"][1]["leaders"][1]["leaders"][0]["value"]};
        }
        let sortRushingLeaders = rushingLeaders.sort(function(a,b) {
        return b["Rush Yards"] - a["Rush Yards"];
    }
    )}

    createReceivingLeaders();
    createReceivingTable();
    createRushingLeaders();
    createRushingTable();
}

function createReceivingTable () {
    
    let table = document.querySelector("#rec-yards-table");
    let header = table.insertRow(-1);
    let recYardsTableHeadings = ["Rank", "Name", "Team", "Rec Yards"];
    
    for (i=0; i < recYardsTableHeadings.length; i++) {
        let headerCell = document.createElement("TH");
        headerCell.innerHTML = recYardsTableHeadings[i];
        header.appendChild(headerCell);
    }
    
    for (i=0; i < receivingLeaders.length; i++) {
        tr = table.insertRow();
        td = tr.insertCell();
        td.innerHTML = i + 1;  
        td = tr.insertCell();
        td.innerHTML = receivingLeaders[i]["Name"];  
        td = tr.insertCell();  
        td.innerHTML = receivingLeaders[i]["Team"];  
        td = tr.insertCell();  
        td.innerHTML = receivingLeaders[i]["Rec Yards"];  

    }
}

function createRushingTable () {
    
    let table = document.querySelector("#rush-yards-table");
    let header = table.insertRow(-1);
    let recYardsTableHeadings = ["Rank", "Name", "Team", "Rush Yards"];
    
    for (i=0; i < recYardsTableHeadings.length; i++) {
        let headerCell = document.createElement("TH");
        headerCell.innerHTML = recYardsTableHeadings[i];
        header.appendChild(headerCell);
    }
    
    for (i=0; i < rushingLeaders.length; i++) {
        tr = table.insertRow();
        td = tr.insertCell();
        td.innerHTML = i + 1;  
        td = tr.insertCell();
        td.innerHTML = rushingLeaders[i]["Name"];  
        td = tr.insertCell();  
        td.innerHTML = rushingLeaders[i]["Team"];  
        td = tr.insertCell();  
        td.innerHTML = rushingLeaders[i]["Rush Yards"];  

    }
}

getLeadersData ();

