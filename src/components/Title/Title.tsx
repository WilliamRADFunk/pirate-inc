import React from 'react';
import { Col } from 'react-bootstrap';
import styles from './Title.module.scss';

export class Title extends React.Component {
    public render() {
        return (
            <Col xs="12" lg={{ span: 8, offset: 2 }} className="boundaries mt-5">
                <img src="pirate-flag.png" alt="Pirates Incorporated logo" width="400px" height="200px"></img>
                <div className={styles.title}>Pirates Incorporated</div>
            </Col>
        );
    }
}