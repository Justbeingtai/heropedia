const publicKey = "35fad408979368e76379f831cba43f4d";

function fetching(charId) {
  const privateKey = "5d96d5ad0d54441e8920c0c482bc142e3efd0013";
  const ts = 1;
  const hash = hashing(ts, publicKey, privateKey);
  const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&name=${charId}`;
  
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

  fetching(query);

});
