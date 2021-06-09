import { Port, PortLocation } from "../Types/Port";

export class PortManager {
    /**
     * List of all the port object player can visit and interact with.
     */
    private ports: Port[] = [];

    constructor() {
        // Creates all the ports.
        this.ports.push(
            {
                colonialOptions: {
                    1: true, // Bribe
                    2: true, // Writ of Protection
                    3: false, // Royal Pardon
                },
                connectedPorts: [],
                costScaleSize: 7,
                shipyardOptions: {
                    1: true, // Buy
                    2: true, // Sell
                    3: true, // Repair
                    4: false // Outfit
                },
                isPiratePort: false,
                reputation: 0,
                name: PortLocation.Bath
            },
            {
                colonialOptions: {
                    1: true,
                    2: true,
                    3: false,
                },
                connectedPorts: [],
                costScaleSize: 8,
                shipyardOptions: {
                    1: false,
                    2: true,
                    3: true,
                    4: true
                },
                isPiratePort: false,
                reputation: 0,
                name: PortLocation.CharlesTown
            },
            {
                colonialOptions: {
                    1: true,
                    2: true,
                    3: false,
                },
                connectedPorts: [],
                costScaleSize: 5,
                shipyardOptions: {
                    1: true,
                    2: true,
                    3: true,
                    4: true
                },
                isPiratePort: true,
                reputation: 0,
                name: PortLocation.Nassau
            },
            {
                colonialOptions: {
                    1: true,
                    2: false,
                    3: false,
                },
                connectedPorts: [],
                costScaleSize: 3,
                shipyardOptions: {
                    1: false,
                    2: true,
                    3: true,
                    4: true
                },
                isPiratePort: true,
                reputation: 0,
                name: PortLocation.NormanIsland
            },
            {
                colonialOptions: {
                    1: false,
                    2: false,
                    3: true,
                },
                connectedPorts: [],
                costScaleSize: 10,
                shipyardOptions: {
                    1: true,
                    2: false,
                    3: true,
                    4: true
                },
                isPiratePort: false,
                reputation: 0,
                name: PortLocation.PortRoyal
            },
            {
                colonialOptions: {
                    1: false,
                    2: false,
                    3: false,
                },
                connectedPorts: [],
                costScaleSize: 2,
                shipyardOptions: {
                    1: false,
                    2: false,
                    3: true,
                    4: false
                },
                isPiratePort: true,
                reputation: 0,
                name: PortLocation.Tortuga
            }
        );
    }    

    /**
     * Called each turn and either degrades or improves the player's reputation with each port depending on their affiliation.
     * @param infamy amount of infamy player currently has.
     * @param crownFavor amount of crown favor the player currently has.
     */
    public updatePortReputation(infamy: number, crownFavor: number): void {
        this.ports.forEach(port => {
            port.reputation += port.isPiratePort ? (infamy - crownFavor) / 100 : (crownFavor - infamy) / 100;
        });
    }
}