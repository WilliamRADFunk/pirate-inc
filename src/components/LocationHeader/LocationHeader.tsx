import React from 'react';
import styles from './LocationHeader.module.scss';
import { gameManager } from "../../services/GameManager";

export class LocationHeader extends React.Component {
    public render() {
        return (
            <div className="boundaries">
                <img src="plank.png" width="400px" height="200px"></img>
                <div className={styles.title}>{gameManager.getSceneLocation()}</div>
            </div>
        );
    }
}