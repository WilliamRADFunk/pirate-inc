import React from "react";
import { Button, Col, Row } from "react-bootstrap";

import { Subscription } from "rxjs";

import { stateManager, GameState } from "../../../Services/StateManager";
import { StartMenuDifficulty } from "../StartMenuDifficulty/StartMenuDifficulty";
import { StartMenuInstructions } from "../StartMenuInstructions/StartMenuInstructions";
import { StartMenuLoad } from "../StartMenuLoad/StartMenuLoad";

interface Props {}

interface State {
    gameState: GameState;
    menuState: MenuState;
}

enum MenuState {
    LoadGame = 0,
    Difficulty = 1,
    Instructions = 2,
    MainMenu = 3
}

export class StartMenu extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            gameState: GameState.Start,
            menuState: MenuState.MainMenu,
        };
    }

    public componentDidMount() {
        // subscribe to all relevant player HUD data
        this.subscriptions.push(
            stateManager.getGameState().subscribe(gameState => {
                if (gameState) {
                    // add balance to local game state if number
                    this.setState({ gameState: gameState });
                }
            })
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public changeMenuState(mode: MenuState): void {
        this.setState({ menuState: mode });
    }

    public render() {
        const { gameState, menuState } = this.state;

        return (
            gameState !== GameState.Start ? null :
            <Col xs="12" lg={{ span: 8, offset: 2 }} className="boundaries py-5">
                { menuState !== MenuState.MainMenu ? null :
                    <>
                        <Row>
                            <Button
                                variant="primary"
                                className="col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                                onClick={() => this.startGame()}>Start Game
                            </Button>
                        </Row>
                        <Row>
                            <Button
                                variant="primary"
                                className="col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                                onClick={() => this.changeMenuState(MenuState.LoadGame)}>Load Game
                            </Button>
                        </Row>
                        <Row>
                            <Button
                                variant="primary"
                                className="col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                                onClick={() => this.changeMenuState(MenuState.Difficulty)}>Change Difficulty
                            </Button>
                        </Row>
                        <Row>
                            <Button
                                variant="primary"
                                className="col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                                onClick={() => this.changeMenuState(MenuState.Instructions)}>How to Play
                            </Button>
                        </Row>
                    </>
                }
                { menuState !== MenuState.LoadGame ? null :
                    <StartMenuLoad toggleView={() => this.changeMenuState(MenuState.MainMenu)}></StartMenuLoad>
                }
                { menuState !== MenuState.Difficulty ? null :
                    <StartMenuDifficulty toggleView={() => this.changeMenuState(MenuState.MainMenu)}></StartMenuDifficulty>
                }
                { menuState !== MenuState.Instructions ? null :
                    <StartMenuInstructions toggleView={() => this.changeMenuState(MenuState.MainMenu)}></StartMenuInstructions>
                }
            </Col>
        );
    }

    public startGame(): void {
        stateManager.changeGameState(GameState.Intro);
    }
}