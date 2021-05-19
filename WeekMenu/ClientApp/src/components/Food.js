import { Random } from './Randomizer';

export function Clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function GetWeekPlanObject() {
    return {
        monday: {
            breakfast: [],
            lunch: [],
            dinner: [],
            supper: []
        },
        tuesday: {
            breakfast: [],
            lunch: [],
            dinner: [],
            supper: []
        },
        wednesday: {
            breakfast: [],
            lunch: [],
            dinner: [],
            supper: []
        },
        thursday: {
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
    };
}

export function FillWeekPlan(plan, dailycal, selmeals, fourthmeal, ingredients) {
    let dinners = selmeals.filter(meal => meal.types.includes(MealTypes.dinner));
    let lunches = selmeals.filter(meal => meal.types.includes(MealTypes.lunch));
    let breakfasts = selmeals.filter(meal => meal.types.includes(MealTypes.breakfast));
    let suppers = selmeals.filter(meal => meal.types.includes(MealTypes.supper));

    let tolerance = 100; //cal
    let dinneri = 0;

    Object.keys(plan).map((day) => {
        SetDayCal(plan[day]);
    });

    Object.keys(plan).map((day) => {
        let daycal = dailycal - plan[day].cal;

        let randomizer = Random(day + diversifier);
        diversifier++;

        if (plan[day].dinner.length <= 0) {
            dinneri = Math.floor(randomizer() * dinners.length);
            let dinner = Clone(dinners[dinneri]);
            let dinnerCal = GetMealCal(dinner, ingredients);
            dinner["cal"] = dinnerCal;
            plan[day].dinner.push(dinner);
            plan[day].dinner["cal"] = dinnerCal;
            daycal -= dinnerCal;
        }

        if (!plan[day].breakfast.cal) plan[day].breakfast["cal"] = 0;
        if (!plan[day].lunch.cal) plan[day].lunch["cal"] = 0;
        if (!plan[day].supper.cal) plan[day].supper["cal"] = 0;

        while (daycal > 0) {
            //breakfast
            let breakfasti = Math.floor(randomizer() * breakfasts.length);
            let breakfast = Clone(breakfasts[breakfasti]);
            let breakfastCal = GetMealCal(breakfast, ingredients);
            daycal -= breakfastCal;
            if (daycal > -tolerance && daycal < tolerance) {
                breakfast["cal"] = breakfastCal;
                plan[day].breakfast.push(breakfast);
                plan[day].breakfast.cal += breakfastCal;
                break;
            }
            else if (daycal < -tolerance) {
                daycal += breakfastCal;
                break;
            }

            breakfast["cal"] = breakfastCal;
            plan[day].breakfast.push(breakfast);
            plan[day].breakfast.cal += breakfastCal;

            //lunch
            let lunchi = Math.floor(randomizer() * lunches.length);
            let lunch = Clone(lunches[lunchi]);
            let lunchCal = GetMealCal(lunch, ingredients);
            daycal -= lunchCal;
            if (daycal > -tolerance && daycal < tolerance) {
                lunch["cal"] = lunchCal;
                plan[day].lunch.push(lunch);
                plan[day].lunch.cal += lunchCal;
                break;
            }
            else if (daycal < -tolerance) {
                daycal += lunchCal;
                break;
            }

            lunch["cal"] = lunchCal;
            plan[day].lunch.push(lunch);
            plan[day].lunch.cal += lunchCal;

            //supper
            if (!fourthmeal) continue;
            let supperi = Math.floor(randomizer() * suppers.length);
            let supper = Clone(suppers[supperi]);
            let supperCal = GetMealCal(supper, ingredients);
            daycal -= supperCal;
            if (daycal > -tolerance && daycal < tolerance) {
                supper["cal"] = supperCal;
                plan[day].supper.push(supper);
                plan[day].supper.cal += supperCal;
                break;
            }
            else if (daycal < -tolerance) {
                daycal += supperCal;
                break;
            }

            supper["cal"] = supperCal;
            plan[day].supper.push(supper);
            plan[day].supper.cal += supperCal;
        }

        plan[day]["cal"] = dailycal - daycal;
        return 0;
    });

    return plan;
}

export function MakeWeekPlan(dailycal, selmeals, fourthmeal, ingredients, percentdinner) {
    let dinners = selmeals.filter(meal => meal.types.includes(MealTypes.dinner));
    let lunches = selmeals.filter(meal => meal.types.includes(MealTypes.lunch));
    let breakfasts = selmeals.filter(meal => meal.types.includes(MealTypes.breakfast));
    let suppers = selmeals.filter(meal => meal.types.includes(MealTypes.supper));

    let plan = GetWeekPlanObject();

    let tolerance = 100; //cal
    let dinneri = 0;
    let alreadyTakenDinners = [];

    Object.keys(plan).map((day) => {
        let daycal = dailycal;

        let randomizer = Random(day + diversifier);
        diversifier++;

        if (alreadyTakenDinners.length >= dinners.length) alreadyTakenDinners = [];

        dinneri = Math.floor(randomizer() * dinners.length);
        while (alreadyTakenDinners.includes(dinneri)) {
            dinneri = Math.floor(randomizer() * dinners.length);
        }
        alreadyTakenDinners.push(dinneri);

        let dinner = Clone(dinners[dinneri]);
        let dinnerCal = 0;

        if (percentdinner) {
            let tempdinnercal = dailycal * percentdinner/100;
            dinnerCal = GetMealCal(dinner, ingredients, tempdinnercal);

        }
        else {
            dinnerCal = GetMealCal(dinner, ingredients);
        }

        dinner["cal"] = dinnerCal;
        plan[day].dinner.push(dinner);
        plan[day].dinner["cal"] = dinnerCal;
        daycal -= dinnerCal;

        plan[day].breakfast["cal"] = 0;
        plan[day].lunch["cal"] = 0;
        plan[day].supper["cal"] = 0;

        while (daycal > 0) {
            //breakfast
            let breakfasti = Math.floor(randomizer() * breakfasts.length);
            let breakfast = Clone(breakfasts[breakfasti]);
            let breakfastCal = GetMealCal(breakfast, ingredients);
            daycal -= breakfastCal;
            if (daycal > -tolerance && daycal < tolerance) {
                breakfast["cal"] = breakfastCal;
                plan[day].breakfast.push(breakfast);
                plan[day].breakfast.cal += breakfastCal;
                break;
            }
            else if (daycal < -tolerance) {
                daycal += breakfastCal;
                break;
            }

            breakfast["cal"] = breakfastCal;
            plan[day].breakfast.push(breakfast);
            plan[day].breakfast.cal += breakfastCal;

            //lunch
            let lunchi = Math.floor(randomizer() * lunches.length);
            let lunch = Clone(lunches[lunchi]);
            let lunchCal = GetMealCal(lunch, ingredients);
            daycal -= lunchCal;
            if (daycal > -tolerance && daycal < tolerance) {
                lunch["cal"] = lunchCal;
                plan[day].lunch.push(lunch);
                plan[day].lunch.cal += lunchCal;
                break;
            }
            else if (daycal < -tolerance) {
                daycal += lunchCal;
                break;
            }

            lunch["cal"] = lunchCal;
            plan[day].lunch.push(lunch);
            plan[day].lunch.cal += lunchCal;

            //supper
            if (!fourthmeal) continue;
            let supperi = Math.floor(randomizer() * suppers.length);
            let supper = Clone(suppers[supperi]);
            let supperCal = GetMealCal(supper, ingredients);
            daycal -= supperCal;
            if (daycal > -tolerance && daycal < tolerance) {
                supper["cal"] = supperCal;
                plan[day].supper.push(supper);
                plan[day].supper.cal += supperCal;
                break;
            }
            else if (daycal < -tolerance) {
                daycal += supperCal;
                break;
            }

            supper["cal"] = supperCal;
            plan[day].supper.push(supper);
            plan[day].supper.cal += supperCal;
        }

        plan[day]["cal"] = dailycal - daycal;
        return 0;
    });

    return plan;
}

var diversifier = 0;

export function GetMealCal(meal, ingredients, percentdinnercal = null) {
    let res = 0;

    //Set food that's just typed (random)
    let randomizer = Random(meal.name + diversifier);
    diversifier++;
    for (let i = 0; i < meal.ingredients.length; i++) {
        if (meal.ingredients[i].type) {
            let foodoftype = [];
            Object.keys(ingredients).map((food) => {
                if (ingredients[food].type === meal.ingredients[i].type) {
                    foodoftype.push(ingredients[food]);
                }
                return 0;
            });
            let randfood = Math.floor(randomizer() * foodoftype.length);
            meal.ingredients[i].food = foodoftype[randfood];

        }
    }

    //set percentdinnerrate (if applicable)
    if (percentdinnercal) SetCalRate(meal); //set rate based on default amountg

    for (let i = 0; i < meal.ingredients.length; i++) {
        if (percentdinnercal) {
            let ingredCal = meal.ingredients[i].rate * percentdinnercal;
            res += ingredCal;
            meal.ingredients[i].amountg = Math.round((ingredCal) * 100 / meal.ingredients[i].food.cal);
        }
        else {
            res += meal.ingredients[i].food.cal / 100 * meal.ingredients[i].amountg;
        }
    }
    return res;
}

function SetCalRate(meal) {
    let sumcal = 0;
    for (let i = 0; i < meal.ingredients.length; i++) {
        let mycal = meal.ingredients[i].food.cal / 100 * meal.ingredients[i].amountg;
        sumcal += mycal;
    }
    for (let i = 0; i < meal.ingredients.length; i++) {
        let mycal = meal.ingredients[i].food.cal / 100 * meal.ingredients[i].amountg;
        meal.ingredients[i]["rate"] = mycal / sumcal;

    }
}

export const Days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export function SetDayCal(day) {
    let res = 0;
    Object.keys(MealTypes).map((meal, m) => {
        let mealres = 0;
        if (day[meal]) {
            for (let j = 0; j < day[meal].length; j++) {
                let food = day[meal][j];
                mealres += food.cal;
            }
            day[meal].cal = mealres;
        }
        res += mealres;
    });
    day.cal = res;
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
    greens: "greens",
    sauce: "sauce",
    baked: "baked",

    oil: "oil",
    broth: "broth",

    sweet_fibertopping: "sweet fibertopping",
    sweet_drink: "sweet drink",
    candy: "sweet",
    alcohol: "alcohol",

    other: "other",
    taco: "taco",
    pizza: "pizza"
}

export const Foods = { //cal (kcal) = per 100g
    //fruits
    banana: { name: "Banana", type: FoodTypes.fruit, cal: 83 },
    apple: { name: "Apple", type: FoodTypes.fruit, cal: 50 },
    orange: { name: "Orange", type: FoodTypes.fruit, cal: 37 },

    //fibers
    breadslice: { name: "Breadslice", type: FoodTypes.fiber, cal: 240 },
    baguette: { name: "Baguette", type: FoodTypes.fiber, cal: 260 },
    muesli: { name: "Muesli", type: FoodTypes.fiber, cal: 376 },

    //fiber toppings
    cheese: { name: "Cheese", type: FoodTypes.fibertopping, cal: 350 },
    salami: { name: "Salami", type: FoodTypes.fibertopping, cal: 420 },
    brown_cheese: { name: "Brown Cheese", type: FoodTypes.fibertopping, cal: 440 },
    strawberry_jam: { name: "Strawberry Jam", type: FoodTypes.fibertopping, cal: 130 },
    nugatti_spread: { name: "Nugatti Spread", type: FoodTypes.sweet_fibertopping, cal: 525 },

    //diary
    yoghurt: { name: "Yoghurt", type: FoodTypes.diary, cal: 70 },
    butter: { name: "Butter", type: FoodTypes.diary, cal: 742 },

    //other
    wok_greens: { name: "Wok Greens", type: FoodTypes.other, cal: 33 },
    broth: { name: "Broth", type: FoodTypes.broth, cal: 3 },

    //sauces
    tandoori_sauce: { name: "Tandoori Sauce", type: FoodTypes.sauce, cal: 112 },
    wok_sauce_teriyaki: { name: "Wok Sauce Teriyaki", type: FoodTypes.sauce, cal: 97 },
    bolognese_sauce: { name: "Bolognese Sauce", type: FoodTypes.sauce, cal: 44 },
    ketchup: { name: "Ketchup", type: FoodTypes.sauce, cal: 36 },
    hot_dog_sauce: { name: "Hot Dog Sauce", type: FoodTypes.sauce, cal: 245 },
    pesto: { name: "Pesto", type: FoodTypes.sauce, cal: 441 },
    soy_sauce: { name: "Soy Sauce", type: FoodTypes.sauce, cal: 84 },
    curry_roux: { name: "Curry Roux", type: FoodTypes.sauce, cal: 476 },
    honey: { name: "Honey", type: FoodTypes.sauce, cal: 317 },

    //Bakes
    spring_roll_wrapper: { name: "Spring Roll Wrappers", type: FoodTypes.baked, cal: 285 },
    naan: { name: "Naan Bread", type: FoodTypes.baked, cal: 285 },
    bun: { name: "Bun", type: FoodTypes.baked, cal: 330 },
    sausage_bread: { name: "Sausage Bread", type: FoodTypes.baked, cal: 300 },
    waffle: { name: "Waffle", type: FoodTypes.baked, cal: 215 },

    //Drinks
    milk: { name: "Milk", type: FoodTypes.drink, cal: 41 },
    apple_juice: { name: "Apple Juice", type: FoodTypes.drink, cal: 42 },
    orange_juice: { name: "Orange Juice", type: FoodTypes.drink, cal: 43 },
    lemonade: { name: "Lemonade", type: FoodTypes.sweet_drink, cal: 43 },
    soda: { name: "Soda", type: FoodTypes.sweet_drink, cal: 42 },
    iced_coffee: { name: "Iced Coffee", type: FoodTypes.sweet_drink, cal: 58 },
    hot_chocolate: { name: "Hot Chocolate", type: FoodTypes.sweet_drink, cal: 77 },
    wine: { name: "Wine", type: FoodTypes.alcohol, cal: 70 },
    beer: { name: "Beer", type: FoodTypes.alcohol, cal: 40 },

    //Meats
    minced_meat_cattle: { name: "Minced Meat Cattle", type: FoodTypes.meat, cal: 288 },
    minced_meat_pork: { name: "Minced Meat Pork", type: FoodTypes.meat, cal: 144 },
    chicken: { name: "Chicken", type: FoodTypes.meat, cal: 155 },
    salmon: { name: "Salmon", type: FoodTypes.meat, cal: 250 },
    trout: { name: "Trout", type: FoodTypes.meat, cal: 200 },
    cod: { name: "Cod", type: FoodTypes.meat, cal: 120 },
    sausage: { name: "Sausage", type: FoodTypes.meat, cal: 200 },
    meat_balls: { name: "Meat Balls", type: FoodTypes.meat, cal: 206 },
    tenderloin_pork: { name: "Tenderloin Pork", type: FoodTypes.meat, cal: 116 },
    tenderloin_cattle: { name: "Tenderloin Cattle", type: FoodTypes.meat, cal: 109 },
    bacon: { name: "Bacon", type: FoodTypes.meat, cal: 301 },

    //Combo dinners/finished
    fish_gratin: { name: "Fish Gratin", type: FoodTypes.combo, cal: 135 },
    fish_sticks: { name: "Fish Sticks", type: FoodTypes.combo, cal: 180 },

    //dinner fiber/carbs
    pasta: { name: "Pasta", type: FoodTypes.dinnerfiber, cal: 120 },
    potato: { name: "Potato", type: FoodTypes.dinnerfiber, cal: 75 },
    rice: { name: "Rice", type: FoodTypes.dinnerfiber, cal: 124 },

    //taco
    tortilla: { name: "Tortilla", type: FoodTypes.taco, cal: 255 },

    //pizza
    pizza_dough: { name: "Pizza Dough", type: FoodTypes.pizza, cal: 267 },
    pepperoni: { name: "Pepperoni", type: FoodTypes.pizza, cal: 372 },
    pizza_sauce: { name: "Pizza Sauce", type: FoodTypes.pizza, cal: 54 },

    //greens/veggies
    carrot: { name: "Carrot", type: FoodTypes.greens, cal: 36 },
    brokkoli: { name: "Brokkoli", type: FoodTypes.greens, cal: 30 },
    peas: { name: "Peas", type: FoodTypes.greens, cal: 60 },
    aspergus: { name: "Aspergus", type: FoodTypes.greens, cal: 22 },
    asparagus_beans: { name: "Asparagus Beans", type: FoodTypes.greens, cal: 27 },
    cucumber: { name: "Cucumber", type: FoodTypes.greens, cal: 10 },
    corn: { name: "Corn", type: FoodTypes.greens, cal: 85 },
    onion: { name: "Onion", type: FoodTypes.greens, cal: 32 },
    garlic: { name: "Garlic", type: FoodTypes.greens, cal: 106 },
    cabbage: { name: "Cabbage", type: FoodTypes.greens, cal: 32 },
    tomato: { name: "Tomato", type: FoodTypes.greens, cal: 20 },
    paprika: { name: "Paprika", type: FoodTypes.greens, cal: 20 },
    brown_beans: { name: "Brown Beans", type: FoodTypes.greens, cal: 125 },
    coconut_milk: { name: "Coconut Milk", type: FoodTypes.greens, cal: 209 },
    sweet_peas: { name: "Sweet Peas", type: FoodTypes.greens, cal: 42 },
    water_chestnut: { name: "Water Chestnut", type: FoodTypes.greens, cal: 38 },

    //oils
    rapeseed_oil: { name: "Rapeseed Oil", type: FoodTypes.oil, cal: 892 },

    //Sweets
    milk_chocolate: { name: "Milk Chocolate", type: FoodTypes.candy, cal: 541 },
    potato_chips: { name: "Potato Chips", type: FoodTypes.candy, cal: 500 },
    ice_cream: { name: "Ice Cream", type: FoodTypes.candy, cal: 250 },
    brownies: { name: "Brownies", type: FoodTypes.candy, cal: 420 },
    unsorted_candy: { name: "Unsorted Candy", type: FoodTypes.candy, cal: 370 },
    chocolate_chip_cookies: { name: "Chocolate Chip Cookies", type: FoodTypes.candy, cal: 420 },
    hvite_sugar: { name: "Hvite Sugar", type: FoodTypes.candy, cal: 400 },
    brown_sugar: { name: "Brown Sugar", type: FoodTypes.candy, cal: 376 },
};

export const MealTypes = {
    breakfast: "breakfast",
    lunch: "lunch",
    dinner: "dinner",
    supper: "supper",
    dessert: "dessert"
}

export const Meals = [
    {
        name: "Drink", types: [MealTypes.breakfast, MealTypes.lunch, MealTypes.supper], ingredients: [
            { food: null, amountg: 200, type: FoodTypes.drink }]
    },
    {
        name: "Fruit", types: [MealTypes.lunch, MealTypes.supper], ingredients: [
            { food: null, amountg: 125, type: FoodTypes.fruit },]
    },
    {
        name: "Muesli and Yoghurt", types: [MealTypes.breakfast, MealTypes.lunch, MealTypes.supper], ingredients: [
            { food: Foods.muesli, amountg: 90 },
            { food: Foods.yoghurt, amountg: 120 }]
    },
    {
        name: "Breadslice with topping", types: [MealTypes.breakfast, MealTypes.lunch, MealTypes.supper], ingredients: [
            { food: Foods.breadslice, amountg: 35 },
            { food: null, amountg: 20, type: FoodTypes.fibertopping }]
    },
    {
        name: "Baguette with topping", types: [MealTypes.breakfast, MealTypes.lunch, MealTypes.supper], ingredients: [
            { food: Foods.baguette, amountg: 75 },
            { food: null, amountg: 50, type: FoodTypes.fibertopping}]
    },
    {
        name: "Taco", types: [MealTypes.dinner], ingredients: [
            { food: Foods.cheese, amountg: 30, rate: 0.27 },
            { food: Foods.tortilla, amountg: 126, rate: 0.81 },
            { food: Foods.minced_meat_cattle, amountg: 150, rate: 1.09 },
            { food: Foods.cucumber, amountg: 60, rate: 0.02 },
            { food: Foods.rapeseed_oil, amountg: 10 },
            { food: Foods.corn, amountg: 30, rate: 0.06 },]
    },
    {
        name: "Lasagna", types: [MealTypes.dinner], ingredients: [
            { food: Foods.cheese, amountg: 60, rate: 0.4 },
            { food: Foods.pasta, amountg: 90, rate: 0.21 },
            { food: Foods.minced_meat_cattle, amountg: 150, rate: 0.82 },
            { food: Foods.rapeseed_oil, amountg: 10 },
            { food: Foods.milk, amountg: 225, rate: 0.18 },]
    },
    {
        name: "Salmon and veggies", types: [MealTypes.dinner], ingredients: [
            { food: Foods.salmon, amountg: 187, rate: 0.69 },
            { food: Foods.potato, amountg: 150, rate: 0.17 },
            { food: Foods.carrot, amountg: 112, rate: 0.06 },
            { food: Foods.rapeseed_oil, amountg: 10 },
            { food: Foods.butter, amountg: 10 },
            { food: null, amountg: 225, type: FoodTypes.greens, rate: 0.10 },]
    },
    {
        name: "Spring rolls", types: [MealTypes.dinner], ingredients: [
            { food: Foods.onion, amountg: 128 },
            { food: Foods.cabbage, amountg: 136 },
            { food: Foods.minced_meat_pork, amountg: 270 },
            { food: Foods.spring_roll_wrapper, amountg: 80 },
            { food: Foods.rapeseed_oil, amountg: 10 },
            { food: Foods.carrot, amountg: 60 },]
    },
    {
        name: "Mexican Pot", types: [MealTypes.dinner], ingredients: [
            { food: Foods.rice, amountg: 60 },
            { food: Foods.tomato, amountg: 15 },
            { food: Foods.onion, amountg: 14 },
            { food: Foods.paprika, amountg: 8 },
            { food: Foods.brown_beans, amountg: 12 },
            { food: Foods.rapeseed_oil, amountg: 10 },
            { food: Foods.minced_meat_cattle, amountg: 200 },]
    },
    {
        name: "Chicken and veggies", types: [MealTypes.dinner], ingredients: [
            { food: Foods.chicken, amountg: 125 },
            { food: Foods.rapeseed_oil, amountg: 10 },
            { food: null, amountg: 100, type: FoodTypes.dinnerfiber },
            { food: null, amountg: 150, type: FoodTypes.greens },]
    },
    {
        name: "Tandoori", types: [MealTypes.dinner], ingredients: [
            { food: Foods.chicken, amountg: 125 },
            { food: Foods.tandoori_sauce, amountg: 180 },
            { food: Foods.rice, amountg: 80 },
            { food: Foods.rapeseed_oil, amountg: 10 },
            { food: Foods.naan, amountg: 130 },]
    },
    {
        name: "Wok", types: [MealTypes.dinner], ingredients: [
            { food: Foods.chicken, amountg: 125 },
            { food: Foods.wok_greens, amountg: 200 },
            { food: Foods.rice, amountg: 80 },
            { food: Foods.rapeseed_oil, amountg: 20 },
            { food: Foods.wok_sauce_teriyaki, amountg: 60 },]
    },
    {
        name: "Fish Gratin", types: [MealTypes.dinner], ingredients: [
            { food: Foods.fish_gratin, amountg: 250 },
            { food: Foods.butter, amountg: 10 },
            { food: Foods.potato, amountg: 100 },
            { food: Foods.carrot, amountg: 75 },]
    },
    {
        name: "Fish Sticks", types: [MealTypes.dinner], ingredients: [
            { food: Foods.fish_sticks, amountg: 200 },
            { food: Foods.butter, amountg: 10 },
            { food: Foods.potato, amountg: 125 },
            { food: Foods.carrot, amountg: 100 },]
    },
    {
        name: "Sausages", types: [MealTypes.dinner], ingredients: [
            { food: Foods.sausage, amountg: 180 },
            { food: Foods.ketchup, amountg: 10 },
            { food: Foods.hot_dog_sauce, amountg: 10 },
            { food: Foods.sausage_bread, amountg: 90 },]
    },
    {
        name: "Pasta Bolognese", types: [MealTypes.dinner], ingredients: [
            { food: Foods.meat_balls, amountg: 135 },
            { food: Foods.pasta, amountg: 90 },
            { food: Foods.rapeseed_oil, amountg: 10 },
            { food: Foods.bolognese_sauce, amountg: 125 },]
    },
    {
        name: "Pork Tenderloin and Potato Mash", types: [MealTypes.dinner], ingredients: [
            { food: Foods.tenderloin_pork, amountg: 300 },
            { food: Foods.bacon, amountg: 70 },
            { food: Foods.potato, amountg: 170 },
            { food: Foods.milk, amountg: 50 },
            { food: Foods.rapeseed_oil, amountg: 10 },
            { food: Foods.butter, amountg: 25 },]
    },
    {
        name: "Paprika Pesto", types: [MealTypes.dinner], ingredients: [
            { food: Foods.paprika, amountg: 220 },
            { food: Foods.pasta, amountg: 100 },
            { food: Foods.milk, amountg: 50 },
            { food: Foods.pesto, amountg: 100 },]
    },
    {
        name: "Pizza", types: [MealTypes.dinner], ingredients: [
            { food: Foods.pizza_dough, amountg: 275 },
            { food: Foods.pizza_sauce, amountg: 75 },
            { food: Foods.pepperoni, amountg: 35 },
            { food: Foods.cheese, amountg: 100 },
            { food: Foods.paprika, amountg: 75 },]
    },
    {
        name: "Thai Chicken Stew", types: [MealTypes.dinner], ingredients: [
            { food: Foods.chicken, amountg: 200 },
            { food: Foods.rice, amountg: 100 },
            { food: Foods.onion, amountg: 80 },
            { food: Foods.garlic, amountg: 5 },
            { food: Foods.carrot, amountg: 80 },
            { food: Foods.rapeseed_oil, amountg: 10 },
            { food: Foods.broth, amountg: 250 },
            { food: Foods.coconut_milk, amountg: 200 },
            { food: Foods.sweet_peas, amountg: 75 },
            { food: Foods.water_chestnut, amountg: 100 },]
    },
    {
        name: "Curry", types: [MealTypes.dinner], ingredients: [
            { food: Foods.tenderloin_cattle, amountg: 200 },
            { food: Foods.rice, amountg: 100 },
            { food: Foods.onion, amountg: 160 },
            { food: Foods.potato, amountg: 130 },
            { food: Foods.carrot, amountg: 80 },
            { food: Foods.rapeseed_oil, amountg: 10 },
            { food: Foods.broth, amountg: 500 },
            { food: Foods.soy_sauce, amountg: 13 },
            { food: Foods.honey, amountg: 22 },
            { food: Foods.curry_roux, amountg: 40 },]
    },
    {
        name: "Bun", types: [MealTypes.dessert], ingredients: [
            { food: Foods.bun, amountg: 50 },]
    },
    {
        name: "Brownies (2 pieces)", types: [MealTypes.dessert], ingredients: [
            { food: Foods.brownies, amountg: 120 },]
    },
    {
        name: "Unsorted Candy (100g)", types: [MealTypes.dessert], ingredients: [
            { food: Foods.unsorted_candy, amountg: 100 },]
    },
    {
        name: "Potato Chips (100g)", types: [MealTypes.dessert], ingredients: [
            { food: Foods.potato_chips, amountg: 100 },]
    },
    {
        name: "Milk Chocolate (100g)", types: [MealTypes.dessert], ingredients: [
            { food: Foods.milk_chocolate, amountg: 100 },]
    },
    {
        name: "Ice Cream (5dl)", types: [MealTypes.dessert], ingredients: [
            { food: Foods.ice_cream, amountg: 300 },]
    },
    {
        name: "Waffle (2 pieces)", types: [MealTypes.dessert], ingredients: [
            { food: Foods.waffle, amountg: 200 },
            { food: Foods.butter, amountg: 20 },
            { food: Foods.hvite_sugar, amountg: 20 },]
    },
]

//https://www.kostholdsplanleggeren.no/displayfoods/?profileId=2&slotNumber=0
//https://www.matvaretabellen.no/
//https://www.matoppskrift.no/sider/omformer.asp?ID=ss