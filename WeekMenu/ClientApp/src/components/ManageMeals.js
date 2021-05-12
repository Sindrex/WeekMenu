import React, { Component } from 'react';
import { Button, Col, Row, Container, Card, Form } from 'react-bootstrap';
import { makegridfromobj } from './Util';
import { MealTypes, FoodTypes } from './Food';

export class ManageMeals extends Component {
    static displayName = ManageMeals.name;
    state = {
        meals: this.props.meals,
        ingredients: this.props.ingredients
    };

    componentDidUpdate(prevProps) {
        if (prevProps.meals !== this.props.meals) {
            this.setState({ meals: this.props.meals });
        }
        if (prevProps.ingredients !== this.props.ingredients) {
            this.setState({ ingredients: this.props.ingredients });
        }
    }

    delete = (meal) => {
        this.props.deleteMeal(meal);
    }

    edit = (meal) => {
        let meals = this.state.meals;
        meal["editing"] = true;

        this.setState({
            meals: meals
        });
    }

    addIngredient = (meal) => {
        meal.ingredients.push({ food: this.state.ingredients.banana, amountg: 100 });

        this.setState({
            meals: this.state.meals
        });

    }

    removeIngredient = (meal, k) => {
        meal.ingredients.splice(k, 1);

        this.setState({
            meals: this.state.meals
        });
    }

    saveEdit = (meal, event) => {
        event.preventDefault();

        meal["editing"] = false;
        meal.types = [];
        Object.keys(MealTypes).map((type, k) => {
            if (event.target.elements["checked-" + type].checked) meal.types.push(type);
        });

        meal.ingredients.map((item, i) => {
            let foodname = event.target.elements["ingredientselect-" + i].value.toLowerCase().replaceAll(' ', '_');

            if (foodname.includes("type:")) {
                item.food = null;
                item["type"] = foodname.replaceAll("type:", "");
            }
            else {
                item.food = this.state.ingredients[foodname];
                delete item["type"];
            }

            item.amountg = parseInt(event.target.elements["ingredientamount-" + i].value);
        });

        console.log(meal);

        this.setState({
            meals: this.state.meals
        });
    }

    render() {
        return (
            <Container id="managefoodslist">
                {makegridfromobj(this.state.meals).map((row, i) =>
                    <Row key={i}>
                        {row.map((meal, j) =>
                        <Col key={j}>
                            {!meal.editing ?
                                <Card>
                                    <Card.Body>
                                        <Row>
                                            <Col>
                                                    <Card.Title style={{ 'fontSize': '1rem' }}>{meal.name}</Card.Title>
                                            </Col>
                                            <Col md="auto">
                                                    <Button variant="warning" onClick={() => this.edit(meal)} size="sm">Edit</Button>
                                            </Col>
                                        </Row>
                                        <Card.Subtitle>
                                            <i>{meal.types.join()}</i>
                                        </Card.Subtitle>
                                        {meal.ingredients.map((ing, k) => {
                                            if (ing.food) return <Card.Text id="mealsmanagementitemingredient" key={k}>{ing.food.name}: {ing.amountg}g</Card.Text>
                                            return <Card.Text id="mealsmanagementitemingredient" key={k}>{ing.type}: {ing.amountg}g</Card.Text>
                                        })}
                                    </Card.Body>
                                </Card>
                                :
                                <Card>
                                    <Card.Body>
                                        <Form onSubmit={(e) => this.saveEdit(meal, e)}>
                                            <Row>
                                                <Col>
                                                    <Card.Title style={{ 'fontSize': '1rem' }}>{meal.name}</Card.Title>
                                                </Col>
                                                <Col md="auto">
                                                    <Button variant="success" type="submit" size="sm">Save</Button>
                                                </Col>
                                            </Row>
                                            <Form.Row>
                                                {Object.keys(MealTypes).map((type, k) =>
                                                    <Form.Group as={Col} key={k}>
                                                        <Form.Check label={type} name={"checked-" + type} defaultChecked={meal.types.includes(type)} />
                                                    </Form.Group>
                                                )}
                                            </Form.Row>
                                            {meal.ingredients.map((ingredient, k) =>
                                                <div key={k}>
                                                    <Form.Row>
                                                        <Form.Group as={Col}>
                                                            <Form.Control as="select" name={"ingredientselect-" + k}>
                                                                {ingredient.food ? <option>{ingredient.food.name}</option> :
                                                                    <option>type:{ingredient.type}</option>
                                                                }
  
                                                                {Object.keys(this.state.ingredients).map((ing, l) => {
                                                                    if (ingredient.food && this.state.ingredients[ing].name === ingredient.food.name) return;
                                                                    return <option key={l}>{this.state.ingredients[ing].name}</option>
                                                                })}

                                                                {Object.keys(FoodTypes).map((type, l) => {
                                                                    if (!ingredient.food && ingredient.type === type) return;
                                                                    return <option key={l}>type:{type}</option>
                                                                })}
                                                            </Form.Control>
                                                        </Form.Group>
                                                        <Form.Group as={Col}>
                                                            <Form.Control type="number" name={"ingredientamount-" + k} defaultValue={ingredient.amountg} />
                                                        </Form.Group>
                                                        <Form.Group as={Col} md="auto">
                                                            <Button variant="danger" md="auto" size="sm" onClick={() => this.removeIngredient(meal, k)}>-</Button>
                                                        </Form.Group>
                                                    </Form.Row>
                                                </div>
                                            )}

                                            <Button variant="success" block size="sm" onClick={() => this.addIngredient(meal)}>+</Button>
                                            <Button variant="danger" block size="sm" onClick={() => this.delete(meal)}>Delete meal</Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            }
                        </Col>
                        )}
                    </Row>
                )}
            </Container>
        );
    }
}