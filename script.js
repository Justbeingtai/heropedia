const publicKey = "35fad408979368e76379f831cba43f4d";

function fetching(charId) {
  const privateKey = "5d96d5ad0d54441e8920c0c482bc142e3efd0013";
  const ts = 1;
  const hash = hashing(ts, publicKey, privateKey);
  const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&name=${charId}`;
 
  const resultsContainer = document.getElementById("resultsContainer")
  fetch(url)
    .then(response => response.json())
    .then(data => {
      resultsContainer.innerHTML = "";
      const heroes = data.data.results;
      heroes.forEach(hero => {
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
        
        resultsContainer.appendChild(card);

        console.log(data)
      });
    })
    .catch(error => console.log(error));
}

function hashing(ts, publicKey, privateKey) {
  const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
  return hash;
}

const searchButton = document.getElementById("search-btn");
const searchInput = document.getElementById("search-box");
const resultsContainer = document.getElementById("result-container");

searchButton.addEventListener("click", function() {
  const query = searchInput.value;
  const url = `https://gateway.marvel.com/v1/public/characters?name=${query}&apikey=${publicKey}`;
//Wikipedia fetch
  fetching(query);

  var wiki= document.getElementById("search-box").value
  var wikiWeb=  `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=&explaintext=&titles=${wiki}&origin=*`;
  
  
  fetch(wikiWeb)
   .then((reponse) =>{
       return reponse.json();
   })
   .then(async (data) => {

console.log(data);

var pageID = Object.keys(data.query.pages)[0]
data.query.pages[pageID];

console.log(pageID)

    
const infoWiki = data.query.pages[pageID].extract;
//Name from Search Bar
    var heroName= document.getElementById("heroNameTitle")
    heroName.innerHTML= searchInput.value.toUpperCase();
//Search bar input from Wikipedia
    var wikiInfo = document.getElementById("wikiInfo")
    wikiInfo.innerHTML = infoWiki

//fetch powerstats
function fetchSuperheroApiData(resultsContainer, card) {
  var apiKey = "10109737487404041";
  var heroApiUrl = `https://www.superheroapi.com/api.php/${apiKey}/search/${resultsContainer}`

  fetch(heroApiUrl)
   .then((reponse) =>{
       return reponse.json();
   })
   .then(async (data) => {

console.log(data);
    
fetch(heroApiUrl)
.then(response => response.json())
.then(data => {
  var heroData = data.results && data.results[0];
  if (!heroData) {
    console.log('No data found on Superhero API.');
    return;
  }

  console.log(heroData)

  //var powerstats = heroData.powerstats;
  //var appearance = heroData.appearance;
  //var connections = heroData.connections;

  //var powerstatsSection = createDataSection('Powerstats', powerstats);
  //var appearanceSection = createDataSection('Appearance', appearance);
  //var connectionsSection = createDataSection('Connections', connections);

  //card.appendChild(powerstatsSection);
  //card.appendChild(appearanceSection);
  //card.appendChild(connectionsSection);
//})
//.catch(error => console.log(error));
//}

//function createDataSection(title, data) {
//var section = document.createElement("section");
//section.classList.add("data-section");

//var heading = document.createElement("h3");
//heading.innerText = title;
//section.appendChild(heading);

//var list = document.createElement("ul");
//for (var key in data) {
//var listItem = document.createElement("li");
//listItem.innerText = `${key}: ${data[key]}`;
//list.appendChild(listItem);
//}
//section.appendChild(list);
//return section;
//}
})})}})})
      
   
  
  
  
