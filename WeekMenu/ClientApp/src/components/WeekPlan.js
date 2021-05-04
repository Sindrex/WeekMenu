import React, { Component } from 'react';
import { Button, Dropdown, Col, Row, Container, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FoodTypes, MealTypes, Foods, Meals, MakeWeekPlan, SetDayCal, Days } from './Food';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './WeekPlan.css';

export class WeekPlan extends Component {
    static displayName = WeekPlan.name;
    state = {
        weekplan: this.props.weekplan
    };

    componentDidUpdate(prevProps) {
        if (prevProps.weekplan !== this.props.weekplan) {
            this.setState({ weekplan: this.props.weekplan });
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

            tempplan = newSourceDestList;

            SetDayCal(tempplan);
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
    }

    render() {
        return (
            <Container id="weekplan">
                <DragDropContext onDragEnd={this.onDragEnd}>
                    {this.state.weekplan ? Days.map((day, i) =>
                        <Row key={i} id="weekplanrow">
                            <Col id="weekplancol" xs={1}>
                                <p><b>{day}: {Math.round(this.state.weekplan[day].cal)}kcal</b></p>
                            </Col>
                            {Object.keys(MealTypes).map((meal, m) =>
                                <Col id="weekplancol" key={m}>
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
                                                                <Card>
                                                                    <Card.Body>
                                                                        <Card.Title>{item.name}</Card.Title>
                                                                        <Card.Subtitle>({Math.round(item.cal)}kcal)</Card.Subtitle>
                                                                        <ListGroup className="list-group-flush">
                                                                            {item.ingredients.map((ingredient, k) =>
                                                                                <ListGroupItem key={k}>{ingredient.food.name}: {ingredient.amountg}g</ListGroupItem>
                                                                            )}
                                                                        </ListGroup>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </Col>
                            )}
                        </Row>
                    ) : <div />
                    }
                </DragDropContext>
            </Container>
        );
    }
}