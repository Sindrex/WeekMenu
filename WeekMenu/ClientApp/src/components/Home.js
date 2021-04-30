import React, { Component } from 'react';
import { Button, Dropdown, ListGroup, Col, Row, Container } from 'react-bootstrap';
import { FoodTypes, MealTypes, Foods, Meals, MakeWeekPlan } from './Food';

import './Home.css';

const womanCal = 2000;
const manCal = 2500;

export class Home extends Component {
    static displayName = Home.name;
    state = {
        selectedfoodlist: [],
        selectedcaloriesstr: "Calories",
        selectedcalories: 0,
        selectedfooddropdown: "Food",
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
                                        {Object.keys(Meals).map((prop, i) =>
                                            <Dropdown.Item key={i} onClick={() => this.onAddFood(Meals[prop])}>{Meals[prop].name}</Dropdown.Item>
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
                <div id="weekplan">
                    {this.state.weekplan ? Object.keys(this.state.weekplan).map((day, i) => 
                        <div key={i}>
                            <p><b>{day}:</b></p>
                            <p>Breakfast</p>
                            {this.state.weekplan[day].breakfast.map((item, j) =>
                                <p key={j}>-{item.name}</p>
                            )}
                            <p>Lunch</p>
                            {this.state.weekplan[day].lunch.map((item, j) =>
                                <p key={j}>-{item.name}</p>
                            )}
                            <p>Dinner</p>
                            <p>-{this.state.weekplan[day].dinner.name}</p>
                            <p>Supper</p>
                            {this.state.weekplan[day].supper.map((item, j) =>
                                <p key={j}>-{item.name}</p>
                            )}
                        </div>
                    ) : <div/>
                    }
                </div>
            </div>
        );
        //<Col md="auto"><Button variant="success">+</Button></Col>
    }
}
