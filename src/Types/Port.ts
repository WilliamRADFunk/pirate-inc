/**
 * Available ports in the game.
 */
export enum PortLocation {
    Nassau = "Nassau",
    NormanIsland = "Norman Island",
    PortRoyal = "Port Royal",
    Tortuga = "Tortuga"
}

/**
 * Interface of what a port must have to be a port.
 */
export interface Port {
    readonly connectedPorts: Port[];
    readonly name: PortLocation;
}