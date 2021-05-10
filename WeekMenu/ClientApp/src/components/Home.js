import React, { Component } from 'react';
//import Pdf from "react-to-pdf";
import { Button, Dropdown, Col, Row, Container, Card, Accordion, FormControl } from 'react-bootstrap';
import { Foods, Meals, MakeWeekPlan, GetWeekPlanObject, FillWeekPlan, MealTypes } from './Food';
import { WeekPlan } from './WeekPlan';
import { CreateFood } from './CreateFood';
import { CreateIngredient } from './CreateIngredient';

import './Home.css';

const womanCal = 2000;
const manCal = 2500;

//pdf stuff
const ref = React.createRef();
/*
const options = {
    orientation: 'landscape',
    unit: 'in',
    format: [12000, 12000]
};*/

export class Home extends Component {
    static displayName = Home.name;
    state = {
        selectedfoodlist: [],
        selectedcaloriesstr: "Man (2500)",
        selectedcalories: 2500,
        fourthmeal: true,
        weekplan: null,

        customCaloriesOn: false,

        meals: null,
        ingredients: null,

        selectedFoodError: ""
    }

    componentDidMount() {
        this.setState({
            weekplan: GetWeekPlanObject(),
            meals: Meals,
            ingredients: Foods
        });
    }

    onChangeCalorieSetting = (e, n) => {
        console.log("onChangeCalorieSetting!");
        this.setState({
            selectedcaloriesstr: e,
            selectedcalories: n,
            customCaloriesOn: false
        });
    }

    onSetCalorieSettingCustom = (isOn) => {
        this.setState({
            selectedcaloriesstr: "Custom",
            customCaloriesOn: isOn,
        });
    }

    onChangeCalorieSettingCustom = (e) => {
        this.setState({
            selectedcalories: e.target.value,
        });
    }

    onChangeFourthMeal = (e) => {
        this.setState({
            fourthmeal: !this.state.fourthmeal
        });
    }

    onAddFood = (e) => {
        let list = this.state.selectedfoodlist;
        list.push(e);
        this.setState({
            selectedfoodlist: list
        });
    }
    onAddAllFood = () => {
        let list = this.state.meals;
        let selList = this.state.selectedfoodlist;
        list.map((item) => selList.push(item));
        this.setState({
            selectedfoodlist: selList
        });
    }
    onRemoveFood = (e) => {
        let list = this.state.selectedfoodlist;
        list = list.filter(item => item.name !== e.name);
        this.setState({
            selectedfoodlist: list
        });
    }
    onRemoveAllFood = () => {
        this.setState({
            selectedfoodlist: []
        });
    }

    calculatePlan = () => {
        let dinners = this.state.selectedfoodlist.filter(meal => meal.types.includes(MealTypes.dinner));
        let others = this.state.selectedfoodlist.filter(meal => !meal.types.includes(MealTypes.dinner));
        if (!this.state.weekplan || this.state.selectedfoodlist.length <= 0 || dinners.length <= 0 || others.length < 0) {
            this.setState({
                selectedFoodError: "You must include at least 1 dinner and 1 not-dinner."
            });
            return;
        }

        let plan = MakeWeekPlan(this.state.selectedcalories, this.state.selectedfoodlist, this.state.fourthmeal, this.state.ingredients);
        console.log(plan);
        this.setState({
            weekplan: plan,
            selectedFoodError: ""
        });
    }
    FillPlan = () => {
        let dinners = this.state.selectedfoodlist.filter(meal => meal.types.includes(MealTypes.dinner));
        let others = this.state.selectedfoodlist.filter(meal => !meal.types.includes(MealTypes.dinner));
        if (!this.state.weekplan || this.state.selectedfoodlist.length <= 0 || dinners.length <= 0 || others.length < 0) {
            this.setState({
                selectedFoodError: "You must include at least 1 dinner and 1 not-dinner."
            });
            return;
        }

        let plan = FillWeekPlan(this.state.weekplan, this.state.selectedcalories, this.state.selectedfoodlist, this.state.fourthmeal, this.state.ingredients);
        console.log(plan);
        this.setState({
            weekplan: plan,
            selectedFoodError: ""
        });
    }
    SetPlan = (plan) => {
        console.log(plan);
        this.setState({
            weekplan: plan,
        });
    }

    saveOwnIngredient = (ingredient) => {
        let ingredientnamekey = ingredient.name.toLowerCase().replace(' ', '_');

        let obj = this.state.ingredients;
        if (obj.hasOwnProperty(ingredientnamekey)) return;

        console.log(obj);

        obj[ingredientnamekey] = ingredient;
        this.setState({
            ingredients: obj
        });
    }

    addOwnFood = (meal) => {
        let selList = this.state.selectedfoodlist;
        let fullList = this.state.meals;
        let nameSelList = selList.filter(item => item.name === meal.name);
        let nameFullList = fullList.filter(item => item.name === meal.name);
        if (nameSelList.length > 0 || nameFullList.length > 0) return;

        console.log(meal);
        console.log(fullList);

        selList.push(meal); 
        fullList.push(meal);
        this.setState({
            selectedfoodlist: selList,
            meals: fullList
        });
    }

    onDeleteMeal = (i) => {
        let meals = this.state.meals;
        meals.splice(i, 1);

        this.setState({
            meals: meals
        });
    }

    onDeleteIngredient = (key) => {
        console.log(key);
        let ingredients = this.state.ingredients;
        let ingredientKey = key.name.toLowerCase().replace(' ', '_');
        delete ingredients[ingredientKey];

        this.setState({
            ingredients: ingredients
        });
    }

    makegrid(meals) {
        let grid = [];
        grid.push([]);

        let perrow = 4;
        let rowIndex = 0;
        for (let i = 0; i < meals.length; i++) {
            if (i % perrow === 0 && i > 0) {
                rowIndex++;
                grid.push([]);
            }
            grid[rowIndex][i] = meals[i];
        }
        return grid;
    }
    makegridfromobj(obj) {
        let grid = [];
        grid.push([]);

        let perrow = 4;
        let rowIndex = 0;
        Object.keys(obj).map((key, i) => {
            if (i % perrow === 0 && i > 0) {
                rowIndex++;
                grid.push([]);
            }
            grid[rowIndex][i] = obj[key];
        });
        return grid;
    }

    render() {
        if (!this.state.meals) return <div/>;
        return (
            <div id="container">
                <h1>WeekMenu(tm)</h1>
                <div id="calorieamount">
                    <p>Pick gender / Calorie Amount</p>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {this.state.selectedcaloriesstr}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => this.onChangeCalorieSetting(`Man (${manCal})`, manCal)}>Man ({manCal})</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.onChangeCalorieSetting(`Woman (${womanCal})`, womanCal)}>Woman ({womanCal})</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.onSetCalorieSettingCustom(true)}>Custom</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    {this.state.customCaloriesOn ?
                        <div id="calorieamountinput">
                            <FormControl
                                type="number"
                                placeholder="Calories"
                                aria-label="Calories"
                                aria-describedby="basic-addon1"
                                value={this.state.customCalories}
                                onChange={this.onChangeCalorieSettingCustom}
                            />
                        </div>
                        : <div />
                    }
                </div>
                <div id="fourthmeal">
                    <p>Include a 4th daily meal (Supper or evening/night meal)?</p>
                    <input type="checkbox" checked={this.state.fourthmeal} onChange={this.onChangeFourthMeal} />
                </div>
                <div id="managefoods">
                    <Accordion>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                                Manage Meals
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Container id="managefoodslist">
                                    {this.makegrid(this.state.meals).map((row, i) => 
                                        <Row key={i}>
                                            {row.map((meal, j) => 
                                                <Col key={j}>
                                                    <Card>
                                                        <Card.Body>
                                                            <Card.Title>{meal.name}</Card.Title>
                                                            <Card.Subtitle>
                                                                {meal.types.join()}
                                                            </Card.Subtitle>
                                                            {meal.ingredients.map((ing, k) => {
                                                                if (ing.food) return <Card.Text id="mealsmanagementitemingredient" key={k}>{ing.food.name}: {ing.amountg}g</Card.Text>
                                                                return <Card.Text id="mealsmanagementitemingredient" key={k}>{ing.type}: {ing.amountg}g</Card.Text>
                                                            })}
                                                            <Button variant="danger" block size="sm" onClick={() => { this.onDeleteMeal(i)}}>-</Button>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            )}
                                        </Row>
                                    )}
                                </Container>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="1">
                                Create Meal
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <CreateFood meals={this.state.meals} ingredients={this.state.ingredients} visible={true} addFood={this.addOwnFood} saveIngredient={this.saveOwnIngredient} />
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="2">
                                Manage Ingredients
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="2">
                                <Container id="managefoodslist">
                                    {this.makegridfromobj(this.state.ingredients).map((row, i) =>
                                        <Row key={i}>
                                            {row.map((ingredient, j) =>
                                                <Col key={j}>
                                                    <Card>
                                                        <Card.Body>
                                                            <Card.Title>{ingredient.name}</Card.Title>
                                                            <Card.Subtitle>
                                                                {ingredient.type}
                                                            </Card.Subtitle>
                                                            <Card.Text>{ingredient.cal}kcal/100g</Card.Text>
                                                            <Button variant="danger" block size="sm" onClick={() => this.onDeleteIngredient(ingredient)}>-</Button>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            )}
                                        </Row>
                                    )}
                                </Container>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="3">
                                Create Ingredient
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="3">
                                <CreateIngredient saveIngredient={this.saveOwnIngredient}/>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
                <div id="foodlist">
                    <h2>Add your meals:</h2>
                    <Container>
                        {this.state.selectedfoodlist.map((item, i) =>
                            <Row id="foodlistitem" key={i}>
                                <Col>{item.name} ({item.types.join()})</Col>
                                <Col md="auto"><Button variant="danger" onClick={() => this.onRemoveFood(item)}>x</Button></Col>
                            </Row>
                         )}
                    </Container>
                    <Container id="foodlistaddcontainer">
                        <Row className="justify-content-md-center">
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Add Meal
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={this.onAddAllFood} active>Add All</Dropdown.Item>
                                            {this.state.meals.map((meal, i) => {
                                                if (this.state.selectedfoodlist.includes(meal)) return;
                                                return (
                                                    <Dropdown.Item key={i} onClick={() => this.onAddFood(meal)}>
                                                        {meal.name} ({meal.types.join()})
                                                    </Dropdown.Item>)
                                            })}

                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col>
                                <Button variant="danger" onClick={this.onRemoveAllFood}>Clear All</Button>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div id="calculate">
                    <Button variant="primary" onClick={this.calculatePlan}>Calculate</Button>
                    <Button variant="primary" onClick={this.FillPlan}>Fill</Button>
                    {this.state.selectedFoodError ? 
                        <p>{this.state.selectedFoodError}</p>
                        :
                        <div/>
                    }
                </div>
                <div ref={ref}>
                    <WeekPlan weekplan={this.state.weekplan} meals={this.state.meals} ingredients={this.state.ingredients} SetPlan={this.SetPlan} />
                </div>
            </div>
        );
    }
}
/*
    <Pdf targetRef={ref} filename="weekmenu.pdf" options={options} x={.5} y={.5} scale={0.8}>
        {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
    </Pdf>
 */
