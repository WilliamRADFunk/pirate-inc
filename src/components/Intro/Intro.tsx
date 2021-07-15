import React from 'react';
import { Button, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { Subscription } from 'rxjs';

import { gameManager } from "../../Services/GameManager";

interface Props {}

interface State {
    difficulty: number;
    errorMsg: string;
    name: string;
    validName: boolean;
}

enum ErrorMessages {
    Default = '1-3 space-separated words with letters only.',
    Profanity = 'No profanity or explitives are permitted. Try another name.'
}

export class Intro extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            difficulty: 1,
            errorMsg: ErrorMessages.Default,
            name: '',
            validName: false
        };
    }

    private changedName(event: any): void{
        const name = event.target.value;
        if (this.validateName(name)) {
            this.setState({ name: name, validName: true });
        } else {
            this.setState({ validName: false });
        }
    }

    private getIntro(): JSX.Element {
        switch(this.state.difficulty) {
            case 1: {
                return (
                    <Row className='no-gutters'>
                        <Col xs="12" lg={{ span: 8, offset: 2 }} className="text-left px-5 px-sm-2">
                            <p>
                                Passed up for promotion again, you’ve rallied the crew of a large English merchant vessel to turn on its captain and his worthless officers.
                            </p>
                            <p>
                                The ship and it’s treasures are yours; its crew voted you as the new captain; the former now marooned on an unnamed island.
                            </p>
                            <p>
                                You can never go back to civilized society. They hang people for what you’ve done. Why not try for a life of piracy? You could turn your new found riches into a fortune.
                            </p>
                            <p>
                                Best place to start is the safety of the Pirate Republic of Nassau, and so you set sail. From there, only you can decide how to make your legend.
                            </p>
                        </Col>
                    </Row>
                );
            }
            case 2: {
                return (
                    <Row className='no-gutters'>
                        <Col xs="12" lg={{ span: 10, offset: 1 }} className="text-left px-5 px-sm-2">
                            <p>
                                It's the early 1700's and the Golden Age of Piracy has begun. Inspired by the great names that pass through the drinking halls of Glasgow about those that dared to strike it rich against Dutch merchants and Spanish treasure vessels alike.
                            </p>
                            <p>
                                Names like Benjamin Hornigold and the founding of the Pirate Republic of Nassau, Edward “Black Beard” Thatch with his beard set aflame, and the duo of William Palsgrave and Samuel Bellamy; the one seeking fortune, and the other the love of his sweetheart.
                            </p>
                            <p>
                                Your prospects under the English crown seem grim. A life of piracy, while deadly dangerous, appears as a welcomed escape from a tedious life.
                            </p>
                            <p>
                                Will you add your name among the infamous and gain your fortune, or will you find yourself a watery grave where no one remembers you?
                            </p>
                            <p>
                                You and a band of misanthropes have stolen aboard a small frigate. The crew were on leave after a lengthy voyage and the few left on board to stand watch were alseep after a long night of drinking. In quick order you’ve managed to tie up and deposit them on the dock before setting sail for the Caribbean. You find yourself at the pirate island fortress of Tortuga, one pirate captain among many.
                            </p>
                            <p>
                                What will you do first?
                            </p>
                        </Col>
                    </Row>
                );
            }
            case 3: {
                return (
                    <Row className='no-gutters'>
                        <Col xs="12" lg={{ span: 8, offset: 2 }} className="text-left px-5 px-sm-2">
                            The Hard difficulty story
                        </Col>
                    </Row>
                );
            }
            case 4: {
                return (
                    <Row className='no-gutters'>
                        <Col xs="12" lg={{ span: 8, offset: 2 }} className="text-left px-5 px-sm-2">
                            <p>
                                That disastrous day had arrived when your fleet met a force greater than it's own. You and the handful of men on the small row boat with you watch as the last of your ships sink beneath the waves. The storm took everything you'd built in but an hour.
                            </p>
                            <p>
                                Your only hope to survive at all is to row for Norman Island. When you get there you might have just enough rescued wealth on your person to trade for a small sloop with a couple of cannon.
                            </p>
                            <p>
                                Be ever so cautious, though; the slightest misstep could result in ruination.
                            </p>
                            <p>
                                If you fail in your firststab at treasure, you probably won't get a second.
                            </p>
                        </Col>
                    </Row>
                );
            }
            default: {
                return (
                    <Row className='no-gutters'>
                        <Col xs="12" lg={{ span: 8, offset: 2 }} className="text-left px-5 px-sm-2">
                            This difficulty level does not exist.
                        </Col>
                    </Row>
                );
            }
        }
    }

    private startGame(): void {
        if (!this.state.validName) {
            return;
        }

        if (!gameManager.startGame(this.state.name)) {
            this.setState({ errorMsg: ErrorMessages.Profanity, validName: false });
        }
    }

    private validateName(name: string): boolean {
        // Make sure the name will actually work before enabling start button
        const reg = new RegExp('^[A-Za-z]+$');
        return !!(name && reg.test(name));
    }

    public componentDidMount() {
        // subscribe to all relevant player HUD data
        this.subscriptions.push(
            gameManager.getDifficulty().subscribe(difficulty => {
                if (difficulty) {
                    this.setState({ difficulty: difficulty });
                }
            }),
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public render() {
        const { errorMsg, validName } = this.state;

        return (
            <Col xs="12" lg={{ span: 8, offset: 2 }} className="boundaries py-5">
                <Row className='no-gutters'>
                    <Col xs="12" lg={{ span: 8, offset: 2 }} className="mb-4">
                        <h2 className="font-italic">How your story begins...</h2>
                    </Col>
                </Row>
                {this.getIntro()}
                <Row className='no-gutters'>
                    <Col xs={{ span: 10, offset: 1 }} lg={{ span: 6, offset: 3 }} className="my-4">
                        <InputGroup hasValidation>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="load-code-text">Your Pirate Name:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                id="pirate-name"
                                aria-describedby="pirate-name-text"
                                placeholder="Michael Van Helm"
                                onChange={(e) => this.changedName(e)}
                                isInvalid={ !validName }/>
                            <Form.Control.Feedback type='invalid'  className="fs-sm">
                                {errorMsg}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Col>
                </Row>
                <Row className='no-gutters'>
                    <Button
                        variant="primary"
                        className={`col-6 col-lg-2 offset-3 offset-lg-5 my-4${validName ? "" : " disabled"}`}
                        onClick={() => this.startGame()}>To the Ship!
                    </Button>
                </Row>
            </Col>
        );
    }
}