// Team Buttons/ Elements
const grabTeam = document.getElementById('searchFormTeam').addEventListener('click', searchTeam);
const randomTeam = document.getElementById('random-team').addEventListener('click', newTeam);
const teamDiv = document.querySelector('#teamInnerText')
const addTeamButton = document.getElementById('addTeamButton').addEventListener('click', addNewTeam)
const updateTeamButton = document.getElementById('updateTeamButton').addEventListener('click', updateTeamHandler)
const deleteTeamButton = document.getElementById('deleteTeamButton').addEventListener('click', deleteTeamHandler)
const clearTeamButton = document.getElementById("clearTeamButton").addEventListener("click", (event) => {
  
  document.getElementById("randTeamResults").innerText = "";
  document.getElementById("teamInnerText").innerText = "";
  
  const inputElements = document.getElementsByTagName("input");
  for (let i = 0; i < inputElements.length; i++) {
    inputElements[i].value = "";
  }
  
  });


//Player Buttons/ Elements
const grabPlayer = document.getElementById('searchFormPlayer').addEventListener('click', searchPlayer);
const randomPlayer = document.getElementById('random-player').addEventListener('click', newPlayer);
const playerDiv = document.querySelector('#playerInnerText');
const randPlayForm = document.getElementById('randPlayForm');
const resultsPlayerDiv = document.getElementById('randPlayResults');
const addPlayerButton = document.getElementById("addPlayerButton").addEventListener("click", addNewPlayer);
const updatePlayerButton = document.getElementById('updatePlayerButton');
const updatedPlayerCollegeInput = document.getElementById('updatedPlayerCollege');
const deletePlayerButton = document.getElementById("deletePlayForm").addEventListener("click", deletePlayer);
const playerIdInput = document.getElementById('playerId');
const clearPlayerButton = document.getElementById("clearPlayerButton").addEventListener("click", () => {
 
  document.getElementById("randPlayResults").innerText = "";
  document.getElementById("playerInnerText").innerText = "";

  // Clear input values
  const inputElements = document.getElementsByTagName("input");
  for (let i = 0; i < inputElements.length; i++) {
    inputElements[i].value = "";
  }
});
//Record Button
const records = document.getElementById('records').addEventListener('click', checkStandings);
const clearStandingsButton = document.getElementById('clearStandings').addEventListener('click', clearStandings);

// Search Bar
const teamSearchBar = document.getElementById("submitTeam").addEventListener("click", function (event) {
  event.preventDefault(); // Prevents the form from submitting and refreshing the page
 teamDiv.innerText = getTeams()
  
});

const playerSearchBar = document.getElementById("submitPlayer").addEventListener("click", function(event) {
  event.preventDefault(); // Prevents the form from submitting and refreshing the page
  playerDiv.innnerText = getPlayers() 
});

randPlayForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission
});

updatePlayerButton.addEventListener('click', () => {
  const playerId = playerIdInput.value;
  const updatedPlayer = {
    college: updatedPlayerCollegeInput.value,
  };
  const [firstName, lastName] = playerId.split(' '); // Split the playerId into first and last name

  updatePlayer(firstName, lastName, updatedPlayer);
});

// Data Grab
async function getTeams() {
  try {
    const response = await fetch('https://nba-breakdown.herokuapp.com/api/team');
    if (!response.ok) {
      throw new Error('Failed to fetch teams');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getPlayers() {
  try {
    const response = await fetch('https://nba-breakdown.herokuapp.com/api/players');
    if (!response.ok) {
      throw new Error('Failed to fetch players');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getRecords() {
  try {
    const response = await fetch('https://nba-breakdown.herokuapp.com/api/standing');
    if (!response.ok) {
      throw new Error('Failed to fetch records');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//Functions

function searchTeam() {
  let findTeam = document.getElementById("findTeam").value;

  getTeams()
    .then(data => {
      const foundTeams = data.filter(team => {
        const teamName = team.name.toLowerCase();
        const teamCity = team.city.toLowerCase();
        const teamCode = team.code.toLowerCase();
        return teamName.includes(findTeam.toLowerCase()) || teamCity.includes(findTeam.toLowerCase()) || teamCode.includes(findTeam.toLowerCase());
      });
      console.log(foundTeams);
      displayTeams(foundTeams); // Pass the found teams to the displayTeams function

      // Update teamDiv with the found teams
      if (foundTeams.length > 0) {
        teamDiv.innerText = ""; // Clear the previous content
        foundTeams.forEach(team => {
          teamDiv.innerText = `${team.name} / ${team.city} / ${team.code}`;
        });
      } else {
        teamDiv.innerText = "No teams found.";
      }
    })
    .catch(error => {
      console.error(error);
    });
}

function displayTeams(team) {
  const teamResults= document.getElementById("randTeamResults");
  teamResults.innerHTML = ""; // Clear previous results

    const teamElement = document.createElement("div");
    teamElement.innerHTML = `<p>Name: ${team.name}</p><p>City: ${team.city}</p><p>Code: ${team.code}</p>`;
    teamResults.appendChild(teamElement);

}

getTeams()
  .then(data => {
    displayTeams(data);
  })
  .catch(error => {
    console.error(error);
  });

function searchPlayer() {
  let findPlayer = document.getElementById("findPlayer").value;
  console.log("Searching for: " + findPlayer);

  getPlayers()
    .then(data => {
      const foundPlayers = data.filter(player => {
        const fullName = player.firstname + " " + player.lastname;
        return fullName.toLowerCase().includes(findPlayer.toLowerCase());
      });

      if (foundPlayers.length > 0) {
        console.log(`${foundPlayers[0].firstname} ${foundPlayers[0].lastname}`);
        playerDiv.innerText = `${foundPlayers[0].firstname} ${foundPlayers[0].lastname} / ${foundPlayers[0].college}`;
        displayPlayers(foundPlayers); // Pass the found players to the displayPlayers function
      } else {
        playerDiv.innerText= "No players found."
      }
    })
    .catch(error => {
      console.error(error);
    });
}

function displayPlayers(player) {
  const resultsDiv = document.getElementById("randPlayResults");
  resultsDiv.innerText = ""; // Clear previous results

  const playerElement = document.createElement("div");
  playerElement.textContent = `Name: ${player.firstname} ${player.lastname}, College: ${player.college}`;

  resultsDiv.appendChild(playerElement);
}

getPlayers()
  .then(data => {
    displayPlayers(data);
  })
  .catch(error => {
    console.error(error);
  });

  
  async function checkStandings() {
    try {
      const standings = await getRecords();
  
      // Display the standings
      displayStandings(standings);
    } catch (error) {
      console.error(error);
    }
  }
  
  function displayStandings(standings) {
    const standingsContainer = document.getElementById('standingResults');
    standingsContainer.innerHTML = ''; // Clear previous results
  
    standings.forEach(standing => {
      // Create a DOM element to display the desired fields
      const standingElement = document.createElement('div');
      standingElement.textContent = `Season: ${standing.season}, Team: ${standing.team}, Win: ${standing.win}, Loss: ${standing.loss}`;
  
      standingsContainer.appendChild(standingElement);
    });
  }

  function clearStandings() {
  const standingsContainer = document.getElementById('standingResults');
  standingsContainer.innerHTML = '';
}
  
function newTeam() {
  getTeams()
    .then(data => {
      // Get the total number of teams
      const totalTeams = data.length;

      // Generate a random index between 0 and totalTeams-1
      const randomTeamIndex = Math.floor(Math.random() * totalTeams);

      // Get the random team
      const randomTeam = data[randomTeamIndex];

      // Display the random team
      displayTeams(randomTeam);
    })
    .catch(error => {
      console.error(error);
    });
}

function newPlayer() {
  getPlayers()
  .then(data => {
    // Get the total number of players
    const totalPlayers = data.length;
    
    // Generate a random index between 0 and totalPlayers-1
    const randomPlayerIndex = Math.floor(Math.random() * totalPlayers);
    
    // Get the random player
    const randomPlayer = data[randomPlayerIndex];
    
    // Display the random player
    displayPlayers(randomPlayer);

  })
  .catch(error => {
    console.error(error);
  });
}

function createTeam(name, city, code) {
  const newTeam = {
    name: name,
    city: city,
    code: code
  };
  
  fetch('https://nba-breakdown.herokuapp.com/api/team', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTeam),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Handle the created team data here
  })
  .catch(error => {
    console.error(error);
  });
}

function addNewTeam() {
  const name = document.getElementById("newTeamName").value;
  const city = document.getElementById("newTeamCity").value;
  const code = document.getElementById("newTeamCode").value;

  createTeam(name, city, code);
}

function updateTeamHandler() {
  const teamId = document.getElementById("teamId").value;
  const updatedName = document.getElementById("updatedTeamName").value;
  const updatedCity = document.getElementById("updatedTeamCity").value;
  const updatedCode = document.getElementById("updatedTeamCode").value;

  const updatedTeam = {
    name : updatedName,
    city: updatedCity,
    code: updatedCode,
  };

  updateTeam(teamId, updatedTeam);
}

function updateTeam(id, updatedTeam) {
  fetch(`https://nba-breakdown.herokuapp.com/api/team/name/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTeam),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Handle the updated team data here
    })
    .catch(error => {
      console.error(error);
    });
}

function deleteTeam(name) {
  fetch(`https://nba-breakdown.herokuapp.com/api/team/name/${name}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      console.log(`${name} has been deleted`)
    })
    .catch(error => {
      console.error(error);
    });
}

function deleteTeamHandler() {
  const teamId = document.getElementById("deleteTeamId").value;

  deleteTeam(teamId);
}

function createPlayer(firstname, lastname, college) {
  const newPlayer = {
    firstname: firstname,
    lastname: lastname,
    college: college
  };

  fetch('https://nba-breakdown.herokuapp.com/api/players', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPlayer),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Handle the created player data here
    })
    .catch(error => {
      console.error(error);
    });
}

function addNewPlayer() {
  const firstName = document.getElementById("newPlayerFirstName").value;
  const lastName = document.getElementById("newPlayerLastName").value;
  const college = document.getElementById("newPlayerCollege").value;

  createPlayer(firstName, lastName, college);
}

function updatePlayer(firstName, lastName, updatedPlayer) {
  fetch(`https://nba-breakdown.herokuapp.com/api/players/${firstName}/${lastName}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedPlayer),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Player not found.'); // Throw an error when player is not found
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      // Handle the updated player data here
    })
    .catch(error => {
      console.error(error);
    });
}

function deletePlayer(event) {
  event.preventDefault();

  const firstname = document.getElementById("deletePlayFirstName").value;
  const lastname = document.getElementById("deletePlayLastName").value;

  fetch(`https://nba-breakdown.herokuapp.com/api/players/${firstname}/${lastname}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Handle the deleted player data here
    })
    .catch(error => {
      console.error(error);
    });
}










