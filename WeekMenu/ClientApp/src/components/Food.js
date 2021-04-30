export function MakeWeekPlan(dailycal, meals, fourthmeal) {
    let dinners = meals.filter(meal => meal.types.includes(MealTypes.dinner));
    let lunches = meals.filter(meal => meal.types.includes(MealTypes.lunch));
    let breakfasts = meals.filter(meal => meal.types.includes(MealTypes.breakfast));
    let suppers = meals.filter(meal => meal.types.includes(MealTypes.supper));

    let dinneri = 0;

    let plan = {
        mon: {
            breakfast: [],
            lunch: [],
            dinner: [],
            supper: []
        },
        tue: {
            breakfast: [],
            lunch: [],
            dinner: [],
            supper: []
        },
        wed: {
            breakfast: [],
            lunch: [],
            dinner: [],
            supper: []
        },
        thurs: {
            breakfast: [],
            lunch: [],
            dinner: [],
            supper: []
        },
        friday: {
            breakfast: [],
            lunch: [],
            dinner: [],
            supper: []
        },
        saturday: {
            breakfast: [],
            lunch: [],
            dinner: [],
            supper: []
        },
        sunday: {
            breakfast: [],
            lunch: [],
            dinner: [],
            supper: []
        },
    }

    Object.keys(plan).map((day) => {
        let daycal = dailycal;

        if (dinneri >= dinners.length) dinneri = 0;
        plan[day].dinner = dinners[dinneri];
        daycal -= GetMealCal(dinners[dinneri]);
        dinneri++;

        while (daycal > 0) {
            let breakfasti = Math.floor(Math.random() * breakfasts.length);
            plan[day].breakfast.push(breakfasts[breakfasti]);
            daycal -= GetMealCal(breakfasts[breakfasti]);
            if (daycal <= 0) break;

            let lunchi = Math.floor(Math.random() * lunches.length);
            plan[day].lunch.push(lunches[lunchi]);
            daycal -= GetMealCal(lunches[lunchi]);
            if (daycal <= 0) break;

            let supperi = Math.floor(Math.random() * suppers.length);
            plan[day].supper.push(suppers[supperi]);
            daycal -= GetMealCal(suppers[supperi]);
            if (daycal <= 0) break;
        }
    });

    return plan;
}

export function GetMealCal(meal) {
    let res = 0;
    for (let i = 0; i < meal.ingredients.length; i++) {
        if (meal.ingredients[i].food) {
            res += meal.ingredients[i].food.cal / 100 * meal.ingredients[i].amountg;
        }
        else if (meal.ingredients[i].type) {
            let foodoftype = [];
            Object.keys(Foods).map((food) => {
                if (Foods[food].type === meal.ingredients[i].type) {
                    foodoftype.push(Foods[food]);
                }
            });
            let randfood = Math.floor(Math.random() * foodoftype.length);
            meal.ingredients[i].food = foodoftype[randfood];
            res += meal.ingredients[i].food.cal / 100 * meal.ingredients[i].amountg;
        }
    }
    return res;
}

export const FoodTypes = {
    fruit: "fruit",
    fiber: "fiber",
    fibertopping: "fibertopping",
    diary: "diary",
    drink: "drink",
    meat: "meat",
    combo: "combo",
    dinnerfiber: "dinnerfiber",
    greens: "greens"
}

export const Foods = { //cal = per 100g
    //fruits
    banana: { name: "Banana", type: FoodTypes.fruit, cal: 83 },
    apple: { name: "Apple", type: FoodTypes.fruit, cal: 100 },
    orange: {
        name: "Orange", type: FoodTypes.fruit, cal: 100 },

    //fibers
    breadslice: { name: "Breadslice", type: FoodTypes.fiber, cal: 100 },
    baguette: { name: "Baguette", type: FoodTypes.fiber, cal: 100 },
    muesli: { name: "Muesli", type: FoodTypes.fiber, cal: 100 },

    //fiber toppings
    cheese: { name: "Cheese", type: FoodTypes.fibertopping, cal: 100 },
    salami: { name: "Salami", type: FoodTypes.fibertopping, cal: 100 },
    brown_cheese: { name: "Brown Cheese", type: FoodTypes.fibertopping, cal: 100 },
    strawberry_jam: { name: "Strawberry Jam", type: FoodTypes.fibertopping, cal: 100 },
    nugatti_spread: { name: "Nugatti Spread", type: FoodTypes.fibertopping, cal: 100 },

    //other
    yoghurt: { name: "Yoghurt", type: FoodTypes.diary, cal: 100 },

    //Drinks
    milk: { name: "Milk", type: FoodTypes.drink, cal: 100 },
    apple_juice: { name: "Apple Juice", type: FoodTypes.drink, cal: 100 },
    orange_juice: { name: "Orange Juice", type: FoodTypes.drink, cal: 100 },
    lemonade: { name: "Lemonade", type: FoodTypes.drink, cal: 100 },
    soda: { name: "Soda", type: FoodTypes.drink, cal: 100 },

    //Meats
    minced_meat_cattle: { name: "Minced Meat (cattle)", type: FoodTypes.meat, cal: 100 },
    minced_meat_pork: { name: "Minced Meat (pork)", type: FoodTypes.meat, cal: 100 },
    chicken: { name: "Chicken", type: FoodTypes.meat, cal: 100 },
    salmon: { name: "Salmon", type: FoodTypes.meat, cal: 100 },
    trout: { name: "Trout", type: FoodTypes.meat, cal: 100 },
    cod: { name: "Cod", type: FoodTypes.meat, cal: 100 },
    sausage: { name: "Sausage", type: FoodTypes.meat, cal: 100 },

    //Combo dinners
    fish_gratin: { name: "Fish Gratin", type: FoodTypes.combo, cal: 100 },

    //dinner fiber/carbs
    pasta: { name: "Pasta", type: FoodTypes.dinnerfiber, cal: 100 },
    potato: { name: "Potato", type: FoodTypes.dinnerfiber, cal: 100 },
    rice: { name: "Rice", type: FoodTypes.dinnerfiber, cal: 100 },
    tortilla: { name: "Tortilla", type: FoodTypes.dinnerfiber, cal: 100 },

    //greens/veggies
    carrot: { name: "Carrot", type: FoodTypes.greens, cal: 100 },
    brokkoli: { name: "Brokkoli", type: FoodTypes.greens, cal: 100 },
    peas: { name: "Peas", type: FoodTypes.greens, cal: 100 },
    aspergus: { name: "Aspergus", type: FoodTypes.greens, cal: 100 },
    aspergus_beans: { name: "(Aspergus) Beans", type: FoodTypes.greens, cal: 100 },
    cucumber: { name: "Cucumber", type: FoodTypes.greens, cal: 100 },
    corn: { name: "Corn", type: FoodTypes.greens, cal: 100 },
};

export const MealTypes = {
    breakfast: "breakfast",
    lunch: "lunch",
    dinner: "dinner",
    supper: "supper"
}

export const Meals = [
    {
        name: "Muesli and Yoghurt", types: [MealTypes.breakfast, MealTypes.lunch, MealTypes.supper], ingredients: [
            { food: Foods.muesli, amountg: 100 },
            { food: Foods.yoghurt, amountg: 100 }]
    },
    {
        name: "Breadslice with toppings", types: [MealTypes.breakfast, MealTypes.lunch, MealTypes.supper], ingredients: [
            { food: Foods.breadslice, amountg: 100 },
            { food: null, amountg: 100, type: FoodTypes.fibertopping }]
    },
    {
        name: "Baguette with toppings", types: [MealTypes.breakfast, MealTypes.lunch, MealTypes.supper], ingredients: [
            { food: Foods.baguette, amountg: 100 },
            { food: null, amountg: 100, type: FoodTypes.fibertopping}]
    },
    {
        name: "Taco", types: [MealTypes.dinner], ingredients: [
            { food: Foods.cheese, amountg: 100 },
            { food: Foods.tortilla, amountg: 100 },
            { food: Foods.minced_meat_cattle, amountg: 100 },
            { food: Foods.cucumber, amountg: 100 },
            { food: Foods.corn, amountg: 100 },]
    },
]