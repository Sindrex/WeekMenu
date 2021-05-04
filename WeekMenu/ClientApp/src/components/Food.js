import { Random } from './Randomizer';

export function MakeWeekPlan(dailycal, meals, fourthmeal) {
    let dinners = meals.filter(meal => meal.types.includes(MealTypes.dinner));
    let lunches = meals.filter(meal => meal.types.includes(MealTypes.lunch));
    let breakfasts = meals.filter(meal => meal.types.includes(MealTypes.breakfast));
    let suppers = meals.filter(meal => meal.types.includes(MealTypes.supper));

    let plan = {
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
    }

    let tolerance = 100; //cal
    let dinneri = 0;

    Object.keys(plan).map((day) => {
        let daycal = dailycal;

        if (dinneri >= dinners.length) dinneri = 0;
        let dinner = JSON.parse(JSON.stringify(dinners[dinneri]));
        let dinnerCal = GetMealCal(dinner);
        dinner["cal"] = dinnerCal;
        plan[day].dinner.push(dinner);
        plan[day].dinner["cal"] = dinnerCal;
        daycal -= dinnerCal;
        dinneri++;

        plan[day].breakfast["cal"] = 0;
        plan[day].lunch["cal"] = 0;
        plan[day].supper["cal"] = 0;

        while (daycal > 0) {
            //breakfast
            let breakfasti = Math.floor(Math.random() * breakfasts.length);
            let breakfast = JSON.parse(JSON.stringify(breakfasts[breakfasti]));
            let breakfastCal = GetMealCal(breakfast);
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
            let lunchi = Math.floor(Math.random() * lunches.length);
            let lunch = JSON.parse(JSON.stringify(lunches[lunchi]));
            let lunchCal = GetMealCal(lunch);
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
            let supperi = Math.floor(Math.random() * suppers.length);
            let supper = JSON.parse(JSON.stringify(suppers[supperi]));
            let supperCal = GetMealCal(supper);
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

export function GetMealCal(meal) {
    let res = 0;
    let randomizer = Random(meal.name + diversifier);
    diversifier++;
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
                return 0;
            });
            let randfood = Math.floor(randomizer() * foodoftype.length);
            //let randfood = Math.floor(Math.random() * foodoftype.length);
            meal.ingredients[i].food = foodoftype[randfood];
            res += meal.ingredients[i].food.cal / 100 * meal.ingredients[i].amountg;
        }
    }
    return res;
}

export const Days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export function SetDayCal(day) {
    let res = 0;
    Object.keys(MealTypes).map((meal, m) => {
        let mealres = 0;
        for (let j = 0; j < day[meal].length; j++) {
            let food = day[meal][j];
            mealres += food.cal;
        }
        day[meal].cal = mealres;
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
    greens: "greens"
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
    nugatti_spread: { name: "Nugatti Spread", type: FoodTypes.fibertopping, cal: 525 },

    //other
    yoghurt: { name: "Yoghurt", type: FoodTypes.diary, cal: 70 },
    tandoori_sauce: { name: "Tandoori Sauce", type: FoodTypes.sauce, cal: 112 },
    wok_greens: { name: "Wok Greens", type: FoodTypes.greens_mix, cal: 33 },
    wok_sauce_teriyaki: { name: "Wok Sauce Teriyaki", type: FoodTypes.sauce, cal: 97 },

    //Bakes
    spring_roll_wrapper: { name: "Spring Roll Wrappers", type: FoodTypes.baked, cal: 285 },
    naan: { name: "Naan Bread", type: FoodTypes.baked, cal: 285 },

    //Drinks
    milk: { name: "Milk", type: FoodTypes.drink, cal: 41 },
    apple_juice: { name: "Apple Juice", type: FoodTypes.drink, cal: 42 },
    orange_juice: { name: "Orange Juice", type: FoodTypes.drink, cal: 43 },
    lemonade: { name: "Lemonade", type: FoodTypes.drink, cal: 43 },
    soda: { name: "Soda", type: FoodTypes.drink, cal: 180 },

    //Meats
    minced_meat_cattle: { name: "Minced Meat (cattle)", type: FoodTypes.meat, cal: 288 },
    minced_meat_pork: { name: "Minced Meat (pork)", type: FoodTypes.meat, cal: 144 },
    chicken: { name: "Chicken", type: FoodTypes.meat, cal: 155 },
    salmon: { name: "Salmon", type: FoodTypes.meat, cal: 250 },
    trout: { name: "Trout", type: FoodTypes.meat, cal: 200 },
    cod: { name: "Cod", type: FoodTypes.meat, cal: 120 },
    sausage: { name: "Sausage", type: FoodTypes.meat, cal: 200 },

    //Combo dinners
    fish_gratin: { name: "Fish Gratin", type: FoodTypes.combo, cal: 135 },

    //dinner fiber/carbs
    pasta: { name: "Pasta", type: FoodTypes.dinnerfiber, cal: 120 },
    potato: { name: "Potato", type: FoodTypes.dinnerfiber, cal: 75 },
    rice: { name: "Rice", type: FoodTypes.dinnerfiber, cal: 124 },
    tortilla: { name: "Tortilla", type: FoodTypes.taco, cal: 255 },

    //greens/veggies
    carrot: { name: "Carrot", type: FoodTypes.greens, cal: 36 },
    brokkoli: { name: "Brokkoli", type: FoodTypes.greens, cal: 30 },
    peas: { name: "Peas", type: FoodTypes.greens, cal: 60 },
    aspergus: { name: "Aspergus", type: FoodTypes.greens, cal: 22 },
    aspergus_beans: { name: "(Aspergus) Beans", type: FoodTypes.greens, cal: 27 },
    cucumber: { name: "Cucumber", type: FoodTypes.greens, cal: 10 },
    corn: { name: "Corn", type: FoodTypes.greens, cal: 85 },
    onion: { name: "Onion", type: FoodTypes.greens, cal: 32 },
    cabbage: { name: "Cabbage", type: FoodTypes.greens, cal: 32 },
    tomato: { name: "Tomato", type: FoodTypes.greens, cal: 20 },
    paprika: { name: "Paprika", type: FoodTypes.greens, cal: 20 },
    brown_beans: { name: "Brown Beans", type: FoodTypes.greens, cal: 125 },
};

export const MealTypes = {
    breakfast: "breakfast",
    lunch: "lunch",
    dinner: "dinner",
    supper: "supper"
}

export const Meals = [
    {
        name: "Drink", types: [MealTypes.breakfast, MealTypes.lunch, MealTypes.supper], ingredients: [
            { food: null, amountg: 200, type: FoodTypes.drink },
            { food: null, amountg: 200, type: FoodTypes.drink }]
    },
    {
        name: "Muesli and Yoghurt", types: [MealTypes.breakfast, MealTypes.lunch, MealTypes.supper], ingredients: [
            { food: Foods.muesli, amountg: 30 },
            { food: Foods.yoghurt, amountg: 200 }]
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
            { food: null, amountg: 200, type: FoodTypes.drink },
            { food: Foods.cheese, amountg: 30 },
            { food: Foods.tortilla, amountg: 126 },
            { food: Foods.minced_meat_cattle, amountg: 150 },
            { food: Foods.cucumber, amountg: 60 },
            { food: Foods.corn, amountg: 30 },]
    },
    {
        name: "Lasagna", types: [MealTypes.dinner], ingredients: [
            { food: null, amountg: 200, type: FoodTypes.drink },
            { food: Foods.cheese, amountg: 60 },
            { food: Foods.pasta, amountg: 90 },
            { food: Foods.minced_meat_cattle, amountg: 150 },
            { food: Foods.milk, amountg: 225 },]
    },
    {
        name: "Salmon and veggies", types: [MealTypes.dinner], ingredients: [
            { food: null, amountg: 200, type: FoodTypes.drink },
            { food: Foods.salmon, amountg: 187 },
            { food: Foods.potato, amountg: 150 },
            { food: Foods.carrot, amountg: 112 },
            { food: null, amountg: 225, type: FoodTypes.greens },]
    },
    {
        name: "Spring rolls", types: [MealTypes.dinner], ingredients: [
            { food: null, amountg: 200, type: FoodTypes.drink },
            { food: Foods.onion, amountg: 128 },
            { food: Foods.cabbage, amountg: 136 },
            { food: Foods.minced_meat_pork, amountg: 270 },
            { food: Foods.spring_roll_wrapper, amountg: 80 },
            { food: Foods.carrot, amountg: 60 },]
    },
    {
        name: "Mexican Pot", types: [MealTypes.dinner], ingredients: [
            { food: null, amountg: 200, type: FoodTypes.drink },
            { food: Foods.rice, amountg: 60 },
            { food: Foods.tomato, amountg: 15 },
            { food: Foods.onion, amountg: 14 },
            { food: Foods.paprika, amountg: 8 },
            { food: Foods.brown_beans, amountg: 12 },
            { food: Foods.minced_meat_cattle, amountg: 200 },]
    },
    {
        name: "Chicken and veggies", types: [MealTypes.dinner], ingredients: [
            { food: null, amountg: 200, type: FoodTypes.drink },
            { food: Foods.chicken, amountg: 125 },
            { food: null, amountg: 100, type: FoodTypes.dinnerfiber },
            { food: null, amountg: 150, type: FoodTypes.greens },]
    },
    {
        name: "Tandoori", types: [MealTypes.dinner], ingredients: [
            { food: null, amountg: 200, type: FoodTypes.drink },
            { food: Foods.chicken, amountg: 125 },
            { food: Foods.tandoori_sauce, amountg: 180 },
            { food: Foods.rice, amountg: 80 },
            { food: Foods.naan, amountg: 130 },]
    },
    {
        name: "Wok", types: [MealTypes.dinner], ingredients: [
            { food: null, amountg: 200, type: FoodTypes.drink },
            { food: Foods.chicken, amountg: 125 },
            { food: Foods.wok_greens, amountg: 200 },
            { food: Foods.rice, amountg: 80 },
            { food: Foods.wok_sauce_teriyaki, amountg: 60 },]
    },
]

//https://www.kostholdsplanleggeren.no/displayfoods/?profileId=2&slotNumber=0
//https://www.matvaretabellen.no/
//https://www.matoppskrift.no/sider/omformer.asp?ID=ss