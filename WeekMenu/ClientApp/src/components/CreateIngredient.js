import React, { Component } from 'react';
import { Button, Dropdown, Col, Container, Form } from 'react-bootstrap';
import { FoodTypes, Clone } from './Food';

import './CreateIngredient.css';

export class CreateIngredient extends Component {
    static displayName = CreateIngredient.name;

    state = {
        name: "",
        cal: "",
        type: FoodTypes.other
    };

    onChangedIngredientName = (e) => {
        this.setState({
            name: e.target.value
        });
    }
    onChangedIngredientKcal = (e) => {
        this.setState({
            cal: parseInt(e.target.value)
        });
    }
    onChangedIngredientType = (type) => {
        this.setState({
            type: type
        });
    }

    submit = (event) => {
        event.preventDefault();
        if (!this.state.name || !this.state.cal) {
            event.stopPropagation();
            return;
        }
        let ingredient = {
            name: this.state.name,
            type: this.state.type,
            cal: this.state.cal
        }
        this.props.saveIngredient(ingredient);

        this.setState({
            name: "",
            cal: "",
            type: FoodTypes.other
        });
    }

    render() {
        return (
            <Container id="createingredient">
                <Form onSubmit={this.submit} autoComplete="off">
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control placeholder="Ingredient name" value={this.state.name} onChange={(e) => this.onChangedIngredientName(e)} required/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Control type="number" placeholder="kcal/100g" value={this.state.cal} onChange={(e) => this.onChangedIngredientKcal(e)} required/>
                        </Form.Group>
                        <Form.Group as={Col} md="auto">
                            <Dropdown>
                                <Dropdown.Toggle variant="warning">
                                    Type: {this.state.type}
                                </Dropdown.Toggle>

                                <Dropdown.Menu id="typedropdown">
                                    {Object.keys(FoodTypes).map((prop, j) => {
                                        return <Dropdown.Item key={j} onClick={() => this.onChangedIngredientType(prop)}>{prop}</Dropdown.Item>
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                    </Form.Row>

                    <Button variant="warning" type="submit" size="lg">
                        Create Ingredient
                    </Button>
                </Form>
            </Container>
        );
    }
}