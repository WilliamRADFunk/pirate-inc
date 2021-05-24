import React from 'react';
import { Subscription } from 'rxjs';

import styles from './HUD.module.scss';
import { gameManager } from "../../services/GameManager";

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
            maxCrew,
            officerSalaries,
            playerBounty,
            provisions,
            remActionPoints,
            shipCount,
            totalActionPoints
        } = this.state;

        return (
            <div className="boundaries col-12 col-lg-8 offset-lg-2 text-left">
                <div className="row">
                    <div className="col-6">
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Action Points:</div>
                            <div className={styles.itemValue + " col-6"}>{remActionPoints}/{totalActionPoints}</div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Treasury:</div>
                            <div className={styles.itemValue + " col-6"}>{balance}</div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Crew:</div>
                            <div className={styles.itemValue + " col-6"}>{currentCrew}/{maxCrew}</div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Provisions:</div>
                            <div className={styles.itemValue + " col-6"}>
                                <span className="text-red mr-3">
                                    {provisions[0]}
                                </span>
                                <span className="text-red mr-3">
                                    {provisions[1]}
                                </span>
                                <span className="text-red">
                                    {provisions[2]}
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Ships:</div>
                            <div className={styles.itemValue + " col-6"}>{shipCount}</div>
                        </div>
                    </div>
                    {/* Right side of HUD */}
                    <div className="col-6">
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Fleet Health:</div>
                            <div className={styles.itemValue + " col-6"}>{fleetHealth}%</div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Crew Wages:</div>
                            <div className={styles.itemValue + " col-6"}>{crewWages}</div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Officer Salaries:</div>
                            <div className={styles.itemValue + " col-6"}>{officerSalaries}</div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Infamy:</div>
                            <div className={styles.itemValue + " col-6"}>{infamy}</div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Bounty:</div>
                            <div className={styles.itemValue + " col-6"}>{playerBounty}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}