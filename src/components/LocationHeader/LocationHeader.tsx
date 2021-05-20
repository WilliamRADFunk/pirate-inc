import React from 'react';
import styles from './LocationHeader.module.scss';
import { gameManager } from "../../services/GameManager";

export class LocationHeader extends React.Component {
    public render() {
        return (
            <div className="boundaries col-12 col-lg-8 offset-lg-2">
                <img src="plank.png" alt="Scene location hanging wood plank" width="400px" height="200px"></img>
                <div className={styles.title}>{gameManager.getSceneLocation()}</div>
            </div>
        );
    }
}