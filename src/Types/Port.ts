export enum PortLocation {
    Nassau = "Nassau",
    NormanIsland = "Norman Island",
    PortRoyal = "Port Royal",
    Tortuga = "Tortuga"
}

export interface Port {
    readonly connectedPorts: Port[];
    readonly name: PortLocation;
}