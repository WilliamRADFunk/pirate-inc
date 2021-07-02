import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HireableCrew } from '../../../Objects/Crew/HireableCrew';
import { portManager } from '../../../Services/PortManager';

import { CrewMember } from '../../../Types/CrewMember';
import { Port } from '../../../Types/Port';

interface Props {}

interface State {
    currentPort: Port | null;
    hireableCrew: HireableCrew;
    recruits: CrewMember[];
}

export class HireCrew extends React.Component<Props, State> {
    private subscriptions: Subscription[] = []; // [Port, HireableCrew, Recruits]

    constructor(props: Props) {
        super(props);

        this.state = {
            hireableCrew: new HireableCrew(),
            currentPort: null,
            recruits: []
        };
    }

    private hireCrew(crew: CrewMember[]): CrewMember[] {
        // TODO: Make sure the suggested crew member are actually present.
        // TODO: Remove the listed crew members from the eligibleCrew.
        return crew.slice();
    }

    public componentDidMount() {
        this.subscriptions[0] = portManager.getCurrentPort()
            .pipe(filter(port => !!port))
            .subscribe(port => {
                this.subscriptions[1].unsubscribe();
                this.setState({ currentPort: port });
                this.subscriptions[1] = port.availableCrewToHire.subscribe(hireableCrew => {
                    this.subscriptions[2].unsubscribe();
                    this.setState({ hireableCrew: hireableCrew });
                    this.subscriptions[2] = hireableCrew.getCrew().subscribe(recruits => {
                        this.setState({ recruits });
                    });
                });
            });
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public render() {
        const { recruits } = this.state;
        return (
            <Row className='mb-2 no-gutters'>
                <Col xs='12' aria-label='Crew Manifest section' className='text-center'>
                    Hire Crew
                    <br/><br/>
                    Select specific crew members to hire, or let the quartemaster pick automatically given a number.
                    <br/><br/>
                </Col>
            </Row>
        );
    }
}