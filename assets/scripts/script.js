const publicKey = "35fad408979368e76379f831cba43f4d";
const MAX_HISTORY_SIZE = 5;

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

const historyContainer = document.getElementById("search-history");
for (let i = searchHistory.length - 1; i >= 0; i--) {
  const historyItem = document.createElement("li");
  historyItem.textContent = searchHistory[i];
  historyContainer.appendChild(historyItem);
}

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

function fetching(charId) {
  const privateKey = "5d96d5ad0d54441e8920c0c482bc142e3efd0013";
  const ts = 1;
  const hash = hashing(ts, publicKey, privateKey);
  const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&name=${charId}`;

  const resultsContainer = document.getElementById("resultsContainer");
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      resultsContainer.innerHTML = "";
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

        fetchSuperheroApiData(hero.name, card);

        resultsContainer.appendChild(card);
      });
      addSearchToHistory(charId);

      historyContainer.innerHTML = "";
      for (let i = searchHistory.length - 1; i >= 0; i--) {
        const historyItem = document.createElement("li");
        historyItem.textContent = searchHistory[i];
        historyContainer.appendChild(historyItem);
      }
    })
    .catch((error) => console.log(error));
}

function hashing(ts, publicKey, privateKey) {
  const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
  return hash;
}

const searchButton = document.getElementById("search-btn");
const searchInput = document.getElementById("search-box");
const resultsContainer = document.getElementById("resultsContainer");

searchButton.addEventListener("click", function () {
  const query = searchInput.value;
  fetching(query);

  var wiki = document.getElementById("search-box").value;
  var wikiWeb = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=&explaintext=&titles=${wiki}&origin=*`;

  fetch(wikiWeb)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const pageID = Object.keys(data.query.pages)[0];
    const infoWiki = data.query.pages[pageID].extract;

    const heroName = document.getElementById("heroNameTitle");
    heroName.innerHTML = searchInput.value.toUpperCase();

    const wikiInfo = document.getElementById("wikiInfo");
    wikiInfo.innerHTML = infoWiki;
  })
  .catch((error) => console.log(error));
});

const clearButton = document.getElementById("clear-history-btn");
clearButton.addEventListener("click", function() {
  localStorage.removeItem("searchHistory");
  searchHistory = [];
  historyContainer.innerHTML = "";
});

function fetchSuperheroApiData(heroName, card) {
  var apiKey = "10109737487404041";
  var heroApiUrl = `https://www.superheroapi.com/api.php/${apiKey}/search/${heroName}`;

  fetch(heroApiUrl)
    .then((response) => response.json())
    .then((data) => {
      const heroData = data.results && data.results[0];
      if (!heroData) {
        console.log("No data found on Superhero API.");
        return;
      }

      const powerstats = heroData.powerstats;
      const appearance = heroData.appearance;
      const connections = heroData.connections;

      const powerstatsSection = createDataSection("Powerstats", powerstats);
      const appearanceSection = createDataSection("Appearance", appearance);
      const connectionsSection = createDataSection("Connections", connections);

      card.appendChild(powerstatsSection);
      card.appendChild(appearanceSection);
      card.appendChild(connectionsSection);
    })
    .catch((error) => console.log(error));
}

function createDataSection(title, data) {
  const section = document.createElement("section");
  section.classList.add("data-section");

  const heading = document.createElement("h3");
  heading.innerText = title;
  section.appendChild(heading);

  const list = document.createElement("ul");
  for (const key in data) {
    const listItem = document.createElement("li");
    listItem.innerText = `${key}: ${data[key]}`;
    list.appendChild(listItem);
  }
  section.appendChild(list);
  return section;
}

const homeButton = document.getElementById("home-btn");
homeButton.addEventListener("click", function () {
  window.location.href = "http://127.0.0.1:5500/index.html";
});

