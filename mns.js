const baseUrl = "https://www.thecocktaildb.com/api/json/v1/1/";

const searchBox = document.getElementById("search-box");
const resultsContainer = document.getElementById("results");

searchBox.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = document.getElementById("query").value;
  if (!query) return;

  const searchBoxUrl = `${baseUrl}search.php?s=${query}`;

  try {
    const response = await fetch(searchBoxUrl);
    const data = await response.json();

    resultsContainer.innerHTML = "";
    const cocktails = data.drinks;
    if (!cocktails) {
      resultsContainer.innerHTML = "We don't have that for now🙃 Try searching for something else?";
      return;
    }

    cocktails.forEach(cocktail => createCocktailElement(cocktail));
  } catch (error) {
    console.error(error);
  }
});

async function createCocktailElement(cocktail) {
  const cocktailElement = document.createElement("div");
  cocktailElement.classList.add("cocktail");

  const image = document.createElement("img");
  image.src = cocktail.strDrinkThumb;
  image.alt = cocktail.strDrink;
  cocktailElement.appendChild(image);

  const title = document.createElement("h3");
  title.textContent = cocktail.strDrink;
  cocktailElement.appendChild(title);

  const detailResponse = await fetch(`${baseUrl}lookup.php?i=${cocktail.idDrink}`);
  const detailData = await detailResponse.json();
  const drink = detailData.drinks[0];

  const instructions = document.createElement("p");
  instructions.textContent = `Instructions: ${drink.strInstructions}`;
  cocktailElement.appendChild(instructions);

  const ingredientsList = document.createElement("ul");
  ingredientsList.classList.add("ingredients");
  cocktailElement.appendChild(ingredientsList);

  for (let i = 1; i <= 15; i++) {
    const ingredient = `strIngredient${i}`;
    const measure = `strMeasure${i}`;
    if (drink[ingredient] && drink[ingredient].trim() !== "") {
      const ingredientItem = document.createElement("li");
      ingredientItem.textContent = `${drink[measure]} ${drink[ingredient]}`;
      ingredientsList.appendChild(ingredientItem);
    }
  }

  const likeButton = document.createElement("button");
  likeButton.classList.add("like-button");
  likeButton.dataset.liked = "false";
  likeButton.textContent = "♡ Like";
  likeButton.addEventListener("click", () => {
    likeButton.dataset.liked = likeButton.dataset.liked === "false" ? "true" : "false";
    likeButton.textContent = likeButton.dataset.liked === "true" ? "❤️ Liked" : "♡ Like";
  });
  cocktailElement.appendChild(likeButton);

  resultsContainer.appendChild(cocktailElement);
}
