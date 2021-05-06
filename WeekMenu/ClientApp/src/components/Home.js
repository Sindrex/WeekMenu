import React, { Component } from 'react';
import { Button, Dropdown, Col, Row, Container, Card, Accordion } from 'react-bootstrap';
import { Foods, Meals, MakeWeekPlan, GetWeekPlanObject } from './Food';
import { WeekPlan } from './WeekPlan';
import { CreateFood } from './CreateFood';

import './Home.css';

const womanCal = 2000;
const manCal = 2500;

export class Home extends Component {
    static displayName = Home.name;
    state = {
        selectedfoodlist: [],
        selectedcaloriesstr: "Man (2500)",
        selectedcalories: 2500,
        fourthmeal: true,
        weekplan: null,

        creatingOwnFood: false,

        meals: null,
        ingredients: null
    }

    componentDidMount() {
        this.setState({
            weekplan: GetWeekPlanObject(),
            meals: Meals,
            ingredients: Foods
        });
    }

    onChangeCalorieSetting = (e, n) => {
        this.setState({
            selectedcaloriesstr: e,
            selectedcalories: n
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
        let plan = MakeWeekPlan(this.state.selectedcalories, this.state.selectedfoodlist, this.state.fourthmeal, this.state.ingredients);
        console.log(plan);
        this.setState({
            weekplan: plan
        });
    }

    startCreateOwnFood = () => {
        this.setState({
            creatingOwnFood: !this.state.creatingOwnFood
        });
    }

    saveOwnIngredient = (ingredient) => {
        let obj = this.state.ingredients;
        if (obj.hasOwnProperty(ingredient.name)) return;

        console.log(obj);

        obj[ingredient.name] = ingredient;
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
                        </Dropdown.Menu>
                    </Dropdown>
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
                                    {this.state.meals.map((meal, i) => {
                                        return (
                                            <Row key={i} id="managefoodslistitem">
                                                <Col>
                                                <p>
                                                    {meal.name} ({meal.types.join()})
                                                </p>
                                                </Col>
                                                <Col md="auto">
                                                    <Button variant="danger" md="auto" size="sm" onClick={() => {this.onDeleteMeal(i)}}>-</Button>
                                                </Col>
                                            </Row>
                                        )
                                    })}
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
                                    <Dropdown.Toggle variant="success" id="dropdown-basic" active>
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
                </div>
                <WeekPlan weekplan={this.state.weekplan} meals={this.state.meals} ingredients={this.state.ingredients} />
            </div>
        );
        //<Col md="auto"><Button variant="success">+</Button></Col>
    }
}
