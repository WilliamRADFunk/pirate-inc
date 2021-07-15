import React from 'react';
import { Button, Col, Image, OverlayTrigger, Row } from 'react-bootstrap';
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
import { HireOfficers } from '../HireOfficers/HireOfficers';
import { RenderTooltip } from '../../../Helpers/Tooltip';
import { Provisions } from '../Provisions/Provisions';

interface Props {}

interface State {
    actionPoints: number;
    crewCount: number;
    maxCrew: number;
    portSceneState: PortSceneState;
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

    private _renderBackgroundImages(): JSX.Element {
        return (<>
            <div className={ styles['torch-handle-wrapper-left'] }>
                <Image src="images/torch.png" alt='tavern background torch' className={ styles['torch-handle'] }/>
            </div>
            <div className={ styles['torch-handle-wrapper-right'] }>
                <Image src="images/torch.png" alt='tavern background torch' className={ styles['torch-handle'] }/>
            </div>
            <div className={ styles['torch-flame-wrapper-left'] }>
                <Image src="images/torch-fire.gif" alt='tavern background torch flame' className={ styles['torch-flame'] }/>
            </div>
            <div className={ styles['torch-flame-wrapper-right'] }>
                <Image src="images/torch-fire.gif" alt='tavern background torch flame' className={ styles['torch-flame'] }/>
            </div>
        </>);
    }

    private _renderProvisions(): JSX.Element {
        return (
            <Row className='no-gutters bg-dark text-light tavern-bg'>
                <Col
                    aria-label='Tavern provisions section description'
                    className='fs-sm text-left'>
                    <Provisions>
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
                                    aria-label='Open help modal for deeper description of provisions section'
                                    className={ styles['help-icon'] + ' border-0 text-light' }
                                    onClick={() => gameManager.openHelpModal('Provisions')}>
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
                                    className={ styles['exit-icon'] + ' border-0 text-light' }
                                    onClick={() => this._toggleMode()}>
                                    <ImExit></ImExit>
                                </Button>
                                )}
                        </OverlayTrigger>
                    </Provisions>
                </Col>
            </Row>
        );
    }

    private _renderHireCrew(): JSX.Element {
        return (
            <Row className='no-gutters bg-dark text-light tavern-bg'>
                <Col
                    aria-label='Tavern hire crew section description'
                    className='fs-sm text-left'>
                    <HireCrew>
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
                            overlay={RenderTooltip({
                                children: 'Return to main port options'
                            })}>
                            {({ ref, ...triggerHandler }) => ( 
                                <Button
                                    {...triggerHandler }
                                    ref={ref}
                                    variant='link'
                                    aria-label='Return to port options'
                                    className={ styles['exit-icon'] + ' border-0 text-light' }
                                    onClick={() => this._toggleMode()}>
                                    <ImExit></ImExit>
                                </Button>
                                )}
                        </OverlayTrigger>
                    </HireCrew>
                </Col>
            </Row>
        );
    }

    private _renderHireOfficers(): JSX.Element {
        return (
            <Row className='no-gutters tavern-bg'>
                <Col
                    aria-label='Tavern hire officers section description'
                    className='fs-sm text-left'>
                    <HireOfficers>
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
                                    aria-label='Open help modal for deeper description of hire officers section'
                                    className={ styles['help-icon'] + ' border-0 text-light' }
                                    onClick={() => gameManager.openHelpModal('Hire Officers')}>
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
                                    className={ styles['exit-icon'] + ' border-0 text-light' }
                                    onClick={() => this._toggleMode()}>
                                    <ImExit></ImExit>
                                </Button>
                                )}
                        </OverlayTrigger>
                    </HireOfficers>
                </Col>
            </Row>
        );
    }

    private _renderOptions(actionPoints: boolean, maxCrewReached: boolean): JSX.Element {
        return (<>
            <Row className='no-gutters'>
                <OverlayTrigger rootClose
                    key={GUID()}
                    placement="top"
                    delay={{ show: 100, hide: 250 }}
                    overlay={RenderTooltip({
                        children: 'Visit the port\'s merchant guild leader to buy or sell provisions'
                    })}>
                    {({ ref, ...triggerHandler }) => (
                        <div className='col-4 offset-1 my-4'>
                            <Button ref={ ref } {...triggerHandler}
                                aria-label='Open tavern provisions section'
                                variant='link'
                                className='fs-md text-dark'
                                onClick={() => stateManager.changePortSceneState(PortSceneState.TavernProvisions)}>
                                Provisions
                            </Button>
                        </div>
                    )}
                </OverlayTrigger>
                <OverlayTrigger rootClose
                    key={GUID()}
                    placement="top"
                    delay={{ show: 100, hide: 250 }}
                    overlay={RenderTooltip({
                        children: 'Visit the port\'s fence to sell your ill-gotten booty'
                    })}>
                    {({ ref, ...triggerHandler }) => (
                        <div className='col-4 offset-1 my-4'>
                            <Button ref={ ref } {...triggerHandler}
                                aria-label='Open tavern fence section'
                                variant='link'
                                className='fs-md text-dark'
                                onClick={() => stateManager.changePortSceneState(PortSceneState.TavernFence)}>
                                Fence
                            </Button>
                        </div>
                    )}
                </OverlayTrigger>
            </Row>
            <Row className='no-gutters'>
                <OverlayTrigger rootClose
                    key={GUID()}
                    placement="top"
                    delay={{ show: 100, hide: 250 }}
                    overlay={RenderTooltip({
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
                    overlay={RenderTooltip({
                        children: `${ actionPoints
                            ? 'Hire officers one at a time, and use an action point per officer'
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
        </>);
    }

    private _renderTitle(portSceneState: PortSceneState): JSX.Element {
        return (
            <Row className='mb-2 no-gutters'>
                <Col xs={{ span: 6, offset: 3 }}
                    aria-label='Tavern section'
                    className='text-center clickable double-line-headers'
                    onClick={() => this._toggleMode()}>
                    <span>Tavern</span>
                </Col>
                <Button
                    variant='link'
                    className='border-0 col-2 text-dark'
                    onClick={() => this._toggleMode()}>
                    { portSceneState !== PortSceneState.TavernOptions
                        ? <Eye></Eye>
                        : <EyeSlash></EyeSlash>
                    }
                </Button>
            </Row>
        );
    }

    private _toggleMode(): void {
        const currState = this.state.portSceneState;
        if (currState !== PortSceneState.TavernOptions) {
            stateManager.changePortSceneState(PortSceneState.TavernOptions);
        } else {
            stateManager.changePortSceneState(PortSceneState.Menu);
        }
    }
    
    public componentDidMount(): void {
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

    public componentWillUnmount(): void {
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
                { (portSceneState !== PortSceneState.TavernOptions && portSceneState >= PortSceneState.TavernProvisions) ? null : this._renderTitle(portSceneState) }
                { (PortSceneState.TavernProvisions <= portSceneState && portSceneState <= PortSceneState.TavernHireOfficers) || portSceneState === PortSceneState.TavernOptions
                    ? null
                    : <Image
                        src='images/tavern-icon.png'
                        alt='tavern icon'
                        width='50%'
                        height='50%'
                        className='small-square-icon'
                        onClick={() => this._toggleMode()}/>
                }
                { portSceneState < PortSceneState.TavernProvisions || portSceneState > PortSceneState.TavernHireOfficers ? null : this._renderBackgroundImages() }
                { portSceneState !== PortSceneState.TavernOptions ? null : this._renderOptions(actionPoints, maxCrewReached)}
                { portSceneState !== PortSceneState.TavernProvisions ? null : this._renderProvisions() }
                { portSceneState !== PortSceneState.TavernHireCrew ? null : this._renderHireCrew() }
                { portSceneState !== PortSceneState.TavernHireOfficers ? null : this._renderHireOfficers() }
            </div>);
    }
}