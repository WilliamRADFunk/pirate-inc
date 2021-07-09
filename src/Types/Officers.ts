import { ConcernTypes, Features, MoodToMouth } from "./People";

export interface OfficerSkill<T> {
    label: T;
    rank: number;
}

export interface Officer {
    avatar: string;
    background: string;
    concern: ConcernTypes;
    features: Features;
    id: string;
    isAlive: boolean;
    mood: MoodToMouth;
    morale: number;
    nameFirst: string;
    nameLast: string;
    nameNick: string;
    salary: number;
    skills: { [key: string]: OfficerSkill<string> }
}

export interface Carpenter extends Officer {
    skills: {
        repair: OfficerSkill<'Repair'>;
        diyMedicine: OfficerSkill<'DIY Medicine'>;
    };
}

export interface Doctor extends Officer {
    skills: {
        medicine: OfficerSkill<'Medicine'>;
    };
}

export interface Quartermaster extends Officer {
    skills: {
        cargoDistribution: OfficerSkill<'Cargo Distribution'>;
        humanResourcing: OfficerSkill<'Human Resources'>;
        moraleManagement: OfficerSkill<'Morale Management'>;
    };
}