import React from "react";
import { ToggleButton, ButtonGroup } from "react-bootstrap";

import { Subscription } from "rxjs";
import { gameManager } from "../../services/GameManager";
import { SceneLocation } from "../../Types/SceneLocation";

interface Props {}

interface State {
    difficulty: number;
    sceneLocation: string;
    showDifficulty: boolean;
}

export class StartMenu extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            difficulty: 0,
            sceneLocation: "",
            showDifficulty: false
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

    public render() {
        const { difficulty, sceneLocation, showDifficulty } = this.state;

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
                        role="button">Load Game
                    </div>
                </div>
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
                            <ToggleButton
                                key="0"
                                variant="info"
                                value="0"
                                name="radio"
                                type="radio"
                                checked={difficulty === 0}
                                onChange={this.changeDifficulty}>Easy</ToggleButton>
                            <ToggleButton
                                key="1"
                                variant="info"
                                value="1"
                                name="radio"
                                type="radio"
                                checked={difficulty === 1}
                                onChange={this.changeDifficulty}>Normal</ToggleButton>
                            <ToggleButton
                                key="2"
                                variant="info"
                                value="2"
                                name="radio"
                                type="radio"
                                checked={difficulty === 2}
                                onChange={this.changeDifficulty}>Hard</ToggleButton>
                            <ToggleButton
                                key="3"
                                variant="info"
                                value="3"
                                name="radio"
                                type="radio"
                                checked={difficulty === 3}
                                onChange={this.changeDifficulty}>Impossible</ToggleButton>
                        </ButtonGroup>
                        {/* <div
                            className="btn-group btn-group-toggle col-6 offset-3"
                            data-toggle="buttons">
                            <label className="btn btn-info active">
                                <input
                                    type="radio"
                                    name="options"
                                    id="option1"
                                    value="0"
                                    autoComplete="off"
                                    onChange={this.changeDifficulty}
                                    checked={difficulty === 0}/>Easy
                            </label>
                            <label className="btn btn-info">
                                <input
                                    type="radio"
                                    name="options"
                                    id="option2"
                                    value="1"
                                    autoComplete="off"
                                    onChange={this.changeDifficulty}
                                    checked={difficulty === 1}/>Normal
                            </label>
                            <label className="btn btn-info">
                                <input
                                    type="radio"
                                    name="options"
                                    id="option3"
                                    value="2"
                                    autoComplete="off"
                                    onChange={this.changeDifficulty}
                                    checked={difficulty === 2}/>Hard
                            </label>
                            <label className="btn btn-info">
                                <input
                                    type="radio"
                                    name="options"
                                    id="option4"
                                    value="3"
                                    autoComplete="off"
                                    onChange={this.changeDifficulty}
                                    checked={difficulty === 3}/>Impossible
                            </label>
                        </div> */}
                    </div>
                }
                <div className="row">
                    <div className="btn btn-primary col-6 col-lg-2 offset-3 offset-lg-5 my-4" role="button">How to Play</div>
                </div>
            </div>
        );
    }
}