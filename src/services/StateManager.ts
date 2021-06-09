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
    Event = 1,
    Trial = 2,
    BungalowShipManifest = 3,
    BungalowCrewManifest = 4,
    BungalowGatherIntel = 5,
    BungalowOfficerSummaries = 6,
    ShipyardBuy = 7,
    ShipyardSell = 8,
    ShipyardRepair = 9,
    ShipyardOutfit = 10,
    TavernFireCrew = 11,
    TavernHireCrew = 12,
    TavernFireOfficers = 13,
    TavernHireOfficers = 14,
    TavernBuySupplies = 15,
    ColonialOfficeBribe = 16,
    ColonialOfficeRoyalPardon = 17,
    ColonialOfficeWritOfProtection = 18
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
    public changePortSceneState(newState: GameState): void {

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