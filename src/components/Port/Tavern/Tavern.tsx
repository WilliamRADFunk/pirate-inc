import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

import { Subscription } from 'rxjs';
import { PortSceneState, stateManager } from '../../../Services/StateManager';
import { HireCrew } from '../HireCrew/HireCrew';

interface Props {}

interface State {
    portSceneState: PortSceneState;
}

export class Tavern extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            portSceneState: PortSceneState.Menu
        };
    }

    private toggleMode(): void {
        const currState = this.state.portSceneState;
        if (currState !== PortSceneState.TavernOptions) {
            stateManager.changePortSceneState(PortSceneState.TavernOptions);
        } else {
            stateManager.changePortSceneState(PortSceneState.Menu);
        }
    }
    
    public componentDidMount() {
        // subscribe to all relevant player HUD data
        this.subscriptions.push(
            stateManager.getPortSceneState().subscribe(state => {
                this.setState({ portSceneState: state });
            }),
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public render() {
        const { portSceneState } = this.state;
        return (
            <div className='w-100 h-100 text-dark'>
                <Row className='mb-2 no-gutters'>
                    <Col xs={{ span: 6, offset: 3 }}
                        aria-label='Tavern section'
                        className='text-center clickable double-line-headers'
                        onClick={() => this.toggleMode()}>
                        <span>Tavern</span>
                    </Col>
                    <Button
                        variant='link'
                        className='border-0 col-2 text-dark'
                        onClick={() => this.toggleMode()}>
                        { portSceneState !== PortSceneState.TavernOptions
                            ? <Eye></Eye>
                            : <EyeSlash></EyeSlash>
                        }
                    </Button>
                </Row>
                { (PortSceneState.TavernBuySupplies <= portSceneState && portSceneState <= PortSceneState.TavernHireOfficers) || portSceneState === PortSceneState.TavernOptions
                    ? null
                    : <img
                        src='images/tavern-icon.png'
                        alt='tavern icon'
                        width='50%'
                        height='50%'
                        className='small-square-icon'
                        onClick={() => this.toggleMode()}/>
                }
                { portSceneState !== PortSceneState.TavernOptions ? null : <>
                    <Row className='no-gutters'>
                        <Button
                            aria-label='Open tavern buy supplies section'
                            variant='link'
                            className='col-12 text-dark fs-md my-4'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.TavernBuySupplies)}>
                            Buy Supplies
                        </Button>
                    </Row>
                    <Row className='no-gutters'>
                        <Button
                            aria-label='Open tavern hire crew section'
                            variant='link'
                            className='col-4 offset-1 text-dark fs-md my-4'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.TavernHireCrew)}>
                            Hire Crew
                        </Button>
                        <Button
                            aria-label='Open tavern hire officers section'
                            variant='link'
                            className='col-5 offset-1 text-dark fs-md my-4'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.TavernHireOfficers)}>
                            Hire Officers
                        </Button>
                    </Row>
                </>}
                { portSceneState !== PortSceneState.TavernBuySupplies ? null :
                    <Row className='no-gutters'>
                        <Col
                            aria-label='Tavern buy supplies section description'
                            className='fs-sm text-left'>
                            Buy some supplies
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.TavernHireCrew ? null :
                    <Row className='no-gutters'>
                        <Col
                            aria-label='Tavern hire crew section description'
                            className='fs-sm text-left'>
                            <HireCrew></HireCrew>
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.TavernHireOfficers ? null :
                    <Row className='no-gutters'>
                        <Col
                            aria-label='Tavern hire officers section description'
                            className='fs-sm text-left'>
                            Which officer position are trying to fill?
                        </Col>
                    </Row>
                }
            </div>);
    }
}