import React from 'react';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HireableCrew } from '../../../Objects/Crew/HireableCrew';
import { portManager } from '../../../Services/PortManager';

import { CrewMember } from '../../../Types/CrewMember';
import { Port } from '../../../Types/Port';

interface Props {}

interface State {
    eligibleCrew: CrewMember[];
    currentPort: Port;
}

export class HireCrew extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            eligibleCrew: [],
            currentPort: 
        };

        this.subscriptions.push(
            portManager.getCurrentPort().subscribe(port => {
                this.setState({ currentPort: port });
            })
        );
    }

    public hireCrew(crew: CrewMember[]): CrewMember[] {
        // TODO: Make sure the suggested crew member are actually present.
        // TODO: Remove the listed crew members from the eligibleCrew.
        return crew.slice();
    }
}