import React from "react";
import { ToggleButton, ButtonGroup, Dropdown, DropdownButton, FormControl, InputGroup } from "react-bootstrap";

import { Subscription } from "rxjs";

import styles from './StartMenu.module.scss';
import { gameManager } from "../../services/GameManager";
import { SceneLocation } from "../../Types/SceneLocation";

interface Props {}

interface State {
    difficulty: number;
    instructionsMode: boolean;
    sceneLocation: string;
    selectedInstruction: number;
    showDifficulty: boolean;
    showLoadCode: boolean;
}

interface ListOption {
    label: string;
    value: number;
}

export class StartMenu extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    public instructions: ListOption[] = [
        { label: 'Difficulty Modes', value: 0 },
        { label: 'How to Load a Saved Game', value: 1 },
        { label: 'Action Points', value: 2 },
        { label: 'Infamy', value: 3 },
    ];

    public radios: ListOption[] = [
        { label: 'Easy', value: 0 },
        { label: 'Normal', value: 1 },
        { label: 'Hard', value: 2 },
        { label: 'Impossible', value: 3 },
    ];

    constructor(props: Props) {
        super(props);

        this.state = {
            difficulty: 0,
            instructionsMode: false,
            sceneLocation: "",
            selectedInstruction: 0,
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

    public instructionSelected(event: any): void {
        const instructionKey = Number(event);
        this.setState({ selectedInstruction: instructionKey });
    }

    public toggleDifficultyOptions(): void {
        this.setState({ showDifficulty: !this.state.showDifficulty });
    }

    public toggleInstructionMode(): void {
        this.setState({ instructionsMode: !this.state.instructionsMode });
    }

    public toggleLoadCodeInput(): void {
        this.setState({ showLoadCode: !this.state.showLoadCode });
    }

    public render() {
        const {
            difficulty,
            instructionsMode,
            sceneLocation,
            selectedInstruction,
            showDifficulty,
            showLoadCode
        } = this.state;

        return (
            sceneLocation != SceneLocation.StartMenu ? null :
            <div className="boundaries col-12 col-lg-8 offset-lg-2 py-5">
                { instructionsMode ? null : <>
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
                                {this.radios.map((radio) => (
                                    <ToggleButton
                                        key={radio.value}
                                        variant="info"
                                        value={radio.value}
                                        name="DifficultyRadio"
                                        type="radio"
                                        checked={difficulty === radio.value}
                                        onChange={this.changeDifficulty}>{radio.label}</ToggleButton>
                                ))}
                            </ButtonGroup>
                        </div>
                    }
                </>} 
                <div className="row">
                    <div
                        className="btn btn-primary col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                        onClick={() => this.toggleInstructionMode()}
                        role="button">How to Play</div>
                </div>
                { !instructionsMode ? null :
                    <div className="row">
                        <DropdownButton
                            className={styles["instruction-dropdown-toggle"] + " col-6 offset-3 my-4 bg-info px-0"}
                            as={ButtonGroup}
                            key="instrunction-info"
                            id="instrunction-info-dropdown"
                            variant="info"
                            title={this.instructions[selectedInstruction].label}
                            onSelect={(e) => this.instructionSelected(e)}
                        >
                            {
                                this.instructions.map(instruction => (
                                    <Dropdown.Item
                                        className={"text-light " + (selectedInstruction === instruction.value ? styles["bg-selected"] : " bg-info")}
                                        eventKey={instruction.value}
                                        key={instruction.value}
                                        as="button"
                                        active={selectedInstruction === instruction.value}>{instruction.label}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>
                }
            </div>
        );
    }
}