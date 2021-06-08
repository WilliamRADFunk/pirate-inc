/**
 * Available ports in the game.
 */
export enum PortLocation {
    Bath = "Bath",
    CharlesTown = "Charles Town",
    Nassau = "Nassau",
    NormanIsland = "Norman Island",
    PortRoyal = "Port Royal",
    Tortuga = "Tortuga"
}

/**
 * Interface of what a port must have to be a port.
 */
export interface Port {
    connectedPorts: Port[];
    readonly costScaleSize: number;
    readonly shipyardOptions: { [key: number]: boolean };
    readonly isPiratePort: boolean;
    reputation: number;
    readonly name: PortLocation;
}