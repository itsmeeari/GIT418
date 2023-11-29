// jQueryUI Carousel
$(window).on("load", function () {
  let slideCount = $("#carousel .slides img").length;
  let slideWidth = $("#carousel .slides img").width();
  let totalWidth = slideCount * slideWidth;

  // setting CSS style properties
  $("#carousel").css({ width: totalWidth });

  //initialize image displayed in the slider
  let currentPosition = 0;
});

// jQueryUI Accordion
$(document).ready(function () {
  $("#accordion1, #accordion2, #accordion3, #accordion4").accordion({
    collapsible: true,
    active: false
  });
});

// web storage - shopping list
// start with empty array
let groceryList = [];

// DOM loading
window.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#addBtn").addEventListener("click", addBtnClick);
  document.querySelector("#clearBtn").addEventListener("click", clearBtnClick);

  // load grocery list from localStorage
  groceryList = loadList();
  // display list
  if (groceryList.length > 0) {
    for (let item of groceryList) {
      showItem(item);
    }
  }
});

// clear button
function enableClearButton(enabled) {
  document.querySelector("#clearBtn").disabled = !enabled;
}

// displays item at end of the ordered list
function showItem(item) {
  let list = document.querySelector("#groceryList");
  list.innerHTML += `<li>${item}</li>`;
}

// adds item to grocery list
function addBtnClick() {
  let itemTextInput = document.querySelector("#itemInput");
  let item = itemTextInput.value.trim();
  if (item.length > 0) {
    enableClearButton(true);
    showItem(item);
    groceryList.push(item);
    // saves grocery list to localStorage
    saveList(groceryList);
  }
  // clears input
  itemTextInput.value = "";
}

// clears the list
function clearBtnClick() {
  enableClearButton(false);
  groceryList = [];
  let list = document.querySelector("#groceryList");
  list.innerHTML = "";
  // remove the grocery list from localStorage
  clearList();
}

// retrieve list from local storage
function loadList() {
  let listString = localStorage.getItem("list");
  if (listString) {
    return listString.split(",");
  } else {
    return [];
  }
}
// save grocerylist to local storage
function saveList(groceryList) {
  let listString = groceryList.join(",");
  localStorage.setItem("list", listString);
}
//remove grocery list from local storage
function clearList() {
  localStorage.removeItem("list");
}
// print shopping list
document.querySelector("#printBtn").addEventListener("click", function () {
  window.print();
});

// Recipe API
function searchRecipe(e) {
  // prevent default form submission
  e.preventDefault();

  // input from form
  let searchInput = document.getElementById("searchRecipe");
  // store the search in a variable and encode it properly
  let query = encodeURIComponent(searchInput.value.trim());
  // error message span
  let errorSpan = document.querySelector("#recipeAPI .message");
  // the area of the page where we'll display output
  let searchResults = document.getElementById("results");

  // clear out any old output and error messages
  searchInput.classList.remove("errorInput");
  errorSpan.classList.remove("error");
  searchResults.innerHTML = "";

  // Check if the input is not empty
  if (query === "") {
    // input and error message span so it will display to the user
    searchInput.classList.add("errorInput");
    errorSpan.classList.add("error");
    errorSpan.textContent = "Please enter a search term.";
  } else {
    // variables for RapidAPI calling
    let urlStart =
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?";
    let apiKey = "1f6d0bd8a8msh10b1200c5d74f69p1b840ajsn3a961f13e18f";
    let additionalParams = "&addRecipeInformation=true";
    let queryParam = `query=${query}`;
    let endpoint = `${urlStart}${queryParam}${additionalParams}`;

    // new XMLHttpRequest - some code taken from Rapid API
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        // check for status 200 response
        if (this.status === 200) {
          // convert the response from the API to a JSON object
          let response = JSON.parse(this.responseText);
          // string to build output
          let output = "<ul>";
          // iterate through results and display to page
          response.results.forEach(function (result) {
            output += `<li><a href="${result.sourceUrl}" target="_blank">${result.title}</a><br><img src="${result.image}" alt="${result.title}"></li>`;
          });
          // close the list displaying on page
          output += "</ul>";
          // add output string/results to the page
          searchResults.innerHTML = output;
        } else {
          // error message
          errorSpan.textContent =
            "There was an issue with your recipe search. Please try again.";
          console.error("API Error:", this.responseText);
        }
      }
    });
    // search string formatted for use in a URL - some code pulled from Rapid API
    xhr.open("GET", endpoint);
    xhr.setRequestHeader("X-RapidAPI-Key", apiKey);
    xhr.setRequestHeader(
      "X-RapidAPI-Host",
      "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
    );
    xhr.send(null);
  }
}
// event listener for when user submits
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("#recipeAPI form")
    .addEventListener("submit", searchRecipe);
});
