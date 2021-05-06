import React, { Component } from 'react';
import { Button, Dropdown, Col, Container, Form } from 'react-bootstrap';
import { FoodTypes, Clone } from './Food';

import './CreateFood.css';

export class CreateFood extends Component {
    static displayName = CreateFood.name;

    state = {
        mealname: "",
        ingredients: [{ name: "", cal: "", amountg: "", type: "other" }],
        types: []
    };

    addIngredient = () => {
        let arr = this.state.ingredients;
        arr.push({ name: "", cal: "", amountg: "", type: "other" });
        this.setState({
            ingredients: arr
        });
    }

    addDropdownIngredient = (ingredient, i) => {
        ingredient["amountg"] = "";
        let arr = this.state.ingredients;
        arr[i] = ingredient;
        this.setState({
            ingredients: arr
        });
    }

    onChangedIngredientName = (e, i) => {
        let arr = this.state.ingredients;
        arr[i].name = e.target.value;
        this.setState({
            ingredients: arr
        });
    }
    onChangedIngredientGrams = (e, i) => {
        let arr = this.state.ingredients;
        arr[i].amountg = parseInt(e.target.value);
        this.setState({
            ingredients: arr
        });
    }
    onChangedIngredientKcal = (e, i) => {
        let arr = this.state.ingredients;
        arr[i].cal = parseInt(e.target.value);
        this.setState({
            ingredients: arr
        });
    }
    onChangedIngredientType = (prop, i) => {
        let arr = this.state.ingredients;
        arr[i].type = prop;
        this.setState({
            ingredients: arr
        });
    }

    onChangedMealName = (e) => {
        this.setState({
            mealname: e.target.value
        });
    }

    saveIngredient = (i) => {
        let ingredient = this.state.ingredients[i];
        ingredient = Clone(ingredient);
        delete ingredient.amountg;
        this.props.saveIngredient(ingredient);
    }

    removeIngredient = (i) => {
        let arr = this.state.ingredients;
        arr.splice(i, 1);
        this.setState({
            ingredients: arr
        });
        console.log(i, arr);
    }

    onSetType = (type, isOn) => {
        if (isOn && !this.state.types.includes(type)) {
            let types = this.state.types;
            types.push(type);
            this.setState({
                types: types
            });
        }
        else if (!isOn && this.state.types.includes(type)) {
            let types = this.state.types;
            types = types.filter(t => t !== type);
            this.setState({
                types: types
            });
        }
    }

    submit = (event) => {
        if (this.state.types.length <= 0 || this.state.ingredients.length <= 0) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        event.preventDefault();

        let ingredients = [];
        this.state.ingredients.map((ingredient) => {
            let newIngredient = {
                food: {
                    name: ingredient.name,
                    type: ingredient.type,
                    cal: ingredient.cal
                },
                amountg: ingredient.amountg
            };
            ingredients.push(newIngredient);
        });

        let meal = {
            name: this.state.mealname,
            types: this.state.types,
            ingredients: ingredients
        };
        this.props.addFood(meal);
    }

    render() {
        return (
            this.props.visible ? 
            <Container id="createfood">
                <Form onSubmit={this.submit} autoComplete="off">
                    <Form.Group>
                        <Form.Control required placeholder="Meal name" value={this.state.mealname} onChange={this.onChangedMealName} />
                    </Form.Group>
                    {this.state.ingredients.map((ingredient, i) =>
                        <Form.Row key={i}>
                            <Form.Group as={Col}>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" active>
                                        Existing ingredients
                                        </Dropdown.Toggle>

                                    <Dropdown.Menu id="existingingredientsdropdown">
                                        {Object.keys(this.props.ingredients).map((prop, j) => {
                                            return <Dropdown.Item key={j} onClick={(e) => this.addDropdownIngredient(this.props.ingredients[prop], i)}>{this.props.ingredients[prop].name}</Dropdown.Item>
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Control placeholder="Ingredient name" value={ingredient.name} onChange={(e) => this.onChangedIngredientName(e, i)}/>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Control required type="number" placeholder="grams" value={ingredient.amountg} onChange={(e) => this.onChangedIngredientGrams(e, i)}/>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Control type="number" placeholder="kcal/100g" value={ingredient.cal} onChange={(e) => this.onChangedIngredientKcal(e, i)}/>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Dropdown>
                                    <Dropdown.Toggle variant="warning" active>
                                        Type: {ingredient.type}
                                        </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {Object.keys(FoodTypes).map((prop, j) => {
                                            return <Dropdown.Item key={j} onClick={() => this.onChangedIngredientType(prop, i)}>{prop}</Dropdown.Item>
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Button variant="success" onClick={() => this.saveIngredient(i)}>
                                    Save ingredient
                                </Button>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Button variant="danger" onClick={() => this.removeIngredient(i)}>
                                    x
                                </Button>
                            </Form.Group>
                        </Form.Row>
                    )}

                    <Button variant="success" onClick={this.addIngredient}>
                        Add ingredient
                    </Button>

                    <Form.Row>
                        <Form.Label>
                            Meal type(s):
                        </Form.Label>
                        <Form.Group as={Col}>
                            <Form.Check label="Breakfast" onChange={(e) => this.onSetType("breakfast", e.target.checked)} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Check label="Lunch" onChange={(e) => this.onSetType("lunch", e.target.checked)} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Check label="Dinner" onChange={(e) => this.onSetType("dinner", e.target.checked)} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Check label="Supper" onChange={(e) => this.onSetType("supper", e.target.checked)} />
                        </Form.Group>
                     </Form.Row>

                    <Button variant="warning" type="submit" size="lg">
                        Create Meal
                    </Button>
                </Form>
            </Container>
            : <div/>
        );
    }
}