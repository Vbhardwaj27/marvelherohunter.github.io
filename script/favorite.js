/** Declare Variables for elements */
let divErr = document.getElementById("divError");

/** Load Favorite heroes from the local storage without using HTTP request */
function loadFavorites() {
  // Read the favorite heroes from localStorage and convert it to an array object with JSON.parse
  let favlist = Array.from(
    JSON.parse(localStorage.getItem("favheroes") || "[]")
  );
  let _container = document.getElementById("superhero-container");
  _container.innerHTML = "";

  debugger;
  // Loop through the favorite heroes and bind them to the container
  favlist.forEach((hero) => {
    let output = ` <div class="superhero-image-container">
              <span class="title text-nowrap">${hero.name}
              <i class="favorite fa fa-heart" title="Add/remove to favorites" onclick="addRemoveFavorites(${hero.id},'${hero.name}')">
              </i></span>
              <a href="detail.html?id=${hero.id}" title="click for more description">
              <img src="${hero.img}"/></a></div>`;

    _container.innerHTML += output;
  }); // end of foreach on favorite list
}

// Return true/false if hero exist in favorite list
function isHeroExist(charId) {
  // Read the favorite heroes from localStorage and convert it to an array object with JSON.parse
  let favlist = Array.from(
    JSON.parse(localStorage.getItem("favheroes") || "[]")
  );

  debugger;
  // If favorite hero is already exist, return true
  favlist.forEach((hero) => {
    if (!result && hero.id == charId) {
      result = true;
    }
  });
  return result;
}

// ----------- Add heroes to Favourite list -------------------
function addRemoveFavorites(charId, charName) {
  //alert(charId + " [" + charName + "]");
  debugger;
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
        { id: charId, name: charName },
      ])
    );
  }

  favlist.forEach((hero) => {
    console.log(hero.id + " [" + hero.name + "]");
  });
}

/** On loading HTML page, list of favorite heroes from 'localstorae' */
window.onload = loadFavorites();
