import React from 'react';
import { Col, Image } from 'react-bootstrap';
import styles from './Title.module.scss';

interface Props {
    url: string;
}

interface State {}

export class Title extends React.Component<Props, State> {
    public render() {
        return (
            <Col xs='12' lg={{ span: 10, offset: 1 }}>
                <Image className={styles.banner} src={ `images/${this.props.url}` } alt='Pirates Incorporated logo' fluid/>
            </Col>
        );
    }
}