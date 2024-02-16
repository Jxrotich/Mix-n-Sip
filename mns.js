// Consts
const baseUrl = "https://www.thecocktaildb.com/api/json/v1/1/";

const searchBox = document.getElementById("search-box");
const resultsContainer = document.getElementById("results");
const filterSelect = document.getElementById("filter-select");

// Search Box and Filter
searchBox.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = document.getElementById("query").value;
    if (!query) return;

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
        console.error(error);
    }
});

// Search Options
searchBox.addEventListener("input", handleInput);

async function handleInput(event) {
    const query = event.target.value;
    if (!query) return;

    const searchUrl = `${baseUrl}search.php?s=${query}`;

    try {
        const data = await fetchData(searchUrl);
        updateResults(data.drinks);
    } catch (error) {
        console.error(error);
    }
}

async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
}

function updateResults(cocktails) {
    resultsContainer.innerHTML = "";

    if (!cocktails) {
        resultsContainer.innerHTML = "Doesn't exist at the moment.";
        return;
    }
    cocktails.forEach(createResultItem);
}

function createResultItem(cocktail) {
    const resultItem = document.createElement("p");
    resultItem.textContent = cocktail.strDrink;
    resultsContainer.appendChild(resultItem);
}

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
