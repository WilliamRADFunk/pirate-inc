import React from 'react';
import { Col, Image } from 'react-bootstrap';
import styles from './Title.module.scss';

export class Title extends React.Component {
    public render() {
        return (
            <Col xs="12" lg={{ span: 10, offset: 1 }} className="boundaries">
                <Image className={styles.banner} src="images/pirate-flag.png" alt="Pirates Incorporated logo" fluid/>
            </Col>
        );
    }
}