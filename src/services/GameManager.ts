import { SceneLocation } from '../Types/SceneLocation';

class GameManager {
    /**
     * The amount of money the player has at their disposal.
     */
    private balance: number = 10000;
    /**
     * The bounty placed on player's head.
     */
    private bounty: number = 500;
    /**
     * The salary paid per turn to your fleet's carpenter.
     */
    private carpenterSalary: number = 200;
    /**
     * The cost per turn of a single crew member.
     */
    private crewWage: number = 100;
    /**
     * The number of crew members on player's payroll.
     */
    private currentCrewCount: number = 12;
    /**
     * The salary paid per turn to your fleet's doctor.
     */
    private doctorSalary: number = 400;
    /**
     * The infamy associated with player.
     */
    private infamy: number = 37;
    /**
     * The maximum number of crew members on player can employee (limited by size and number of ships owned).
     */
    private maxCrewCount: number = 25;
    /**
     * The salary paid per turn to your fleet's quartermaster.
     */
     private quartermasterSalary: number = 300;
    /**
     * The number of action points player has left for their turn.
     */
    private remainingActionPoints: number = 5;
    /**
     * Tracks user's scene location, mostly for identifying which controls to make available on screen.
     */
    private sceneLocation: SceneLocation = SceneLocation.StartMenu;
    /**
     * The number of ships the player owns.
     */
    private shipCount: number = 3;
    /**
     * The number of total action points player is capable of having in a given turn.
     */
    private totalActionPoints: number = 5;
    /**
     * The number of total food units of each category that player owns.
     */
    private totalProvisions: [number, number, number] = [132, 74, 13];

    public getBalance(): number {
        return this.balance;
    }

    public getCrewWages(): number {
        return this.crewWage * this.getCurrentCrewCount();
    }

    public getCurrentCrewCount(): number {
        return this.currentCrewCount;
    }

    public getInfamy(): number {
        return this.infamy;
    }

    public getMaxCrewCount(): number {
        return this.maxCrewCount;
    }

    public getOfficerSalaries(): number {
        return this.carpenterSalary + this.doctorSalary + this.quartermasterSalary;
    }

    public getPlayerBounty(): number {
        return this.bounty;
    }

    public getProvisions(): [number, number, number] {
        return this.totalProvisions.slice() as [number, number, number];
    }

    public getRemainingActionPoints(): number {
        return this.remainingActionPoints;
    }

    public getSceneLocation(): SceneLocation {
        return this.sceneLocation;
    }

    public getShipCount(): number {
        return this.shipCount;
    }

    public getTotalActionPoints(): number {
        return this.totalActionPoints;
    }
}

export const gameManager = new GameManager();