import React from 'react';
import styles from './Title.module.scss';

export class Title extends React.Component {
    public render() {
        return (
            <div className="boundaries">
                <img src="pirate-flag.png" width="400px" height="200px"></img>
                <div className={styles.title}>Pirates Incorporated</div>
            </div>
        );
    }
}