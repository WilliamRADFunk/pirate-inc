import React from 'react';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Col, Row } from 'react-bootstrap';

import styles from './HUD.module.scss';
import { gameManager } from '../../Services/GameManager';
import { playerManager } from '../../Services/PlayerManager';
import { GameState, SceneState, stateManager } from '../../Services/StateManager';
import { portManager } from '../../Services/PortManager';

interface Props {}

interface State {
    balance: string;
    /**
     * Whether or not player should be able to interact with controls (otherwise disabled between turns).
     */
    canPlay: boolean;
    crewMorale: number;
    crewWages: string;
    crownFavor: number;
    currentCrew: number;
    fleetHealth: number;
    infamy: number;
    maxCrew: number;
    officerSalaries: string;
    playerBounty: string;
    portReputation: number;
    provisions: [number, number, number];
    remActionPoints: number;
    gameState: GameState;
    sceneState: SceneState;
    shipCount: number;
    totalActionPoints: number;
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
});

export class HUD extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: any) {
        super(props);

        this.state = {
            balance: '$0',
            canPlay: true,
            crewMorale: 100,
            crewWages: '$0',
            crownFavor: 0,
            currentCrew: 0,
            fleetHealth: 100,
            infamy: 0,
            maxCrew: 0,
            officerSalaries: '$0',
            playerBounty: '$0',
            portReputation: 0,
            provisions: [0, 0, 0],
            remActionPoints: 0,
            gameState: GameState.Start,
            sceneState: SceneState.Other,
            shipCount: 1,
            totalActionPoints: 0,
        };
    }

    /**
     * Signals user's click of the end turn button to the game manager for processing.
     */
    private async _endTurn(): Promise<void> {
        if (!this.state.canPlay) {
            return;
        }
        await gameManager.endTurn();
    }

    public componentDidMount() {
        // subscribe to all relevant player HUD data
        this.subscriptions.push(
            gameManager.getBalance().subscribe(bal => {
                if (!isNaN(bal)) {
                    this.setState({ balance: formatter.format(bal) });
                }
            }),
            gameManager.getCanPlayTurn().subscribe(canPlay => {
                this.setState({ canPlay: !!canPlay });
            }),
            gameManager.getCrewHUD().subscribe(crewHUD => {
                if (crewHUD) {
                    this.setState({
                        currentCrew: crewHUD.crewCountLiving,
                        crewMorale: crewHUD.crewMorale,
                        crewWages: formatter.format(crewHUD.crewWages)
                    });
                }
            }),
            gameManager.getMaxCrewCount().subscribe(mCrew => {
                if (!isNaN(mCrew)) {
                    this.setState({ maxCrew: mCrew });
                }
            }),
            gameManager.getProvisions().subscribe(provs => {
                if (provs?.length && provs.filter(prov => !isNaN(prov)).length === 3) {
                    this.setState({ provisions: [...provs] });
                }
            }),
            gameManager.getOfficerSalaries().subscribe(salaries => {
                if (!isNaN(salaries)) {
                    this.setState({ officerSalaries: formatter.format(salaries) });
                }
            }),
            gameManager.getShipCount().subscribe(ships => {
                if (!isNaN(ships)) {
                    this.setState({ shipCount: ships });
                }
            }),
            gameManager.getPlayerBounty().subscribe(bounty => {
                if (!isNaN(bounty)) {
                    this.setState({ playerBounty: formatter.format(bounty) });
                }
            }),
            gameManager.getFleetHUD().subscribe(fleetHUD => {
                this.setState({ fleetHealth: fleetHUD.fleetHealth });
            }),
            playerManager.getCrownFavor().subscribe(fav => {
                if (!isNaN(fav)) {
                    this.setState({ crownFavor: fav });
                }
            }),
            playerManager.getInfamy().subscribe(inf => {
                if (!isNaN(inf)) {
                    this.setState({ infamy: inf });
                }
            }),
            playerManager.getRemainingActionPoints().subscribe(ac => {
                if (!isNaN(ac)) {
                    this.setState({ remActionPoints: ac });
                }
            }),
            playerManager.getTotalActionPoints().subscribe(ac => {
                if (!isNaN(ac)) {
                    this.setState({ totalActionPoints: ac });
                }
            }),
            portManager.getCurrentPort().pipe( map(port => port?.reputation ?? 0) ).subscribe(rep => {
                this.setState({ portReputation: rep });
            }),
            stateManager.getGameState().subscribe(gameState => {
                if (gameState) {
                    this.setState({ gameState: gameState });
                }
            }),
            stateManager.getSceneState().subscribe(state => {
                this.setState({ sceneState: state });
            })
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public render() {
        const {
            balance,
            canPlay,
            crewMorale,
            crewWages,
            crownFavor,
            currentCrew,
            infamy,
            fleetHealth,
            gameState,
            maxCrew,
            officerSalaries,
            playerBounty,
            portReputation,
            provisions,
            remActionPoints,
            sceneState,
            shipCount,
            totalActionPoints
        } = this.state;

        return (gameState !== GameState.Active ? null :
            <Col xs='12' lg={{ span: 10, offset: 1}} className='hud-bg text-left' style={{ color: '#000', textShadow: '0.5px 0.5px #720058', letterSpacing: '0.1em' }}>
                <Row className='no-gutters my-5'>
                    <Col
                        xs={{ span: 7, offset: 1}}
                        lg={{ span: 4, offset: 1}}
                        className={ styles['hud-txt-bg'] + ' p-3' }>
                        <Row className='no-gutters'>
                            <Col xs='6' lg='5' className={styles.itemLabel}>Action Points:</Col>
                            <Col xs={{ span: 5, offset: 1}} lg={{ span: 4, offset: 3}} className={styles.itemValue}>{remActionPoints}/{totalActionPoints}</Col>
                        </Row>
                        <Row className='no-gutters'>
                            <Col xs='6' lg='5' className={styles.itemLabel}>Treasury:</Col>
                            <Col xs={{ span: 5, offset: 1}} lg={{ span: 4, offset: 3}} className={styles.itemValue}>{balance}</Col>
                        </Row>
                        <Row className='no-gutters'>
                            <Col xs='6' lg='5' className={styles.itemLabel}>Crew:</Col>
                            <Col xs={{ span: 5, offset: 1}} lg={{ span: 4, offset: 3}} className={styles.itemValue}>{currentCrew}/{maxCrew}</Col>
                        </Row>
                        <Row className='no-gutters'>
                            <Col xs='6' lg='5' className={styles.itemLabel}>Provisions:</Col>
                            <Col xs={{ span: 5, offset: 1}} lg={{ span: 4, offset: 3}} className={styles.itemValue}>
                                <span className='text-red mr-3'>
                                    {provisions[0]}
                                </span>
                                <span className='text-red mr-3'>
                                    {provisions[1]}
                                </span>
                                <span className='text-red'>
                                    {provisions[2]}
                                </span>
                            </Col>
                        </Row>
                        <Row className='no-gutters'>
                            <Col xs='6' lg='5' className={styles.itemLabel}>Ship Count/Health:</Col>
                            <Col xs={{ span: 5, offset: 1}} lg={{ span: 4, offset: 3}} className={styles.itemValue}>{shipCount} / {fleetHealth}%</Col>
                        </Row>
                        <Row className='no-gutters'>
                            <Col xs='6' lg='5' className={styles.itemLabel}>Crew/Officer Morale:</Col>
                            <Col xs={{ span: 5, offset: 1}} lg={{ span: 4, offset: 3}} className={styles.itemValue}>{crewMorale.toFixed(0)}% / {NaN}%</Col>
                        </Row>
                        <Row className='no-gutters'>
                            <Col xs='6' lg='5' className={styles.itemLabel}>Crew/Officer Pay:</Col>
                            <Col xs={{ span: 5, offset: 1}} lg={{ span: 4, offset: 3}} className={styles.itemValue}>{crewWages} / {officerSalaries}</Col>
                        </Row>
                        <Row className='no-gutters'>
                            <Col xs='6' lg='5' className={styles.itemLabel}>Infamy/Crown Favor:</Col>
                            <Col xs={{ span: 5, offset: 1}} lg={{ span: 4, offset: 3}} className={styles.itemValue}>{infamy} / {crownFavor}</Col>
                        </Row>
                        <Row className='no-gutters'>
                            <Col xs='6' lg='5' className={styles.itemLabel}>Bounty:</Col>
                            <Col xs={{ span: 5, offset: 1}} lg={{ span: 4, offset: 3}} className={styles.itemValue}>{playerBounty}</Col>
                        </Row>
                        { sceneState !== SceneState.Port ? null :
                            <Row className='no-gutters'>
                                <Col xs='6' lg='5' className={styles.itemLabel}>Port Reputation:</Col>
                                <Col xs={{ span: 5, offset: 1}} lg={{ span: 4, offset: 3}} className={styles.itemValue}>{portReputation.toFixed(0)}</Col>
                            </Row>
                        }
                    </Col>
                    <Col xs={{ span: 3 }} lg={{ span: 2, offset: 1}}>
                        <Row className='no-gutters h-25' role='button'>
                            <Col
                                className='silver-ribbon text-center'
                                aria-disabled={ !canPlay }
                                onClick={ () => this._endTurn() }>
                                <span className={ (!canPlay ? (styles['end-turn-btn-disabled'] + ' ') : '') + styles['rotate-text'] + ' no-select h-100'}>
                                    End Turn
                                </span>
                            </Col>
                        </Row>
                        <Row className='no-gutters h-25 mt-5'>
                            <Col className='silver-ribbon text-center'>
                                <span className={ styles['rotate-text'] + ' no-select h-100'}>
                                    {sceneState}
                                </span>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        );
    }
}