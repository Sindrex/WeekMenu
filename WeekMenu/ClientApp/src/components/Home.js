import React, { Component } from 'react';
import { Button, Dropdown, Col, Row, Container } from 'react-bootstrap';
import { FoodTypes, MealTypes, Foods, Meals, MakeWeekPlan } from './Food';
import { WeekPlan } from './WeekPlan';

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
    onAddAllFood = () => {
        this.setState({
            selectedfoodlist: Meals
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
                                <Col md="auto"><Button variant="danger" onClick={() => this.onRemoveFood(item)}>-</Button></Col>
                            </Row>
                         )}
                    </Container>
                    <Container id="foodlistaddcontainer">
                        <Row className="justify-content-md-center">
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Add Food
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={this.onAddAllFood}>Add All</Dropdown.Item>
                                            {Object.keys(Meals).map((prop, i) => {
                                                if (this.state.selectedfoodlist.includes(Meals[prop])) return;
                                                return <Dropdown.Item key={i} onClick={() => this.onAddFood(Meals[prop])}>{Meals[prop].name}</Dropdown.Item>
                                            }
                                            )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col md="auto">
                                <Button variant="danger" onClick={this.onRemoveAllFood}>Clear All</Button>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div id="calculate">
                    <Button variant="primary" onClick={this.calculatePlan}>Calculate</Button>
                </div>
                <WeekPlan weekplan={this.state.weekplan} />
            </div>
        );
        //<Col md="auto"><Button variant="success">+</Button></Col>
    }
}
