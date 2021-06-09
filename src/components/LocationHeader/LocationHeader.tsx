import React from 'react';
import { Subscription } from 'rxjs';

import styles from './LocationHeader.module.scss';
import { Col } from 'react-bootstrap';
import { stateManager, SceneState } from '../../Services/StateManager';

interface Props {}

interface State {
    sceneState: SceneState;
}

export class LocationHeader extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            sceneState: SceneState.Port,
        };
    }
    
    public componentDidMount() {
        this.subscriptions.push(
            stateManager.getSceneState().subscribe(state => {
                if (state) {
                    // add balance to local state if number
                    this.setState({ sceneState: state });
                }
            }),
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public render() {
        const { sceneState } = this.state;
        return (
            <Col xs="12" lg={{ span: 8, offset: 2 }} className="boundaries">
                <img src="plank.png" alt="Scene location hanging wood plank" width="400px" height="200px"></img>
                <div className={styles.title}>{sceneState}</div>
            </Col>
        );
    }
}