import { OfficerType } from "../Objects/Officers/Officers";
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
    mood: MoodToMouth;
    morale: number;
    nameFirst: string;
    nameLast: string;
    nameNick: string;
    salary: number;
    skills: { [key: string]: OfficerSkill<string> }
    type: OfficerType;
}

export interface Carpenter extends Officer {
    skills: {
        repair: OfficerSkill<'Repair'>;
        diyMedicine: OfficerSkill<'DIY Medicine'>;
    };
    type: OfficerType.Carpenter;
}

export interface Doctor extends Officer {
    skills: {
        medicine: OfficerSkill<'Medicine'>;
    };
    type: OfficerType.Doctor;
}

export interface Quartermaster extends Officer {
    skills: {
        cargoDistribution: OfficerSkill<'Cargo Distribution'>;
        humanResourcing: OfficerSkill<'Human Resources'>;
        moraleManagement: OfficerSkill<'Morale Management'>;
    };
    type: OfficerType.Quartermaster;
}