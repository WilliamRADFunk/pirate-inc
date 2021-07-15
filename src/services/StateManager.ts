import { BehaviorSubject, Observable } from "rxjs";

/**
 * The main game status to control game flow from starting to playing to ending.
 */
 export enum GameState {
    Start = 0,
    Intro = 1,
    Load = 2,
    Active = 3,
    GameOver = 4
}

/**
 * The port scene status to control game flow while in a port.
 */
 export enum PortSceneState {
    Menu = 0,
    BungalowOptions = 1,
    ColonialOfficeOptions = 2,
    ShipyardOptions = 3,
    TavernOptions = 4,
    Event = 5,
    Trial = 6,
    BungalowCrewManifest = 7,
    BungalowGatherIntel = 8,
    BungalowOfficerSummaries = 9,
    BungalowShipManifest = 10,
    ColonialOfficeBribe = 11,
    ColonialOfficeRoyalPardon = 12,
    ColonialOfficeWritOfProtection = 13,
    ShipyardBuy = 14,
    ShipyardOutfit = 15,
    ShipyardRepair = 16,
    ShipyardSell = 17,
    TavernProvisions = 18,
    TavernFence = 19,
    TavernHireCrew = 20,
    TavernHireOfficers = 21
}

/**
 * Available types of scene state, or game location modes.
 */
 export enum SceneState {
    AtSea = "At Sea",
    Battle = "Battle",
    Other = "Other",
    Port = "Port"
}

// Singleton to control the various states of the game.
class StateManager {
    /**
     * The state of the overall game: Menu, Intro, Active, Game Over, etc..
     */
    private gameState: BehaviorSubject<GameState> = new BehaviorSubject(GameState.Start as GameState);
    /**
     * The state of the port scene.
     */
    private portSceneState: BehaviorSubject<PortSceneState> = new BehaviorSubject(PortSceneState.Menu as PortSceneState);

    /**
     * Tracks user's scene location, mostly for identifying which controls to make available on screen.
     */
    private sceneState: BehaviorSubject<SceneState> = new BehaviorSubject(SceneState.Port as SceneState);

    /**
     * Changes to different game state if new state is an allowed transition from current state.
     * @param newState the new game state to transition to.
     */
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
    
    /**
     * Changes to different port scene state if new state is an allowed transition from current state.
     * @param newState the new port scene state to transition to.
     */
    public changePortSceneState(newState: PortSceneState, leaving?: boolean): void {
        // TODO: Check if valid transition.
        this.portSceneState.next(newState);
        // If optional leaving was set, SceneState should be updated as well to be "at sea".
        if (leaving) {
            this.sceneState.next(SceneState.AtSea);
        }
    }

    /**
     * Allows subscribing to the game's main state.
     * @returns observable of the game's current main state.
     */
    public getGameState(): Observable<GameState> {
        return this.gameState.asObservable();
    }

    /**
     * Allows subscribing to the port scene's state.
     * @returns observable of the port scene's current main state.
     */
    public getPortSceneState(): Observable<PortSceneState> {
        return this.portSceneState.asObservable();
    }

    /**
     * Get the current scene state (ie. Port, AtSea, Battle, etc.).
     * @returns observable of current scene state
     */
    public getSceneState(): Observable<SceneState> {
        return this.sceneState.asObservable();
    }
}

/**
 * Singleton to control the various states of the game.
 */
export const stateManager = new StateManager();