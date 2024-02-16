// API Link
const baseUrl = "https://www.thecocktaildb.com/api/json/v1/1/";

// Constant Elements
const searchBox = document.getElementById("search-box");
const resultsContainer = document.getElementById("results");
const filterSelect = document.getElementById("filter-select");
const randomDrink = document.getElementById("random-drink");

// Search Box and Filter
searchBox.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = document.getElementById("query").value;
    if (!query) {
        resultsContainer.innerHTML = "Please enter a search term.";
        return;
    }

    const filter = filterSelect.value;
    const searchUrl = `${baseUrl}search.php?s=${query}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        resultsContainer.innerHTML = "";
        const cocktails = data.drinks;
        if (!cocktails) {
            resultsContainer.innerHTML = "We don't have that for now🙃. Try searching for something else?";
            return;
        }

        const filteredCocktails = cocktails.filter(cocktail => {
            if (filter === "All") return true;
            if (filter === "Alcoholic" && cocktail.strAlcoholic === "Alcoholic") return true;
            if (filter === "Non_Alcoholic" && cocktail.strAlcoholic !== "Alcoholic") return true;
            return false;
        });

        filteredCocktails.forEach(cocktail => createCocktailElement(cocktail));
    } catch (error) {
        resultsContainer.innerHTML = `＞︿＜ An error occurred: ${error.message}`;
    }
});

// Cocktail Element
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
    
    const ingredientText = document.createElement("h5");
    ingredientText.textContent = "Ingredients";
    cocktailElement.appendChild(ingredientText);

    const ingredientsList = document.createElement("ul");
    ingredientsList.classList.add("ingredients");
    cocktailElement.appendChild(ingredientsList);

    const instructions = document.createElement("p");
    instructions.textContent = `Instructions: ${drink.strInstructions}`;
    cocktailElement.appendChild(instructions);

    for (let i = 1; i <= 50; i++) {
        const ingredient = `strIngredient${i}`;
        const measure = `strMeasure${i}`;
        if (drink[ingredient] && drink[ingredient].trim() !== "") {
            const ingredientItem = document.createElement("li");
            ingredientItem.textContent = `${drink[measure] ? drink[measure] : ""} ${drink[ingredient]}`;
            ingredientsList.appendChild(ingredientItem);
        }
    }
// Like Button
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
// Random Drink Generator
randomDrink.addEventListener("click", async () => {
    const randomUrl = `${baseUrl}random.php`;

    try {
        const response = await fetch(randomUrl);
        const data = await response.json();

        resultsContainer.innerHTML = "";
        const cocktail = data.drinks[0];
        createCocktailElement(cocktail);
    } catch (error) {
        resultsContainer.innerHTML = `＞︿＜ An error occurred: ${error.message}`;
    }
});
