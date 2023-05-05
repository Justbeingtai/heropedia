// Define the public key for the Marvel API and the maximum size of the search history
const publicKey = "35fad408979368e76379f831cba43f4d";
const MAX_HISTORY_SIZE = 5;

// Retrieve the search history from local storage, or initialize it to an empty array if it doesn't exist
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Get the container for the search history in the HTML document
const historyContainer = document.getElementById("search-history");

// Populate the search history container with search items from the search history array
for (let i = searchHistory.length - 1; i >= 0; i--) {
  const historyItem = document.createElement("li");
  historyItem.textContent = searchHistory[i];
  historyContainer.appendChild(historyItem);
}

// Add a search query to the search history array and save it to local storage
function addSearchToHistory(query) {
  // Add search query to history
  searchHistory.unshift(query);
  
  // Limit history size to MAX_HISTORY_SIZE
  if (searchHistory.length > MAX_HISTORY_SIZE) {
    searchHistory.pop();
  }

  // Save updated history to local storage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// Fetch data for a character from the Marvel API
function fetching(charId) {
  const privateKey = "5d96d5ad0d54441e8920c0c482bc142e3efd0013";
  const ts = 1;
  const hash = hashing(ts, publicKey, privateKey);
  const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&name=${charId}`;

  const resultsContainer = document.getElementById("resultsContainer");

  // Send a GET request to the Marvel API and parse the JSON response
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Clear the container for the search results
      resultsContainer.innerHTML = "";
      // Extract the hero objects from the API response and create HTML elements for each hero
      const heroes = data.data.results;
      heroes.forEach((hero) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const image = document.createElement("img");
        const imageUrl = `${hero.thumbnail.path}.${hero.thumbnail.extension}`;
        image.setAttribute("src", imageUrl);
        card.appendChild(image);

        const name = document.createElement("h2");
        name.innerText = hero.name;
        card.appendChild(name);

        const description = document.createElement("p");
        description.innerText = hero.description;
        card.appendChild(description);

        // Fetch additional data for the hero from the Superhero API and add it to the card element
        fetchSuperheroApiData(hero.name, card);

        resultsContainer.appendChild(card);
      });

      // Add the search query to the search history array and update the search history container in the HTML document
      addSearchToHistory(charId);

      historyContainer.innerHTML = "";
      for (let i = searchHistory.length - 1; i >= 0; i--) {
        const historyItem = document.createElement("li");
        historyItem.textContent = searchHistory[i];
        historyContainer.appendChild(historyItem);
      }

      // Add click listeners to each search history item that triggers a new search with the clicked query
      const historyItems = document.querySelectorAll("#search-history li");
      historyItems.forEach((historyItem) => {
        historyItem.addEventListener("click", function () {
          const query = this.textContent;
          fetching(query);
        });
      });

    })
    .catch((error) => console.log(error));
}

// Create an MD5 hash for the Marvel API request using the provided timestamp, public key, and private key
function hashing(ts, publicKey, privateKey) {
  // Calculate the hash using the MD5 algorithm from the CryptoJS library
  const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
   // Return the calculated hash
  return hash;
}

const searchButton = document.getElementById("search-btn");
const searchInput = document.getElementById("search-box");
const resultsContainer = document.getElementById("resultsContainer");

searchButton.addEventListener("click", function () {
  // Get the search query from the search input field
  const query = searchInput.value;
  // Fetch data for the search query
  fetching(query);

  // Get the Wikipedia search query from the search input field
  var wiki = document.getElementById("search-box").value;
  // Construct the Wikipedia API URL with the search query
  var wikiWeb = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=&explaintext=&titles=${wiki}&origin=*`;

  // Fetch data from the Wikipedia API
  fetch(wikiWeb)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    // Get the page ID of the Wikipedia page
    const pageID = Object.keys(data.query.pages)[0];
    // Get the Wikipedia page extract
    const infoWiki = data.query.pages[pageID].extract;

    // Update the Wikipedia information in the results section
    const wikiInfo = document.getElementById("wikiInfo");
    wikiInfo.innerHTML = infoWiki;
  })
  .catch((error) => console.log(error));
});

const clearButton = document.getElementById("clear-history-btn");
clearButton.addEventListener("click", function() {
  // Remove the search history from local storage
  localStorage.removeItem("searchHistory");
  // Clear the search history array
  searchHistory = [];
  // Clear the search history container on the page
  historyContainer.innerHTML = "";
});

function fetchSuperheroApiData(heroName, card) {
  // Superhero API key and endpoint URL
  var apiKey = "10109737487404041";
  // Construct the URL for the Superhero API with the hero name and API key
  var heroApiUrl = `https://www.superheroapi.com/api.php/${apiKey}/search/${heroName}`;

  // Fetch data from the Superhero API
  fetch(heroApiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Extract relevant data from the API response
      const heroData = data.results && data.results[0];
      if (!heroData) {
        console.log("No data found on Superhero API.");
        return;
      }

      const powerstats = heroData.powerstats;
      const appearance = heroData.appearance;
      const connections = heroData.connections;

      // Create HTML elements to display the extracted data
      const powerstatsSection = createDataSection("Powerstats", powerstats);
      const appearanceSection = createDataSection("Appearance", appearance);
      const connectionsSection = createDataSection("Connections", connections);

      // Append the HTML elements to the card element
      card.appendChild(powerstatsSection);
      card.appendChild(appearanceSection);
      card.appendChild(connectionsSection);
    })
    .catch((error) => console.log(error));
}

function createDataSection(title, data) {
  // Create a section element
  const section = document.createElement("section");
  section.classList.add("data-section");

   // Create a heading element for the section with the given title
  const heading = document.createElement("h3");
  heading.innerText = title;
  section.appendChild(heading);

  // Create a list element with a list item for each key-value pair in the data object
  const list = document.createElement("ul");
  for (const key in data) {
    const listItem = document.createElement("li");
    listItem.innerText = `${key}: ${data[key]}`;
    list.appendChild(listItem);
  }
  // Append the list element to the section element
  section.appendChild(list);
  // Return the section element
  return section;
}

// Eventlistener for redirecting the user to the home page when the home button is clicked
const homeButton = document.getElementById("home-btn");
homeButton.addEventListener("click", function () {
  window.location.href = "http://127.0.0.1:5500/index.html";
});

