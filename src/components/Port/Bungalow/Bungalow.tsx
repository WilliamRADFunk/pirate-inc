import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

import { Subscription } from 'rxjs';
import { PortSceneState, stateManager } from '../../../Services/StateManager';
import { CrewManifest } from '../CrewManifest/CrewManifest';

interface Props {}

interface State {
    portSceneState: PortSceneState;
}

export class Bungalow extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            portSceneState: PortSceneState.Menu
        };
    }

    private toggleMode(): void {
        const currState = this.state.portSceneState;
        if (currState !== PortSceneState.BungalowOptions) {
            stateManager.changePortSceneState(PortSceneState.BungalowOptions);
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
                <Row className='mb-2'>
                    <Col xs={{ span: 6, offset: 3 }}
                        aria-label='Bungalow section'
                        className='text-center clickable'
                        onClick={() => this.toggleMode()}>
                        Bungalow
                    </Col>
                    <Button
                        variant='link'
                        className='border-0 col-2 text-dark'
                        onClick={() => this.toggleMode()}>
                        { portSceneState !== PortSceneState.BungalowOptions
                            ? <Eye></Eye>
                            : <EyeSlash></EyeSlash>
                        }
                    </Button>
                </Row>
                { (PortSceneState.BungalowCrewManifest <= portSceneState && portSceneState <= PortSceneState.BungalowShipManifest) || portSceneState === PortSceneState.BungalowOptions
                    ? null
                    : <img
                        src='images/bungalow-icon.png'
                        alt='bungalow icon'
                        width='50%'
                        height='50%'
                        className='small-square-icon'
                        onClick={() => this.toggleMode()}/>
                }
                { portSceneState !== PortSceneState.BungalowOptions ? null :
                    <Row>
                        <Button
                            aria-label='Open colonial office crew manifest section'
                            variant='link'
                            size="lg"
                            className='col-4 col-xl-5 offset-1 text-dark my-4 fs-md text-xl-left'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.BungalowCrewManifest)}>
                            Crew Manifest
                        </Button>
                        <Button
                            aria-label='Open colonial office gather intel section'
                            variant='link'
                            size="lg"
                            className='col-4 col-xl-5 offset-2 offset-xl-1 text-dark my-4 fs-md'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.BungalowGatherIntel)}>
                            Gather Intel
                        </Button>
                        <Button
                            aria-label='Open colonial office purchase officer summaries section'
                            variant='link'
                            size="lg"
                            className='col-xl-6 col-4 offset-1 text-dark my-4 fs-md text-xl-left mr-xl-0 ml-xl-4 pr-xl-0'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.BungalowOfficerSummaries)}>
                            Officer Summaries
                        </Button>
                        <Button
                            aria-label='Open colonial office purchase fleet manifest section'
                            variant='link'
                            size="lg"
                            className='col-4 col-xl-5 offset-2 offset-xl-1 text-dark my-4 fs-md mx-xl-0'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.BungalowShipManifest)}>
                            Fleet Manifest
                        </Button>
                    </Row>
                }
                { portSceneState !== PortSceneState.BungalowCrewManifest ? null :
                    <Row>
                        <Col
                            aria-label='Bungalow buy suplies section description'
                            className='fs-sm text-left'>
                            <CrewManifest></CrewManifest>
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.BungalowGatherIntel ? null :
                    <Row>
                        <Col
                            aria-label='Bungalow hire crew section description'
                            className='fs-sm text-left'>
                            Here are a number of ways to get intelligence about various aspects of the pirate life.
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.BungalowOfficerSummaries ? null :
                    <Row>
                        <Col
                            aria-label='Bungalow fire officers section description'
                            className='fs-sm text-left'>
                            Here is the list of your officers. See their associated stats and backgrounds.
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.BungalowShipManifest ? null :
                    <Row>
                        <Col
                            aria-label='Bungalow hire officers section description'
                            className='fs-sm text-left'>
                            This is your fleet. See all the details, armaments, and cargo carried for each ship.
                        </Col>
                    </Row>
                }
            </div>);
    }
}