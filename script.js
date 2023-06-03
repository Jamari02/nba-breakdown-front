//Connection to backend 
app.use(express.static('nba-breakdown'));

//Buttons
const team = document.getElementById('find-team').addEventListener('click', searchTeam)
const player = document.getElementById('find-player').addEventListener('click', searchPlayer)
const standings = document.getElementById('standings').addEventListener('click', checkStandings)

//Search Bar
const searchBar = document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevents the form from submitting and refreshing the page
    performSearch();
  });




  //Functions

   function searchTeam(){

   }

   function searchPlayer(){

   }

   function checkStandings(){

   }



  function performSearch() {
    let searchTerm = document.getElementById("searchInput").value;
    // Perform your search logic here
    // You can use AJAX requests or search algorithms to fetch and display results
    console.log("Searching for: " + searchTerm);
    alert("Searching for: " + searchTerm);
  }