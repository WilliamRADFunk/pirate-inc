import { SceneLocation } from '../Types/SceneLocation';

class GameManager {
    /**
     * Tracks user's scene location, mostly for identifying which controls to make available on screen.
     */
    private sceneLocation: SceneLocation = SceneLocation.StartMenu;

    /**
     * Constructor for the singleton containing all the game instance information.
     */
    constructor() {

    }

    public getSceneLocation(): SceneLocation {
        return this.sceneLocation;
    }
}

export const gameManager = new GameManager();