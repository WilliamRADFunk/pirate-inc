import React from "react";
import { ToggleButton, ButtonGroup, FormControl, InputGroup } from "react-bootstrap";

import { Subscription } from "rxjs";
import { gameManager } from "../../services/GameManager";
import { SceneLocation } from "../../Types/SceneLocation";

interface Props {}

interface State {
    difficulty: number;
    sceneLocation: string;
    showDifficulty: boolean;
    showLoadCode: boolean;
}

export class StartMenu extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            difficulty: 0,
            sceneLocation: "",
            showDifficulty: false,
            showLoadCode: false
        };
    }
    
    public componentDidMount() {
        // subscribe to all relevant player HUD data
        this.subscriptions.push(
            gameManager.getSceneLocation().subscribe(location => {
                if (location) {
                    // add balance to local state if number
                    this.setState({ sceneLocation: location });
                }
            }),
            gameManager.getDifficulty().subscribe(difficulty => {
                if (difficulty >=0 && difficulty < 4) {
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

    public toggleDifficultyOptions(): void {
        this.setState({ showDifficulty: !this.state.showDifficulty });
    }

    public toggleLoadCodeInput(): void {
        this.setState({ showLoadCode: !this.state.showLoadCode });
    }

    public render() {
        const { difficulty, sceneLocation, showDifficulty, showLoadCode } = this.state;

        const radios = [
            { name: 'DifficultyRadio', label: 'Easy', value: 0 },
            { name: 'DifficultyRadio', label: 'Normal', value: 1 },
            { name: 'DifficultyRadio', label: 'Hard', value: 2 },
            { name: 'DifficultyRadio', label: 'Impossible', value: 3 },
        ];

        return (
            sceneLocation != SceneLocation.StartMenu ? null :
            <div className="boundaries col-12 col-lg-8 offset-lg-2 py-5">
                <div className="row">
                    <div
                        className="btn btn-primary col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                        role="button">Start Game
                    </div>
                </div>
                <div className="row">
                    <div
                        className="btn btn-primary col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                        onClick={() => this.toggleLoadCodeInput()}
                        role="button">Load Game
                    </div>
                </div>
                { !showLoadCode ? null :
                    <div className="row">
                        <div className="col-12 col-lg-6 offset-lg-3">
                            <InputGroup>
                                <InputGroup.Prepend>
                                <InputGroup.Text id="load-code-text">
                                    Your saved game code:
                                </InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl id="load-code" aria-describedby="load-code-text" />
                            </InputGroup>
                        </div>
                    </div>
                }
                <div className="row">
                    <div
                        className="btn btn-primary col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                        onClick={() => this.toggleDifficultyOptions()}
                        role="button">Change Difficulty
                    </div>
                </div>
                { !showDifficulty ? null :
                    <div className="row">
                        <ButtonGroup toggle
                            className="col-6 offset-3"
                            aria-label="Choose game difficulty level">
                            {radios.map((radio) => (
                                <ToggleButton
                                    key={radio.value}
                                    variant="info"
                                    value={radio.value}
                                    name={radio.name}
                                    type="radio"
                                    checked={difficulty === radio.value}
                                    onChange={this.changeDifficulty}>{radio.label}</ToggleButton>
                            ))}
                        </ButtonGroup>
                    </div>
                }
                <div className="row">
                    <div className="btn btn-primary col-6 col-lg-2 offset-3 offset-lg-5 my-4" role="button">How to Play</div>
                </div>
            </div>
        );
    }
}