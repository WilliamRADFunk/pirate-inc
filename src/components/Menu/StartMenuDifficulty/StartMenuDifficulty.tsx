import React from "react";
import { Button, ButtonGroup, Row, ToggleButton } from "react-bootstrap";

import { Subscription } from "rxjs";

import { ListOption } from "../../../types/ListOption";
import { gameManager } from "../../../services/GameManager";

interface Props {
    toggleView: () => void
}

interface State {
    difficulty: number;
    toggleView: () => void;
}

export class StartMenuDifficulty extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    public radios: ListOption[] = [
        { label: 'Easy', value: 1 },
        { label: 'Normal', value: 2 },
        { label: 'Hard', value: 3 },
        { label: 'Impossible', value: 4 },
    ];

    constructor(props: Props) {
        super(props);

        this.state = {
            difficulty: 1,
            toggleView: props.toggleView
        };
    }
    
    public componentDidMount() {
        // subscribe to all relevant player HUD data
        this.subscriptions.push(
            gameManager.getDifficulty().subscribe(difficulty => {
                if (difficulty >= 0 && difficulty < 4) {
                    // add difficulty to local state if number is inclusive between 0 and 3
                    this.setState({ difficulty: difficulty });
                }
            })
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public changeDifficulty(event: any): void {
        const newDiff = Number(event.currentTarget.value);
        if (newDiff >= 0 && newDiff < 4) {
            gameManager.changeDifficulty(newDiff);
        }
    }
    
    public render() {
        const { difficulty, toggleView } = this.state;

        return (
            <>
                <Row>
                    <Button
                        variant="primary"
                        className="col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                        onClick={toggleView}>Back to Menu
                    </Button>
                </Row>
                <Row>
                    <ButtonGroup toggle
                        className="col-6 offset-3"
                        aria-label="Choose game difficulty level">
                        {this.radios.map((radio) => (
                            <ToggleButton
                                key={radio.value}
                                variant="info"
                                value={radio.value}
                                name="DifficultyRadio"
                                type="radio"
                                checked={difficulty === radio.value}
                                onChange={this.changeDifficulty}>{radio.label}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </Row>
            </>
        );
    }
}