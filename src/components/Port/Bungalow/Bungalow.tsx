import React from 'react';
import { Button, Col, OverlayTrigger, Row } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { ImExit } from 'react-icons/im';
import { MdHelpOutline } from 'react-icons/md';

import styles from './Bungalow.module.scss';
import { Subscription } from 'rxjs';
import { PortSceneState, stateManager } from '../../../Services/StateManager';
import { CrewManifest } from '../CrewManifest/CrewManifest';
import { GUID } from '../../../Helpers/GUID';
import { gameManager } from '../../../Services/GameManager';
import { OfficersManifest } from '../OfficersManifest/OfficersManifest';
import { RenderTooltip } from '../../../Helpers/Tooltip';

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
                { portSceneState !== PortSceneState.BungalowOptions && (portSceneState >= PortSceneState.BungalowCrewManifest && portSceneState <= PortSceneState.BungalowShipManifest) ? null :
                    <Row className='no-gutters'>
                        <Col xs={{ span: 6, offset: 3 }}
                            aria-label='Bungalow section'
                            className='text-center clickable double-line-headers'
                            onClick={() => this.toggleMode()}>
                            <span>Bungalow</span>
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
                }
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
                    <Row className='no-gutters'>
                        <Button
                            aria-label='Open bungalow crew manifest section'
                            variant='link'
                            size="lg"
                            className='col-4 offset-1 text-dark my-4 fs-md'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.BungalowCrewManifest)}>
                            Crew
                        </Button>
                        <Button
                            aria-label='Open bungalow intel section'
                            variant='link'
                            size="lg"
                            className='col-4 offset-2 text-dark my-4 fs-md'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.BungalowGatherIntel)}>
                            Intel
                        </Button>
                        <Button
                            aria-label='Open bungalow purchase officers section'
                            variant='link'
                            size="lg"
                            className='col-4 offset-1 text-dark my-4 fs-md'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.BungalowOfficerSummaries)}>
                            Officers
                        </Button>
                        <Button
                            aria-label='Open bungalow purchase fleet section'
                            variant='link'
                            size="lg"
                            className='col-4 offset-2 text-dark my-4 fs-md'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.BungalowShipManifest)}>
                            Fleet
                        </Button>
                    </Row>
                }
                { portSceneState !== PortSceneState.BungalowCrewManifest ? null :
                    <Row className="manifest no-gutters">
                        <Col
                            aria-label='Bungalow crew manifest section'
                            className='fs-sm text-left'>
                            <CrewManifest>
                                <OverlayTrigger rootClose
                                    key={GUID()}
                                    placement="top"
                                    delay={{ show: 100, hide: 250 }}
                                    overlay={RenderTooltip({
                                        children: 'Access help for this section'
                                    })}>
                                    {({ ref, ...triggerHandler }) => ( 
                                        <Button
                                            {...triggerHandler }
                                            ref={ref}
                                            variant='link'
                                            aria-label='Open help modal for deeper description of crew manifest section'
                                            className={ styles['help-icon'] + ' border-0 text-dark' }
                                            onClick={() => gameManager.openHelpModal('Crew Manifest - Port')}>
                                            <MdHelpOutline></MdHelpOutline>
                                        </Button>
                                     )}
                                </OverlayTrigger>
                                <OverlayTrigger rootClose
                                    key={GUID()}
                                    placement="top"
                                    delay={{ show: 100, hide: 250 }}
                                    overlay={RenderTooltip({
                                        children: 'Return to main port options'
                                    })}>
                                    {({ ref, ...triggerHandler }) => ( 
                                        <Button
                                            {...triggerHandler }
                                            ref={ref}
                                            variant='link'
                                            aria-label='Return to port options'
                                            className={ styles['exit-icon'] + ' border-0 text-dark' }
                                            onClick={() => this.toggleMode()}>
                                            <ImExit></ImExit>
                                        </Button>
                                     )}
                                </OverlayTrigger>
                            </CrewManifest>
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.BungalowGatherIntel ? null :
                    <Row className='no-gutters'>
                        <Col
                            aria-label='Bungalow hire crew section description'
                            className='fs-sm text-left'>
                            Here are a number of ways to get intelligence about various aspects of the pirate life.
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.BungalowOfficerSummaries ? null :
                    <Row className='manifest no-gutters'>
                        <Col
                            aria-label='Bungalow officers manifest section'
                            className='fs-sm text-left'>
                            <OfficersManifest>
                                <OverlayTrigger rootClose
                                    key={GUID()}
                                    placement="top"
                                    delay={{ show: 100, hide: 250 }}
                                    overlay={RenderTooltip({
                                        children: 'Access help for this section'
                                    })}>
                                    {({ ref, ...triggerHandler }) => ( 
                                        <Button
                                            {...triggerHandler }
                                            ref={ref}
                                            variant='link'
                                            aria-label='Open help modal for deeper description of officers manifest section'
                                            className={ styles['help-icon'] + ' border-0 text-dark' }
                                            onClick={() => gameManager.openHelpModal('Officers Manifest - Port')}>
                                            <MdHelpOutline></MdHelpOutline>
                                        </Button>
                                    )}
                                </OverlayTrigger>
                                <OverlayTrigger rootClose
                                    key={GUID()}
                                    placement="top"
                                    delay={{ show: 100, hide: 250 }}
                                    overlay={RenderTooltip({
                                        children: 'Return to main port options'
                                    })}>
                                    {({ ref, ...triggerHandler }) => ( 
                                        <Button
                                            {...triggerHandler }
                                            ref={ref}
                                            variant='link'
                                            aria-label='Return to port options'
                                            className={ styles['exit-icon'] + ' border-0 text-dark' }
                                            onClick={() => this.toggleMode()}>
                                            <ImExit></ImExit>
                                        </Button>
                                    )}
                                </OverlayTrigger>
                            </OfficersManifest>
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.BungalowShipManifest ? null :
                    <Row className='no-gutters'>
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