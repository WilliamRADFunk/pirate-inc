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
    readonly colonialOptions: { [key: number]: boolean };
    readonly connectedPorts: Port[];
    readonly costScaleSize: number;
    readonly isPiratePort: boolean;
    readonly name: PortLocation;
    reputation: number;
    readonly shipyardOptions: { [key: number]: boolean };
    readonly tavernOptions: { [key: number]: boolean };
}