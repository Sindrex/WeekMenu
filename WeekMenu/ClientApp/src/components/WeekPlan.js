import React, { Component } from 'react';
import { Button, Dropdown, Col, Row, Container, Card, Form } from 'react-bootstrap';
import { MealTypes, SetDayCal, Days, GetMealCal, GetWeekPlanObject, Clone } from './Food';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './WeekPlan.css';

export class WeekPlan extends Component {
    static displayName = WeekPlan.name;
    state = {
        weekplan: this.props.weekplan,
        meals: this.props.meals,
        ingredients: this.props.ingredients
    };

    componentDidUpdate(prevProps) {
        if (prevProps.weekplan !== this.props.weekplan) {
            this.setState({ weekplan: this.props.weekplan });
        }
        if (prevProps.meals !== this.props.meals) {
            this.setState({ meals: this.props.meals });
        }
        if (prevProps.ingredients !== this.props.ingredients) {
            this.setState({ ingredients: this.props.ingredients });
        }
    }

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        let tempplan = this.state.weekplan;

        let sourceIdSplit = result.source.droppableId.split("-"); //"day-meal"
        let sourceDay = sourceIdSplit[0];
        let sourceMeal = sourceIdSplit[1];
        let sourceIndex = parseInt(result.source.index);
        let sourceLink = tempplan[sourceDay][sourceMeal][sourceIndex];

        let destIdSplit = result.destination.droppableId.split("-"); //"day-meal"
        let destDay = destIdSplit[0];
        let destMeal = destIdSplit[1];
        let destIndex = parseInt(result.destination.index);

        if (sourceDay === destDay && sourceMeal === destMeal) {
            let newSourceDestList = tempplan[sourceDay][sourceMeal].slice();
            newSourceDestList.splice(sourceIndex, 1);
            newSourceDestList.splice(destIndex, 0, sourceLink);

            tempplan[sourceDay][sourceMeal] = newSourceDestList;

            SetDayCal(tempplan[sourceDay]);
        }
        else {
            let newSourceList = tempplan[sourceDay][sourceMeal].slice();
            let newDestList = tempplan[destDay][destMeal].slice();
            newSourceList.splice(sourceIndex, 1); //remove 1 element at sourceindex
            newDestList.splice(destIndex, 0, sourceLink); //remove 0 element at destindex and insert sourcelink

            tempplan[sourceDay][sourceMeal] = newSourceList;
            tempplan[destDay][destMeal] = newDestList;

            SetDayCal(tempplan[sourceDay]);
            SetDayCal(tempplan[destDay]);
        }

        this.setState({
            weekplan: tempplan
        });

        this.props.SetPlan(tempplan);
    }

    onAddFood = (meal) => {
        let tempplan = this.state.weekplan;

        meal = Clone(meal);

        meal.cal = GetMealCal(meal, this.state.ingredients); //Set typed ingredients

        tempplan[Days[0]][MealTypes.breakfast].push(meal);
        SetDayCal(tempplan[Days[0]]);
        this.setState({
            weekplan: tempplan
        });

        this.props.SetPlan(tempplan);
    }

    deleteFood = (day, meal, index) => {
        let tempplan = this.state.weekplan;

        let sourceDest = tempplan[day][meal].slice();
        sourceDest.splice(index, 1);
        tempplan[day][meal] = sourceDest;
        SetDayCal(tempplan[day]);

        this.setState({
            weekplan: tempplan
        });

        this.props.SetPlan(tempplan);
    }

    clearPlan = () => {
        let tempplan = GetWeekPlanObject();
        this.setState({
            weekplan: tempplan
        });

        this.props.SetPlan(tempplan);
    }

    editFood = (day, meal, j) => {
        let tempplan = this.state.weekplan;
        let sourceFood = tempplan[day][meal][j];
        sourceFood["editing"] = true;

        this.setState({
            weekplan: tempplan
        });

        this.props.SetPlan(tempplan);
    }

    addIngredientToMeal = (day, meal, j) => {
        let tempplan = this.state.weekplan;
        let sourceFood = tempplan[day][meal][j];
        sourceFood.ingredients.push({ food: this.state.ingredients.banana, amountg: 100 });

        this.setState({
            weekplan: tempplan
        });

        this.props.SetPlan(tempplan);
    }

    removeIngredientToMeal = (day, meal, j, k) => {
        let tempplan = this.state.weekplan;
        let sourceFood = tempplan[day][meal][j];
        sourceFood.ingredients.splice(k, 1);
        tempplan[day][meal][j] = sourceFood;
        SetDayCal(tempplan[day]);

        this.setState({
            weekplan: tempplan
        });

        this.props.SetPlan(tempplan);
    }

    saveEditFood = (day, meal, j, event) => {
        event.preventDefault();

        let tempplan = this.state.weekplan;
        let sourceFood = tempplan[day][meal][j];
        sourceFood["editing"] = false;

        sourceFood.ingredients.map((item, i) => {
            let foodname = event.target.elements["ingredientselect-" + i].value.toLowerCase().replaceAll(' ', '_');
            item.food = this.state.ingredients[foodname];
            item.amountg = parseInt(event.target.elements["ingredientamount-" + i].value);
        });

        sourceFood.cal = GetMealCal(sourceFood, this.state.ingredients);
        SetDayCal(tempplan[day]);

        console.log(sourceFood);

        this.setState({
            weekplan: tempplan
        });

        this.props.SetPlan(tempplan);
    }

    render() {
        return (
            <Container id="weekplan">
                <Row>
                    <Dropdown>
                        <Dropdown.Toggle variant="success">
                            Add Meal to Plan
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {this.state.meals.map((meal, i) => 
                                <Dropdown.Item key={i} onClick={() => this.onAddFood(meal)}>{meal.name}</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button variant="danger" onClick={this.clearPlan}>Clear Plan</Button>
                </Row>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    {this.state.weekplan ? Days.map((day, i) =>
                        <Row key={i} id="weekplanrow">
                            <Col id="weekplancol" xs={1}>
                                <p><b>{day}: {Math.round(this.state.weekplan[day].cal)}kcal</b></p>
                            </Col>
                            {Object.keys(this.state.weekplan[day]).map((meal, m) => {
                                if (meal === "cal") return;
                                return (<Col id="weekplancol" key={m}>
                                    <p>{meal}: {Math.round(this.state.weekplan[day][meal].cal)}kcal</p>
                                    <Droppable droppableId={day + "-" + meal}>
                                        {provided => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                {this.state.weekplan[day][meal].map((item, j) =>
                                                    <Draggable draggableId={day + "-" + meal + "-" + j} index={j} key={j}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                isDragging={snapshot.isDragging}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                {!item.editing ?
                                                                    <Card id="weekplancard">
                                                                        <Card.Body>
                                                                            <Row>
                                                                                <Col>
                                                                                    <Card.Title style={{ 'fontSize': '1rem' }}>{item.name}</Card.Title>
                                                                                </Col>
                                                                                <Col md="auto">
                                                                                    <Button variant="warning" onClick={() => this.editFood(day, meal, j)} size="sm">Edit</Button>
                                                                                </Col>
                                                                            </Row>
                                                                            <Card.Subtitle>({Math.round(item.cal)}kcal)</Card.Subtitle>
                                                                            {item.ingredients.map((ingredient, k) =>
                                                                                <p id="weekplanmealingredient" key={k}>{ingredient.food.name}: {ingredient.amountg}g</p>
                                                                            )}
                                                                        </Card.Body>
                                                                    </Card>
                                                                    :
                                                                    <Card>
                                                                        <Card.Body>
                                                                            <Form onSubmit={(e) => this.saveEditFood(day, meal, j, e)}>
                                                                                <Row>
                                                                                    <Col>
                                                                                        <Card.Title style={{ 'fontSize': '1rem' }}>{item.name}</Card.Title>
                                                                                    </Col>
                                                                                    <Col md="auto">
                                                                                        <Button variant="success" type="submit" size="sm">Save</Button>
                                                                                    </Col>
                                                                                </Row>
                                                                                <Card.Subtitle>({Math.round(item.cal)}kcal)</Card.Subtitle>
                                                                                {item.ingredients.map((ingredient, k) =>
                                                                                    <div key={k}>
                                                                                        <Form.Row>
                                                                                            <Form.Group as={Col}>
                                                                                                <Form.Control as="select" name={"ingredientselect-" + k}>
                                                                                                    <option>{ingredient.food.name}</option>
                                                                                                    {Object.keys(this.state.ingredients).map((ing, l) => {
                                                                                                        //if (this.state.ingredients[ing].type !== ingredient.food.type) return;
                                                                                                        if (this.state.ingredients[ing].name === ingredient.food.name) return;
                                                                                                        return <option key={l} item={this.state.ingredients[ing]}>{this.state.ingredients[ing].name}</option>
                                                                                                    })}
                                                                                                </Form.Control>
                                                                                            </Form.Group>
                                                                                            <Form.Group as={Col}>
                                                                                                <Form.Control type="number" name={"ingredientamount-" + k} defaultValue={ingredient.amountg} />
                                                                                            </Form.Group>
                                                                                            <Form.Group as={Col} md="auto">
                                                                                                <Button variant="danger" md="auto" size="sm" onClick={() => this.removeIngredientToMeal(day, meal, j, k)}>-</Button>
                                                                                            </Form.Group>
                                                                                        </Form.Row>
                                                                                    </div>
                                                                                )}

                                                                                <Button variant="success" block size="sm" onClick={() => this.addIngredientToMeal(day, meal, j)}>+</Button>
                                                                                <Button variant="danger" block size="sm" onClick={() => this.deleteFood(day, meal, j)}>Delete meal</Button>
                                                                            </Form>
                                                                        </Card.Body>
                                                                    </Card>
                                                                }
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </Col>)
                            })}
                        </Row>
                    ) : <div />
                    }
                </DragDropContext>
            </Container>
        );
    }
}