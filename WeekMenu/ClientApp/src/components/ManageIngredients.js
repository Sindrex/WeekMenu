import React, { Component } from 'react';
import { Button, Col, Row, Container, Card, Form, Dropdown } from 'react-bootstrap';
import { makegridfromobj } from './Util';
import { FoodTypes } from './Food';

import './ManageIngredients.css';

export class ManageIngredients extends Component {
    static displayName = ManageIngredients.name;
    state = {
        ingredients: this.props.ingredients,
        selectedTypes: []
    };

    componentDidMount() {
        let arr = [];
        Object.keys(FoodTypes).map((key) => arr.push(FoodTypes[key]));

        this.setState({
            selectedTypes: arr
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ingredients !== this.props.ingredients) {
            this.setState({ ingredients: this.props.ingredients });
        }
    }

    onDeleteIngredient = (ingredient) => {
        this.props.deleteIngredient(ingredient);
    }

    editIngredient= (ingredient) => {
        let ingredients = this.state.ingredients;
        ingredient["editing"] = true;

        this.setState({
            ingredients: ingredients
        });
    }

    saveEditIngredient = (ingredient, event) => {
        event.preventDefault();

        let ingredients = this.state.ingredients;
        ingredient["editing"] = false;
        ingredient.cal = event.target.elements["cal"].value;

        console.log(ingredient);

        this.setState({
            ingredients: ingredients
        });
    }

    changeType = (ingredient, type) => {
        ingredient.type = type;

        this.setState({
            ingredients: this.state.ingredients
        });
    }

    selectType = (type, event) => {
        let selectedTypes = this.state.selectedTypes;
        let isOn = event.target.checked;
        if (isOn) selectedTypes.push(type);
        else selectedTypes = selectedTypes.filter(item => item !== type);

        this.setState({
            selectedTypes: selectedTypes
        });
    }

    render() {
        return (
            <Container id="managefoodslist">
                <Form>
                    <Row>
                        {Object.keys(FoodTypes).map((key, i) =>
                            <Form.Check key={i} label={FoodTypes[key]} checked={this.state.selectedTypes.includes(FoodTypes[key])} onChange={(e) => this.selectType(FoodTypes[key], e)} />
                        )}
                    </Row>
                </Form>
                    {makegridfromobj(this.state.ingredients).map((row, i) =>
                        <Row key={i}>
                            {row.map((ingredient, j) => {
                                if (this.state.selectedTypes.includes(ingredient.type)) {
                                    return (
                                        <Col key={j}>
                                            {!ingredient.editing ?
                                                <Card>
                                                    <Card.Body>
                                                        <Row>
                                                            <Col>
                                                                <Card.Title style={{ 'fontSize': '1rem' }}>{ingredient.name}</Card.Title>
                                                            </Col>
                                                            <Col md="auto">
                                                                <Button variant="warning" onClick={() => this.editIngredient(ingredient)} size="sm">Edit</Button>
                                                            </Col>
                                                        </Row>
                                                        <Card.Subtitle>
                                                            <i>{ingredient.type}</i>
                                                        </Card.Subtitle>
                                                        <Card.Text>{ingredient.cal}kcal/100g</Card.Text>
                                                    </Card.Body>
                                                </Card>
                                                :
                                                <Card>
                                                    <Card.Body>
                                                        <Form onSubmit={(e) => this.saveEditIngredient(ingredient, e)}>
                                                            <Row>
                                                                <Col>
                                                                    <Card.Title style={{ 'fontSize': '1rem' }}>{ingredient.name}</Card.Title>
                                                                </Col>
                                                                <Col md="auto">
                                                                    <Button variant="success" type="submit" size="sm">Save</Button>
                                                                </Col>
                                                            </Row>
                                                            <Form.Row>
                                                                <Dropdown>
                                                                    <Dropdown.Toggle variant="warning">
                                                                        Type: {ingredient.type}
                                                                    </Dropdown.Toggle>

                                                                    <Dropdown.Menu id="existingingredientsdropdown">
                                                                        {Object.keys(FoodTypes).map((prop, j) => {
                                                                            return <Dropdown.Item key={j} name="type" onClick={() => this.changeType(ingredient, prop)}>{prop}</Dropdown.Item>
                                                                        })}
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </Form.Row>
                                                            <Row>
                                                                <Col>
                                                                    <Form.Control type="number" name="cal" defaultValue={ingredient.cal} required />
                                                                </Col>
                                                                <Col md="auto">
                                                                    kcal/100g
                                                                </Col>
                                                            </Row>
                                                            <Button variant="danger" block size="sm" onClick={() => this.onDeleteIngredient(ingredient)}>Delete ingredient</Button>
                                                        </Form>
                                                    </Card.Body>
                                                </Card>
                                            }
                                        </Col>
                                    );
                                }
                                else return <div key={j}/>
                            })}
                        </Row>
                    )}
            </Container>
        );
    }
}