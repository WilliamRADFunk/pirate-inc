import React from 'react';
import styles from './HUD.module.scss';
import { gameManager } from "../../services/GameManager";

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
});

export class HUD extends React.Component {
    public render() {
        return (
            <div className="boundaries col-12 col-lg-8 offset-lg-2 text-left">
                <div className="row">
                    <div className="col-6">
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Action Points:</div>
                            <div className={styles.itemValue + " col-6"}>{gameManager.getRemainingActionPoints()}/{gameManager.getTotalActionPoints()}</div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Treasury:</div>
                            <div className={styles.itemValue + " col-6"}>{formatter.format(gameManager.getBalance())}</div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Crew:</div>
                            <div className={styles.itemValue + " col-6"}>{gameManager.getCurrentCrewCount()}/{gameManager.getMaxCrewCount()}</div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Provisions:</div>
                            <div className={styles.itemValue + " col-6"}>
                                <span className="text-red mr-3">
                                    {gameManager.getProvisions()[0]}
                                </span>
                                <span className="text-red mr-3">
                                    {gameManager.getProvisions()[1]}
                                </span>
                                <span className="text-red">
                                    {gameManager.getProvisions()[2]}
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Ships:</div>
                            <div className={styles.itemValue + " col-6"}>{gameManager.getShipCount()}</div>
                        </div>
                    </div>
                    {/* Right side of HUD */}
                    <div className="col-6">
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Action Points:</div>
                            <div className={styles.itemValue + " col-6"}>{gameManager.getRemainingActionPoints()}/{gameManager.getTotalActionPoints()}</div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Crew Wages:</div>
                            <div className={styles.itemValue + " col-6"}>{formatter.format(gameManager.getCrewWages())}</div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Officer Salaries:</div>
                            <div className={styles.itemValue + " col-6"}>{formatter.format(gameManager.getOfficerSalaries())}</div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Infamy:</div>
                            <div className={styles.itemValue + " col-6"}>{gameManager.getInfamy()}</div>
                        </div>
                        <div className="row">
                            <div className={styles.itemLabel + " col-6"}>Bounty:</div>
                            <div className={styles.itemValue + " col-6"}>{formatter.format(gameManager.getPlayerBounty())}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}