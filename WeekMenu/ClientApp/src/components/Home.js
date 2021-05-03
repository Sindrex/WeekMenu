import React, { Component } from 'react';
import { Button, Dropdown, Col, Row, Container } from 'react-bootstrap';
import { FoodTypes, MealTypes, Foods, Meals, MakeWeekPlan } from './Food';

import './Home.css';

const womanCal = 2000;
const manCal = 2500;

export class Home extends Component {
    static displayName = Home.name;
    state = {
        selectedfoodlist: [],
        selectedcaloriesstr: "Man (2500)",
        selectedcalories: 2500,
        fourthmeal: false,
        weekplan: null
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
    onRemoveFood = (e) => {
        let list = this.state.selectedfoodlist;
        list = list.filter(item => item.name !== e.name);
        this.setState({
            selectedfoodlist: list
        });
    }

    calculatePlan = () => {
        let plan = MakeWeekPlan(this.state.selectedcalories, this.state.selectedfoodlist, this.state.fourthmeal);
        console.log(plan);
        this.setState({
            weekplan: plan
        });
    }

    render () {
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
                <div id="foodlist">
                    <h2>Add your meals:</h2>
                    <Container>
                        {this.state.selectedfoodlist.map((item, i) =>
                            <Row id="foodlistitem" key={i}>
                                <Col>{item.name}</Col>
                                <Col><Button variant="danger" onClick={() => this.onRemoveFood(item)}>-</Button></Col>
                            </Row>
                         )}
                    </Container>
                    <Container id="foodlistaddcontainer">
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Add Food
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                        {Object.keys(Meals).map((prop, i) => {
                                            if (this.state.selectedfoodlist.includes(Meals[prop])) return;
                                            return <Dropdown.Item key={i} onClick={() => this.onAddFood(Meals[prop])}>{Meals[prop].name}</Dropdown.Item>
                                        }
                                    )}
                                </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div id="calculate">
                    <Button variant="primary" onClick={this.calculatePlan}>Calculate</Button>
                </div>
                <Container id="weekplan">
                    {this.state.weekplan ? Object.keys(this.state.weekplan).map((day, i) => 
                        <Row key={i} id="weekplanrow">
                            <Col id="weekplancol" md={1}>
                                <p><b>{day}: {Math.round(this.state.weekplan[day].cal)}kcal</b></p>
                            </Col>
                            <Col id="weekplancol">
                                <p>Breakfast: {Math.round(this.state.weekplan[day].breakfast.cal)}kcal</p>
                                {this.state.weekplan[day].breakfast.map((item, j) =>
                                    <div key={j}>
                                        <p id="weekplanmeal">{item.name}</p>
                                        <p id="weekplanmealingredient">({Math.round(item.cal)}kcal)</p>
                                        {item.ingredients.map((ingredient, k) =>
                                            <p key={k} id="weekplanmealingredient">{ingredient.food.name}: {ingredient.amountg}g</p>
                                        )}
                                    </div>
                                )}
                            </Col>
                            <Col id="weekplancol">
                                <p>Lunch: {Math.round(this.state.weekplan[day].lunch.cal)}kcal</p>
                                {this.state.weekplan[day].lunch.map((item, j) =>
                                    <div key={j}>
                                        <p id="weekplanmeal">{item.name}</p>
                                        <p id="weekplanmealingredient">({Math.round(item.cal)}kcal)</p>
                                        {item.ingredients.map((ingredient, k) =>
                                            <p key={k} id="weekplanmealingredient">{ingredient.food.name}: {ingredient.amountg}g</p>
                                        )}
                                    </div>
                                )}
                            </Col>
                            <Col id="weekplancol">
                                <p>Dinner: {Math.round(this.state.weekplan[day].dinner.cal)}kcal</p>
                                <p id="weekplanmeal">{this.state.weekplan[day].dinner.name}</p>
                                <p id="weekplanmealingredient">({Math.round(this.state.weekplan[day].dinner.cal)}kcal)</p>
                                {
                                    this.state.weekplan[day].dinner.ingredients.map((ingredient, k) =>
                                        <p key={k} id="weekplanmealingredient">{ingredient.food.name}: {ingredient.amountg}g</p>
                                    )
                                }
                            </Col>
                            <Col id="weekplancol">
                                <p>Supper: {Math.round(this.state.weekplan[day].supper.cal)}kcal</p>
                                {this.state.weekplan[day].supper.map((item, j) =>
                                    <div key={j}>
                                        <p id="weekplanmeal">{item.name}</p>
                                        <p id="weekplanmealingredient">({Math.round(item.cal)}kcal)</p>
                                        {item.ingredients.map((ingredient, k) =>
                                            <p key={k} id="weekplanmealingredient">{ingredient.food.name}: {ingredient.amountg}g</p>
                                        )}
                                    </div>
                                )}
                            </Col>
                        </Row>
                    ) : <div/>
                    }
                </Container>
            </div>
        );
        //<Col md="auto"><Button variant="success">+</Button></Col>
    }
}
