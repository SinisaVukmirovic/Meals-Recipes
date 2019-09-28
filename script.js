const form = document.querySelector('form');
const selectedCategory = document.querySelector('select');
const containerElem = document.querySelector('.container');
const mealsElem = document.querySelector('.meals');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    getMeals()
    .then(result => {
        console.log(result.meals);

        displayMealData(result.meals);
    })
    .catch(err => {
        console.log(err);
    });
});

async function getMeals() {
    let apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory.value}`;

    let response = await fetch(apiUrl);
    let data = await response.json();

    return data;
}

function displayMealData(meals) {
    
    containerElem.innerHTML = `<h3 class="category">Meals from ${selectedCategory.value} category:</h3>`;

    let output = ``;

    meals.forEach(meal => {
        output += `
            <div class="meal">
                <img src="${meal.strMealThumb}" />
                <div class="name">
                    <h3>${meal.strMeal}</h3>                
                </div>
                <a onclick="selectedMeal('${meal.idMeal}')" href="#">Get Recipe</a>
            </div>
        `;
    });

    mealsElem.innerHTML = output;

    containerElem.append(mealsElem);
}

function selectedMeal(id) {
    sessionStorage.setItem('recipeId', id);

    window.location = 'recipe.html';
    
    return false;
}

function getRecipe() {
    getMealById()
    .then(result => {
        let recipe = result.meals[0];

        const ingredients = [];

        for (let i = 1; i <= 20; i++) {
            if (recipe[`strIngredient${i}`]) {
                ingredients.push(`${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`);
            }
            else {
                break;
            }
        }

        let mealRecipe = `
            <div class="recipe">
                <div class="pic-info">
                    <div class="img">
                        <img src="${recipe.strMealThumb}" alt="Meal Image">
                    </div>

                    <div class="info">
                        <h2>${recipe.strMeal}</h2>
                    
                        ${recipe.strCategory
                            ? `<p><strong>Category:</strong> ${recipe.strCategory}</p>`
                            : ''
                        }
                        
                        ${recipe.strArea 
                            ? `<p><strong>Area:</strong> ${recipe.strArea}</p>` 
                            : ''
                        }

                        <h4>Ingredients:</h4>

                        <ul>
                            ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <h5>${recipe.strInstructions}</h5>
            </div>
        `;

        containerElem.innerHTML = mealRecipe;
    })
    .catch(err => {
        console.log(err);
    });
}

async function getMealById() {
    let recipeId = sessionStorage.getItem('recipeId');

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`;

    let response = await fetch(apiUrl);
    let data = await response.json();
    
    return data;
}