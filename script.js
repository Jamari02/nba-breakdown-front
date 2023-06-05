// Buttons
const randomTeam = document.getElementById('random-team').addEventListener('click', newTeam);
const randomPlayer = document.getElementById('random-player').addEventListener('click', newPlayer);
const records = document.getElementById('records').addEventListener('click', checkStandings);
const grabPlayer = document.getElementById('searchFormPlayer').addEventListener('click', searchPlayer);
const grabTeam = document.getElementById('searchFormTeam').addEventListener('submit', searchTeam);
const hideStandingsButton = document.getElementById('hideStandings');
hideStandingsButton.addEventListener('click', hideStandings);


// Search Bar
const teamSearchBar = document.getElementById("submitTeam").addEventListener("click", function (event) {
  event.preventDefault(); // Prevents the form from submitting and refreshing the page
  
});

const playerSearchBar = document.getElementById("submitPlayer").addEventListener("click", function(event) {
  event.preventDefault(); // Prevents the form from submitting and refreshing the page
  
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
  console.log("Searching for: " + findTeam);

  getTeams()
    .then(data => {
      const foundTeams = data.filter(team => team.name.toLowerCase().includes(findTeam.toLowerCase()));
      console.log(foundTeams);
      displayTeams(foundTeams); // Pass the found teams to the displayTeams function
    })
    .catch(error => {
      console.error(error);
    });
}

function displayTeams(team) {
  const teamsContainer = document.getElementById("teamsContainer");
  teamsContainer.innerHTML = ""; // Clear previous results

  const teamElement = document.createElement("div");
  teamElement.textContent = `Name: ${team.name}, City: ${team.city}, Code: ${team.code}`;

  // // Create a delete button
  // const deleteButton = document.createElement("button");
  // deleteButton.textContent = "Delete";
  // deleteButton.addEventListener("click", function () {
  //   deleteTeam(team.id); // Call the deleteTeam function with the team id
  // });

  // // Append the delete button to the team element
  // teamElement.appendChild(deleteButton);

  teamsContainer.appendChild(teamElement);
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
        console.log(foundPlayers);
        displayPlayers(foundPlayers); // Pass the found players to the displayPlayers function
      } else {
        console.log("No players found.");
      }
    })
    .catch(error => {
      console.error(error);
    });
}

function displayPlayers(player) {
  const playersContainer = document.getElementById("playersContainer");
  playersContainer.innerHTML = ""; // Clear previous results

  const playerElement = document.createElement("div");
  playerElement.textContent = `Name: ${player.firstname} ${player.lastname}, College: ${player.college}`;

  playersContainer.appendChild(playerElement);
}
getPlayers()
  .then(data => {
    displayPlayers(data);
  })
  .catch(error => {
    console.error(error);
  });

  let standingsVisible = false;

  async function checkStandings() {
    try {
      const standings = await getRecords();
  
      const filteredStandings = standings.map(standing => {
        return {
          season: standing.season,
          team: standing.team,
          win: standing.win,
          loss: standing.loss
        };
      });
  
      if (standingsVisible) {
        hideStandings();
      } else {
        displayStandings(filteredStandings);
        standingsVisible = true;
      }
  
      // Show the "hideStandings" button
      hideStandingsButton.style.display = 'block';
    } catch (error) {
      console.error(error);
    }
  }
  
  function hideStandings() {
    const standingsContainer = document.getElementById('standingsContainer');
    standingsContainer.style.display = 'none';
  
    hideStandingsButton.style.display = 'none';
  
    standingsVisible = false;
  }
  
  function displayStandings(standings) {
    const standingsContainer = document.getElementById('standingsContainer');
    standingsContainer.innerHTML = ''; // Clear previous results
  
    standings.forEach(standing => {
      // Create a DOM element to display the desired fields
      const standingElement = document.createElement('div');
      standingElement.textContent = `Season: ${standing.season}, Team: ${standing.team}, Win: ${standing.win}, Loss: ${standing.loss}`;
  
      standingsContainer.appendChild(standingElement);
    });
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

function updateTeam(id, updatedTeam) {
  fetch(`https://nba-breakdown.herokuapp.com/api/team/${id}`, {
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

function deleteTeam(id) {
  fetch(`https://nba-breakdown.herokuapp.com/api/team/${id}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Handle the deleted team data here
    })
    .catch(error => {
      console.error(error);
    });
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

function updatePlayer(id, updatedPlayer) {
  fetch(`https://nba-breakdown.herokuapp.com/api/players/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedPlayer),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Handle the updated player data here
    })
    .catch(error => {
      console.error(error);
    });
}

function deletePlayer(id) {
  fetch(`https://nba-breakdown.herokuapp.com/api/players/${id}`, {
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

