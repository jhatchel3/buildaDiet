"use strict";

const apikey = "4ynxlc7U8X3DN7QDXBMdXnAVxR1XxHH5kAJSpCn9";
const searchURL = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apikey}&`;

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map((key) => `${key}=${params[key]}`);
  return queryItems.join("&");
}

function getFoods(query, maxResults = 10) {
  const params = {
    query: query,
    pageSize: maxResults,
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + queryString;

  //   console.log(url);

  const options = {
    // headers: new Headers({
    //   "x-rapidapi-key": apikey})
  };

  fetch(url)
    .then((response) => response.json())
    .then((responseJson) => displayResults(responseJson));
}

function getMacros(responseJson) {
  //let foodObject = {};

  let nutrients = [];
  for (let i = 0; i < responseJson.foods.length; i++) {
    nutrients = responseJson.foods[i].foodNutrients.filter(checkNutrients);
    responseJson.foods[i].foodNutrients = nutrients;
  }
  return responseJson;
}
function checkNutrients(nutrient) {
  let result =
    nutrient.nutrientName == "Protein" ||
    nutrient.nutrientName.indexOf("Carbohydrate") > -1 ||
    nutrient.nutrientName.indexOf("Total lipid") > -1;

  return result;
}

//nutrients.filter(checkNutrients);

function displayResults(responseJson) {
  console.log(responseJson);

  const nutrients = getMacros(responseJson);

  // if there are previous results, remove them

  $("#results-list").empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.foods.length; i++) {
    //<p>${nutrients[i].name}</p>
    // we want to display the name, protein fats and  carbs

    $("#results-list").append(
      `<ul>
      <li><h3>${responseJson.foods[i].description}</h3>
         <p>${responseJson.foods[i].foodNutrients[0].nutrientName}</p>
         <p>${responseJson.foods[i].foodNutrients[0].value}</p>
        <p>${responseJson.foods[i].foodNutrients[1].nutrientName}</p>
    
        <p>${responseJson.foods[i].foodNutrients[1].value}</p>
        <p>${responseJson.foods[i].foodNutrients[2].nutrientName}</p>
    
        <p>${responseJson.foods[i].foodNutrients[2].value}</p>
      
      
      </li>
      </ul>`
    );
  }
  // $("#results-list").append(
  //   `<li><h3>${responseJson.foods[i].description}</h3>
  //   <p>${responseJson.foods[i].foodNutrients[0].nutrientName}</p>
  //   <p>${responseJson.foods[i].foodNutrients[0].value}</p>
  //   <p>${responseJson.foods[i].foodNutrients[1].nutrientName}</p>

  //   <p>${responseJson.foods[i].foodNutrients[1].value}</p>
  //   <p>${responseJson.foods[i].foodNutrients[2].nutrientName}</p>

  //   <p>${responseJson.foods[i].foodNutrients[2].value}</p>

  //   </li>`
  //display the results section
  $("#results").removeClass("hidden");
}

function watchForm() {
  $("#food-form").submit((event) => {
    event.preventDefault();
    const searchTerm = $("#food-search").val();
    const maxResults = $("#js-max-results").val();
    const response = getFoods(searchTerm, maxResults);
    //displayResults(response);
  });
}

$(watchForm);
