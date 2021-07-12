import React from 'react';
import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { ImExit } from 'react-icons/im';
import { MdHelpOutline } from 'react-icons/md';

import styles from './Tavern.module.scss';
import { Subscription } from 'rxjs';
import { PortSceneState, stateManager } from '../../../Services/StateManager';
import { HireCrew } from '../HireCrew/HireCrew';
import { playerManager } from '../../../Services/PlayerManager';
import { GUID } from '../../../Helpers/GUID';
import { gameManager } from '../../../Services/GameManager';

interface Props {}

interface State {
    actionPoints: number;
    crewCount: number;
    maxCrew: number;
    portSceneState: PortSceneState;
}

function renderTooltip(props: any): JSX.Element {
    const id = `tooltip-${GUID()}`;
    return (
        <Tooltip id={ id }>
            { props.children }
        </Tooltip>
    );
}

export class Tavern extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            actionPoints: 0,
            crewCount: 0,
            maxCrew: 0,
            portSceneState: PortSceneState.Menu
        };
    }

    private _hasActionPoints(): boolean {
        return this.state.actionPoints > 0;
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
            playerManager.getRemainingActionPoints().subscribe(ac => {
                this.setState({ actionPoints: ac });
            }),
            gameManager.getMaxCrewCount().subscribe(maxC => {
                this.setState({ maxCrew: maxC });
            }),
            gameManager.getCrew().subscribe(crew => {
                this.setState({ crewCount: crew.length });
            })
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public render() {
        const { crewCount, maxCrew, portSceneState } = this.state;
        const maxCrewReached = crewCount >= maxCrew;
        const actionPoints = this._hasActionPoints();
        return (
            <div className='w-100 h-100 text-dark'>
                { (portSceneState !== PortSceneState.TavernOptions && portSceneState >= PortSceneState.TavernBuySupplies) ? null :
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
                }
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
                        <OverlayTrigger rootClose
                            key={GUID()}
                            placement="top"
                            delay={{ show: 100, hide: 250 }}
                            overlay={renderTooltip({
                                children: `${ actionPoints
                                    ? 'Hire crew one at a time, and risk using an action point per recruit'
                                    : maxCrewReached
                                        ? 'You have reached the maximum crew your ships can carry'
                                        : 'You need at least 1 Action Point to hire crew' }`
                            })}>
                            {({ ref, ...triggerHandler }) => (
                                <div className='col-4 offset-1 my-4'>
                                    <Button ref={ ref } {...triggerHandler}
                                        aria-disabled={ (actionPoints || maxCrewReached) ? false : true }
                                        aria-label='Open tavern hire crew section'
                                        variant='link'
                                        className={ actionPoints ? 'fs-md text-dark' : styles['no-action-points'] + ' fs-md text-dark' }
                                        onClick={() => actionPoints && stateManager.changePortSceneState(PortSceneState.TavernHireCrew)}>
                                        Hire Crew
                                    </Button>
                                </div>
                            )}
                        </OverlayTrigger>
                        <OverlayTrigger
                            key={GUID()}
                            placement="top"
                            delay={{ show: 100, hide: 250 }}
                            overlay={renderTooltip({
                                children: `${ actionPoints
                                    ? 'Hire officers one at a time, and risk using an action point per officer'
                                    : 'You need at least 1 Action Point to hire a new officer' }`
                            })}>
                            {({ ref, ...triggerHandler }) => (
                                <span className='col-5 offset-1 my-4'>
                                    <Button ref={ ref } {...triggerHandler}
                                        aria-disabled={ actionPoints ? false : true }
                                        aria-label='Open tavern hire officers section'
                                        variant='link'
                                        className={ actionPoints ? 'fs-md text-dark' : styles['no-action-points'] + ' fs-md text-dark' }
                                        onClick={() => actionPoints && stateManager.changePortSceneState(PortSceneState.TavernHireOfficers)}>
                                        Hire Officers
                                    </Button>
                                </span>
                            )}
                        </OverlayTrigger>
                    </Row>
                </>}
                { portSceneState !== PortSceneState.TavernBuySupplies ? null :
                    <Row className='no-gutters tavern-bg'>
                        <Col
                            aria-label='Tavern buy supplies section description'
                            className='fs-sm text-left'>
                            Buy some supplies
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.TavernHireCrew ? null : <>
                    <div style={{ position: 'absolute', top: '2em', left: '-1.35em' }}>
                        <img src="images/torch.png" alt='tavern background torch' style={{ width: '7em', height: '4em' }}></img>
                    </div>
                    <div style={{ position: 'absolute', top: '2em', right: '-1.6em' }}>
                        <img src="images/torch.png" alt='tavern background torch' style={{ width: '7em', height: '4em' }}></img>
                    </div>
                    <div style={{ position: 'absolute', top: 0, left: 0 }}>
                        <img src="images/torch-fire.gif" alt='tavern background torch flame' style={{ width: '4em', height: '4em' }}></img>
                    </div>
                    <div style={{ position: 'absolute', top: 0, right: 0 }}>
                        <img src="images/torch-fire.gif" alt='tavern background torch flame' style={{ width: '4em', height: '4em' }}></img>
                    </div>
                    <Row className='no-gutters bg-dark text-light tavern-bg'>
                        <Col
                            aria-label='Tavern hire crew section description'
                            className='fs-sm text-left'>
                            <HireCrew>
                                <OverlayTrigger rootClose
                                    key={GUID()}
                                    placement="top"
                                    delay={{ show: 100, hide: 250 }}
                                    overlay={renderTooltip({
                                        children: 'Access help for this section'
                                    })}>
                                    {({ ref, ...triggerHandler }) => ( 
                                        <Button
                                            {...triggerHandler }
                                            ref={ref}
                                            variant='link'
                                            aria-label='Open help modal for deeper description of hire crew section'
                                            className={ styles['help-icon'] + ' border-0 text-light' }
                                            onClick={() => gameManager.openHelpModal('Hire Crew')}>
                                            <MdHelpOutline></MdHelpOutline>
                                        </Button>
                                     )}
                                </OverlayTrigger>
                                <OverlayTrigger rootClose
                                    key={GUID()}
                                    placement="top"
                                    delay={{ show: 100, hide: 250 }}
                                    overlay={renderTooltip({
                                        children: 'Return to main port options'
                                    })}>
                                    {({ ref, ...triggerHandler }) => ( 
                                        <Button
                                            {...triggerHandler }
                                            ref={ref}
                                            variant='link'
                                            aria-label='Return to port options'
                                            className={ styles['exit-icon'] + ' border-0 text-light' }
                                            onClick={() => this.toggleMode()}>
                                            <ImExit></ImExit>
                                        </Button>
                                     )}
                                </OverlayTrigger>
                            </HireCrew>
                        </Col>
                    </Row>
                </>}
                { portSceneState !== PortSceneState.TavernHireOfficers ? null :
                    <Row className='no-gutters tavern-bg'>
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