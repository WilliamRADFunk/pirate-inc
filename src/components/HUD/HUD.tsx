import React from 'react';
import { Subscription } from 'rxjs';

import styles from './HUD.module.scss';
import { gameManager, GameState } from "../../services/GameManager";
import { Col, Row } from 'react-bootstrap';

interface Props {}

interface State {
    balance: string;
    crewWages: string;
    currentCrew: number;
    fleetHealth: number;
    infamy: number;
    maxCrew: number;
    officerSalaries: string;
    playerBounty: string;
    provisions: [number, number, number];
    remActionPoints: number;
    gameState: GameState;
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
            crewWages: '$0',
            currentCrew: 0,
            fleetHealth: 100,
            infamy: 0,
            maxCrew: 0,
            officerSalaries: '$0',
            playerBounty: '$0',
            provisions: [0, 0, 0],
            remActionPoints: 0,
            gameState: GameState.Start,
            shipCount: 1,
            totalActionPoints: 0,
        };
    }

    public componentDidMount() {
        // subscribe to all relevant player HUD data
        this.subscriptions.push(
            gameManager.getBalance().subscribe(bal => {
                if (!isNaN(bal)) {
                    // add balance to local state if number
                    this.setState({ balance: formatter.format(bal) });
                }
            }),
            gameManager.getRemainingActionPoints().subscribe(ac => {
                if (!isNaN(ac)) {
                    // add remaining action points to local state if number
                    this.setState({ remActionPoints: ac });
                }
            }),
            gameManager.getTotalActionPoints().subscribe(ac => {
                if (!isNaN(ac)) {
                    // add total action points to local state if number
                    this.setState({ totalActionPoints: ac });
                }
            }),
            gameManager.getCurrentCrewCount().subscribe(currCrew => {
                if (!isNaN(currCrew)) {
                    // add current crew count to local state if number
                    this.setState({ currentCrew: currCrew });
                }
            }),
            gameManager.getMaxCrewCount().subscribe(mCrew => {
                if (!isNaN(mCrew)) {
                    // add maximum crew count to local state if number
                    this.setState({ maxCrew: mCrew });
                }
            }),
            gameManager.getProvisions().subscribe(provs => {
                if (provs?.length && provs.filter(prov => !isNaN(prov)).length === 3) {
                    // add provisions to local state if array with exactly 3 numbers
                    this.setState({ provisions: [...provs] });
                }
            }),
            gameManager.getCrewWages().subscribe(wages => {
                if (!isNaN(wages)) {
                    // add crew wages to local state if number
                    this.setState({ crewWages: formatter.format(wages) });
                }
            }),
            gameManager.getOfficerSalaries().subscribe(salaries => {
                if (!isNaN(salaries)) {
                    // add officer salaries to local state if number
                    this.setState({ officerSalaries: formatter.format(salaries) });
                }
            }),
            gameManager.getInfamy().subscribe(inf => {
                if (!isNaN(inf)) {
                    // add infamy to local state if number
                    this.setState({ infamy: inf });
                }
            }),
            gameManager.getShipCount().subscribe(ships => {
                if (!isNaN(ships)) {
                    // add ship count to local state if number
                    this.setState({ shipCount: ships });
                }
            }),
            gameManager.getPlayerBounty().subscribe(bounty => {
                if (!isNaN(bounty)) {
                    // add player bounty to local state if number
                    this.setState({ playerBounty: formatter.format(bounty) });
                }
            }),
            gameManager.getFleetHealth().subscribe(health => {
                if (!isNaN(health)) {
                    // add player's fleet health to local state if number
                    this.setState({ fleetHealth: health });
                }
            }),
            gameManager.getGameState().subscribe(gameState => {
                if (gameState) {
                    // add scene gameState to local state if truthy
                    this.setState({ gameState: gameState });
                }
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
            crewWages,
            currentCrew,
            infamy,
            fleetHealth,
            gameState,
            maxCrew,
            officerSalaries,
            playerBounty,
            provisions,
            remActionPoints,
            shipCount,
            totalActionPoints
        } = this.state;

        return (gameState !== GameState.Active ? null :
            
                <Col xs="12" lg={{ span: 8, offset: 2}} className="boundaries text-left">
                    <Row>
                        <Col xs="12" lg="6">
                            <Row>
                                <Col xs="6" className={styles.itemLabel}>Action Points:</Col>
                                <Col xs="6" className={styles.itemValue}>{remActionPoints}/{totalActionPoints}</Col>
                            </Row>
                            <Row>
                                <Col xs="6" className={styles.itemLabel}>Treasury:</Col>
                                <Col xs="6" className={styles.itemValue}>{balance}</Col>
                            </Row>
                            <Row>
                                <Col xs="6" className={styles.itemLabel}>Crew:</Col>
                                <Col xs="6" className={styles.itemValue}>{currentCrew}/{maxCrew}</Col>
                            </Row>
                            <Row>
                                <Col xs="6" className={styles.itemLabel}>Provisions:</Col>
                                <Col xs="6" className={styles.itemValue}>
                                    <span className="text-red mr-3">
                                        {provisions[0]}
                                    </span>
                                    <span className="text-red mr-3">
                                        {provisions[1]}
                                    </span>
                                    <span className="text-red">
                                        {provisions[2]}
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6" className={styles.itemLabel}>Ships:</Col>
                                <Col xs="6" className={styles.itemValue}>{shipCount}</Col>
                            </Row>
                        </Col>
                        {/* Right side of HUD */}
                        <Col xs="12" lg="6">
                            <Row>
                                <Col xs="6" className={styles.itemLabel}>Fleet Health:</Col>
                                <Col xs="6" className={styles.itemValue}>{fleetHealth}%</Col>
                            </Row>
                            <Row>
                                <Col xs="6" className={styles.itemLabel}>Crew Wages:</Col>
                                <Col xs="6" className={styles.itemValue}>{crewWages}</Col>
                            </Row>
                            <Row>
                                <Col xs="6" className={styles.itemLabel}>Officer Salaries:</Col>
                                <Col xs="6" className={styles.itemValue}>{officerSalaries}</Col>
                            </Row>
                            <Row>
                                <Col xs="6" className={styles.itemLabel}>Infamy:</Col>
                                <Col xs="6" className={styles.itemValue}>{infamy}</Col>
                            </Row>
                            <Row>
                                <Col xs="6" className={styles.itemLabel}>Bounty:</Col>
                                <Col xs="6" className={styles.itemValue}>{playerBounty}</Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
        );
    }
}