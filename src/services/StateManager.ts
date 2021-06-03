import { BehaviorSubject, Observable } from "rxjs";


export enum GameState {
    Start = 0,
    Intro = 1,
    Load = 2,
    Active = 3,
    GameOver = 4
}

export class StateManager {
    /**
     * The state of the overall game: Menu, Intro, Active, Game Over, etc..
     */
    private gameState: BehaviorSubject<GameState> = new BehaviorSubject(GameState.Start as GameState);

    public changeGameState(newState: GameState): void {
        const oldState = this.gameState.value;
        if (oldState === GameState.Start && (newState !== GameState.Intro && newState !== GameState.Load)) {
            return;
        }

        if (oldState === GameState.Load && (newState !== GameState.Start && newState !== GameState.Active)) {
            return;
        }

        if (oldState === GameState.Intro && newState !== GameState.Active) {
            return;
        }

        if (oldState === GameState.GameOver && newState !== GameState.Start) {
            return;
        }

        this.gameState.next(newState);
    }

    public getGameState(): Observable<GameState> {
        return this.gameState.asObservable();
    }
}

export const stateManager = new StateManager();