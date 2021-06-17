import { Ship } from "../Objects/Ships/Ship";

export interface CrewMember {
    avatar: string;
    deathBenefit: number;
    hasPaidDeathBenefit: boolean;
    isAlive: boolean;
    morale: number;
    nameFirst: string;
    nameLast: string;
    ship: Ship | null;
    turnsSinceDeath: number;
}