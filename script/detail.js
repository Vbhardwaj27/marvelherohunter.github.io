let divErr = document.getElementById("divError");
let divLoading = document.getElementById("divLoading");
let listContainer = document.querySelector(".list");

const [timestamp, apiKey, hashKey] = [ts, publicKey, hashMD5]; //  Importing the variables from api.js

const xhr = new XMLHttpRequest();

// ----------- Bind the homepage with first 20 Marvel heroes  -------------------
function bindHomePageHeroes(result) {
  let _container = document.getElementById("superhero-container");
  _container.innerHTML = "";

  //debugger;
  for (let i = 0; i < result.length; i++) {
    const hero = result[i];
    let desc = hero.description;
    if (hero.description.length == 0) desc = "no description found";
    //debugger;
    let isFavorite = isHeroExist(hero.id);
    let imgPath = hero.thumbnail["path"] + "." + hero.thumbnail["extension"];

    output = `<div class="card mb-3 card-main">
              <div class="row g-0">
                <div class="col-md-4">
                  <img src="${imgPath}" class="img-fluid rounded-start card-img">
                </div>
                <div class="col-md-8 card-bodyclr" >
                  <div class="card-body">
                    <h5 class="card-title card-heading">${
                      hero.name
                    }<i class="favorite fa ${
      isFavorite ? "fa-heart" : "fa-heart-o"
    } " title="Add/remove to favorites" onclick="addRemoveFavorites(${
      hero.id
    },'${hero.name}','${imgPath}')"></i></h5>
                    <p class="card-text card-pad">${desc}</p>
                    
                  </div>
                  <div class="card-footer"><p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p></div>
                </div>
              </div>
              </div>`;

    _container.innerHTML = output;

    //debugger;
  }
}

// Return true/false if hero exist in favorite list
function isHeroExist(charId) {
  // Read the favorite heroes from localstorage
  let favlist = Array.from(
    JSON.parse(localStorage.getItem("favheroes") || "[]")
  );
  debugger;
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
  //alert(charId + " [" + charName + "]");
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

  const urlParams = new URLSearchParams(location.search);
  let charId = 1017100; // default detail of first hero of home page
  for (const [key, value] of urlParams) {
    if (key == "id") {
      console.log(value);
      charId = value;
    }
  }

  let url = `https://gateway.marvel.com:443/v1/public/characters/${charId}?ts=${timestamp}&apikey=${apiKey}&hash=${hashKey}`;

  xhr.open("GET", url, true);

  xhr.onloadstart = () => {
    divLoading.style.display = "block";
    divErr.classList.add("showerror");
    divErr.innerText = "Please wait loading hero detail......";
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
        divErr.innerText = `No results for the character ID  ${charId}`;
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
    divLoading.style.display = "none";
    divErr.classList.add("showerror");
    divErr.innerText = `Detail for superhero ends..`;
    setTimeout(() => {
      divErr.classList.remove("showerror");
    }, 1200);
  };

  xhr.send();
}

// -------------------------------- Window onload --------------------------------
initialise();
