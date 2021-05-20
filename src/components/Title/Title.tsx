import React from 'react';
import styles from './Title.module.scss';

export class Title extends React.Component {
    public render() {
        return (
            <div className="boundaries col-12 col-lg-8 offset-lg-2">
                <img src="pirate-flag.png" alt="Pirates Incorporated logo" width="400px" height="200px"></img>
                <div className={styles.title}>Pirates Incorporated</div>
            </div>
        );
    }
}