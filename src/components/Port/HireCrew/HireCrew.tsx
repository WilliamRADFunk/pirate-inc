import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HireableCrew } from '../../../Objects/Crew/HireableCrew';
import { portManager } from '../../../Services/PortManager';

import styles from './HireCrew.module.scss';
import { CrewMember } from '../../../Types/CrewMember';
import { Port } from '../../../Types/Port';

interface Props {}

interface State {
    currentIndex: number;
    currentPort: Port | null;
    hireableCrew: HireableCrew;
    recruits: CrewMember[];
}

export class HireCrew extends React.Component<Props, State> {
    private subscriptions: Subscription[] = []; // [Port, HireableCrew, Recruits]

    constructor(props: Props) {
        super(props);

        this.state = {
            currentIndex: 0,
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
                this.subscriptions[1]?.unsubscribe();
                this.setState({ currentPort: port });
                this.subscriptions[1] = port.availableCrewToHire.subscribe(hireableCrew => {
                    this.subscriptions[2]?.unsubscribe();
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
                <Col xs='12' aria-label='Crew Manifest section' className='text-center text-light'>
                    <br/><br/>
                    Hire Crew
                    <br/><br/>
                    { !recruits?.length ? null :
                        <div
                            className={ styles['avatar-sizing'] }
                            dangerouslySetInnerHTML={{__html: recruits[0].avatar}}></div>
                    }
                    <div style={{ minHeight: '32vw', position: 'relative', width: '100%' }}>
                        <div style={{ marginLeft: '5%', minHeight: '50px', position: 'absolute', top: 0, width: '90%', zIndex: 10 }}>
                            <img src='images/tavern-table.svg' alt='tavern table' style={{ width: '90%' }}/>
                        </div>
                        <div style={{ marginLeft: '5%', minHeight: '50px', position: 'absolute', top: '-38px', width: '90%', zIndex: 20 }}>
                            <img src='images/rope-border-square.png' alt='recruit stat parchment' style={{ transform: 'rotateX(30deg)', width: '25%' }}/>
                        </div>
                    </div>
                </Col>
            </Row>
        );
    }
}