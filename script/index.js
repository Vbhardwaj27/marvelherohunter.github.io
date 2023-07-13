/** Declare Variables for elements */
let txtSearch = document.getElementById("txtSearch");
let btnSearch = document.getElementById("btnSearch");
let divErr = document.getElementById("divError");
let listContainer = document.querySelector(".list");
let divLoading = document.getElementById("divLoading");

const [timestamp, apiKey, hashKey] = [ts, publicKey, hashMD5]; //  Importing the variables from api.js
const urlAPI = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashKey}`;
const xhr = new XMLHttpRequest();

// Adding eventListener to search bar
txtSearch.addEventListener("input", bindHeroesList, false);
btnSearch.addEventListener("click", searchHero, false);
document.addEventListener("click", removeElements, false);

// ----------- bind heroes list on search input ---------------
async function bindHeroesList() {
  let searchKey = txtSearch.value;

  console.log("Hash Key :: " + hashKey + " Search key :: " + searchKey);
  if (searchKey.length < 3) {
    return false;
  }
  removeElements();

  // API call to get the data
  const url = urlAPI + `&nameStartsWith=${searchKey}`;
  const response = await fetch(url);
  const jsonData = await response.json();
  //debugger;

  jsonData.data["results"].forEach((result) => {
    let name = result.name;
    let div = document.createElement("div");
    div.style.cursor = "pointer";
    div.classList.add("autocomplete-items");
    div.setAttribute(
      "onclick",
      "displayWords(`" + name + "`," + result.id + ")"
    );
    let word = "<b>" + name.substr(0, searchKey.length) + "</b>";
    word += name.substr(searchKey.length);
    div.innerHTML = `<p class="item">${word}</p>`;
    listContainer.appendChild(div);
  });
}

// --------- display selected hero from list to search box ------------
function displayWords(value, charId) {
  //debugger;
  txtSearch.value = value;
  btnSearch.setAttribute("id", charId);
  removeElements();
}

// --------- remove searc list from the screen ----------
function removeElements() {
  listContainer.innerHTML = "";
}

// ------------- Bind the Search result ................
async function searchHero(e) {
  //debugger;
  //e.stopPropagation();
  searchKey = txtSearch.value;
  if (searchKey.length == 0) {
    divErr.classList.add("showerror");
    divErr.innerText = "Please enter the search...";
    return;
  }
  let url = urlAPI + `&name=${searchKey}`;

  xhr.open("GET", url, true);
  xhr.onloadstart = () => {
    divLoading.style.display = "block";
    divErr.classList.add("showerror");
    divErr.innerText = "Please wait loading search result......";
  };

  xhr.onerror = function (err) {
    divErr.classList.add("showerror");
    divErr.innerText = "Network error occurred....!!";
  };

  xhr.onload = function () {
    if (this.status == 200) {
      const results = JSON.parse(this.responseText);

      //console.log(results);
      if (results["data"].count == 0) {
        divErr.classList.add("showerror");
        divErr.innerText = "No results for the search (${searchKey})";
      }
      // if response is undefined / blank
      else if (results == undefined || results.length == 0) {
        divErr.classList.add("showerror");
        divErr.innerText = `It seems that there is some server issues !! Try after few minutes ....`;
      } else {
        bindSearchResult(results["data"].results); // bind data successfully to homepage
      }
    } else {
      divErr.classList.add("showerror");
      divErr.innerText = "Page response with 404......";
    }
  };

  xhr.onloadend = function () {
    divLoading.style.display = "none";
    divErr.classList.add("showerror");
    divErr.innerText = `Search for superhero ends..`;
    setTimeout(() => {
      divErr.classList.remove("showerror");
    }, 1200);
  };

  xhr.send();
}

// --------------- Bind the result of search in a Card container -----------
function bindSearchResult(result) {
  let _container = document.getElementById("superhero-container");
  _container.innerHTML = "";
  //debugger;
  for (let i = 0; i < result.length; i++) {
    const hero = result[i];
    let desc = hero.description.slice(0, 50);
    if (hero.description.length == 0) desc = "no description found";

    let isFavorite = isHeroExist(hero.id);
    let imgPath = hero.thumbnail["path"] + "." + hero.thumbnail["extension"];
    let output = `<div class="container">
                <section class="mx-auto" style="max-width: 23rem;">
                    
                  <div class="card testimonial-card mt-2 mb-3 aqua-gradient"> 
                  <div> <i class="favorite fa ${
                    isFavorite ? "fa-heart" : "fa-heart-o"
                  } " title="Add/remove to favorites" onclick="addRemoveFavorites(${
      hero.id
    },'${hero.name}','${imgPath}')"></i></div>                   
                    <div class="avatar mx-auto white">
                    <a href="detail.html?id=${
                      hero.id
                    }" title="click for more description">
                      <img src="${imgPath}" class="rounded-circle img-fluid"
                        alt="woman avatar"></a>
                    </div>
                    <div class="card-body text-center">                    
                      <h4 class="card-title favtitle">${hero.name}</h4>
                      <hr>
                      <p>${desc}....<a title="click for more description" href="detail.html?id=${
      hero.id
    }">more</a></p>
                    </div>
                  </div>
                  
                </section>
              </div>`;

    _container.innerHTML += output;
  } // end of for loop
}

// ----------- Bind the homepage with first 20 Marvel heroes  -------------------
function bindHomePageHeroes(result) {
  let _container = document.getElementById("superhero-container");
  _container.innerHTML = "";
  let count = 0;

  for (let i = 0; i < result.length; i++) {
    const hero = result[i];

    if (
      hero.description.length == 0 ||
      hero.thumbnail["path"].indexOf("image_not_available") != -1
    ) {
      continue;
    }

    //debugger;
    let isFavorite = isHeroExist(hero.id);
    let imgPath = hero.thumbnail["path"] + "." + hero.thumbnail["extension"];

    let output = ` <div class="superhero-image-container">
              <span class="title text-nowrap">${hero.name}
              <i class="favorite fa ${
                isFavorite ? "fa-heart" : "fa-heart-o"
              } " title="Add/remove to favorites" onclick="addRemoveFavorites(${
      hero.id
    },'${hero.name}','${imgPath}')"></i></span>
              <a href="detail.html?id=${
                hero.id
              }" title="click for more description">
              <img src="${imgPath}"/></a></div>`;

    _container.innerHTML += output;
    count++;
    if (count == 10) break;
    //debugger;
  }
}

// Return true/false if hero exist in favorite list
function isHeroExist(charId) {
  // Read the favorite heroes from localStorage and convert it to an array object with JSON.parse
  let favlist = Array.from(
    JSON.parse(localStorage.getItem("favheroes") || "[]")
  );

  //debugger;
  let result = false;
  // If favorite hero is already exist, return true
  favlist.forEach((hero) => {
    if (!result && hero.id == charId) {
      result = true;
    }
  });
  return result;
}

// ----------- Add heroes to Favourite list -------------------
function addRemoveFavorites(charId, charName, imgPath) {
  //alert(charId + " [" + charName + "]" + " ---" + imgPath);
  //debugger;
  if (event.target.classList.contains("fa-heart-o"))
    event.target.classList.replace("fa-heart-o", "fa-heart");
  else if (event.target.classList.contains("fa-heart"))
    event.target.classList.replace("fa-heart", "fa-heart-o");

  // Read the favorite heroes from localstorage
  let favlist = Array.from(
    JSON.parse(localStorage.getItem("favheroes") || "[]")
  );

  let isRemoved = false;
  // If favorite hero is already exist, remove it.
  favlist.forEach((hero) => {
    if (hero.id === charId) {
      favlist.splice(favlist.indexOf(hero), 1); // IMPORTANT :: delete hero from the localstorage
      localStorage.setItem("favheroes", JSON.stringify(favlist)); // update favheroes
      isRemoved = true;
      return;
    }
  });

  // IMPORTANT :: Save the favorite hero to the localStorage at user's device
  // Understand Spread (...) operator below
  // let numbers = [1,2,3]; multiply(...numbers); // will multiply each individual element ie., 6

  if (!isRemoved) {
    localStorage.setItem(
      "favheroes",
      JSON.stringify([
        ...JSON.parse(localStorage.getItem("favheroes") || "[]"),
        { id: charId, name: charName, img: imgPath },
      ])
    );
  }

  favlist.forEach((hero) => {
    console.log(hero.id + " [" + hero.name + "]");
  });
}

// ----------- Initialising the homepage with first 20 Marvel hero -------------------
function initialise() {
  //debugger;

  let url = urlAPI + `&limit=90`; // control the limit of rsults (default is 20)
  searchKey = txtSearch.value;
  divLoading.style.display = "none";

  xhr.open("GET", url, true);

  xhr.onloadstart = () => {
    txtSearch.disabled = true;
    divLoading.style.display = "block";
    divErr.classList.add("showerror");
    divErr.innerText = "Please wait loading superheroes......";
  };

  xhr.onerror = function (err) {
    divErr.classList.add("showerror");
    divErr.innerText = "Network error occurred....!!";
  };

  xhr.onload = function () {
    if (this.status == 200) {
      const results = JSON.parse(this.responseText);

      //console.log(results);
      if (results["data"].count == 0) {
        divErr.classList.add("showerror");
        divErr.innerText = `No results for the search  ${searchKey}`;
      }
      // if response is undefined / blank
      else if (results == undefined || results.length == 0) {
        divErr.classList.add("showerror");
        divErr.innerText = `It seems that there is some server issues !! Try after few minutes ....`;
      } else {
        bindHomePageHeroes(results["data"].results); // bind data successfully to homepage
      }
    } else {
      divErr.classList.add("showerror");
      divErr.innerText = "Page response with 404......";
    }
  };

  xhr.onloadend = function () {
    txtSearch.disabled = false;
    divLoading.style.display = "none";
    divErr.classList.add("showerror");
    divErr.innerText = `Search for superhero ends.`;
    setTimeout(() => {
      divErr.classList.remove("showerror");
    }, 1200);
  };

  xhr.send();
}

// -------------------------------- Window onload --------------------------------
initialise();
