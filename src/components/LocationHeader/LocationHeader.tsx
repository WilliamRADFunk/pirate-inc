import React from 'react';
import { Subscription } from 'rxjs';

import styles from './LocationHeader.module.scss';
import { gameManager } from "../../services/GameManager";

interface Props {}

interface State {
    sceneLocation: string;
}

export class LocationHeader extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            sceneLocation: ""
        };
    }
    
    public componentDidMount() {
        // subscribe to all relevant player HUD data
        this.subscriptions.push(
            gameManager.getSceneLocation().subscribe(location => {
                if (location) {
                    // add balance to local state if number
                    this.setState({ sceneLocation: location });
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
        const { sceneLocation } = this.state;
        return (
            <div className="boundaries col-12 col-lg-8 offset-lg-2">
                <img src="plank.png" alt="Scene location hanging wood plank" width="400px" height="200px"></img>
                <div className={styles.title}>{sceneLocation}</div>
            </div>
        );
    }
}