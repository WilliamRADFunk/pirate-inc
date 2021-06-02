import React from "react";

import { Subscription } from "rxjs";

import { gameManager, GameState } from "../../../services/GameManager";
import { SceneLocation } from "../../../Types/SceneLocation";
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
            gameManager.getGameState().subscribe(gameState => {
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
            <div className="boundaries col-12 col-lg-8 offset-lg-2 py-5">
                { menuState !== MenuState.MainMenu ? null :
                    <>
                        <div className="row">
                            <div
                                className="btn btn-primary col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                                onClick={() => this.startGame()}
                                role="button">Start Game
                            </div>
                        </div>
                        <div className="row">
                            <div
                                className="btn btn-primary col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                                onClick={() => this.changeMenuState(MenuState.LoadGame)}
                                role="button">Load Game
                            </div>
                        </div>
                        <div className="row">
                            <div
                                className="btn btn-primary col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                                onClick={() => this.changeMenuState(MenuState.Difficulty)}
                                role="button">Change Difficulty
                            </div>
                        </div>
                        <div className="row">
                            <div
                                className="btn btn-primary col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                                onClick={() => this.changeMenuState(MenuState.Instructions)}
                                role="button">How to Play
                            </div>
                        </div>
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
            </div>
        );
    }

    public startGame(): void {
        gameManager.changeGameState(GameState.Intro);
    }
}