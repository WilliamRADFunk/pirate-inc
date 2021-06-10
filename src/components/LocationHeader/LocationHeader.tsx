import React from 'react';
import { Subscription } from 'rxjs';

import styles from './LocationHeader.module.scss';
import { Button, Col } from 'react-bootstrap';
import { stateManager, SceneState } from '../../Services/StateManager';
import { gameManager } from '../../Services/GameManager';

interface Props {}

interface State {
    /**
     * Whether or not player should be able to interact with controls (otherwise disabled between turns).
     */
    canPlay: boolean;
    /**
     * Where the player is in that moment (Port, AtSea, Battle, etc.).
     */
    sceneState: SceneState;
}

export class LocationHeader extends React.Component<Props, State> {
    /**
     * The various service subscriptions to which the component has subscribed.
     */
    private subscriptions: Subscription[] = [];

    /**
     * Constructor for the LocationHeader class.
     * @param props empty props set.
     */
    constructor(props: Props) {
        // Obligatory pass of the props to parent.
        super(props);

        // Initiate the state.
        this.state = {
            canPlay: true,
            sceneState: SceneState.Port,
        };
    }

    /**
     * Signals user's click of the end turn button to the game manager for processing.
     */
    private async endTurn(): Promise<void> {
        await gameManager.endTurn();
    }
    
    /**
     * When component is finished building, subscribe to all necessary services.
     */
    public componentDidMount(): void {
        this.subscriptions.push(
            gameManager.getCanPlayTurn().subscribe(canPlay => {
                this.setState({ canPlay: !!canPlay });
            }),
            stateManager.getSceneState().subscribe(state => {
                if (state) {
                    // add balance to local state if number
                    this.setState({ sceneState: state });
                }
            }),
        );
    }

    /**
     * When component is about to be destroyed, unsubscribe and discard all active subscriptions.
     */
    public componentWillUnmount(): void {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    /**
     * The render function to run each time there is a state change.
     * @returns Jsx Element representing the DOM of the component.
     */
    public render() {
        const { canPlay, sceneState } = this.state;
        return (
            <Col xs="12" lg={{ span: 8, offset: 2 }} className="boundaries">
                <Button
                    variant="danger"
                    className={styles["end-turn-btn"]}
                    disabled={ !canPlay }
                    onClick={() => this.endTurn()}>End Turn</Button>
                <img src="plank.png" alt="Scene location hanging wood plank" width="400px" height="200px"></img>
                <div className={styles.title}>{sceneState}</div>
            </Col>
        );
    }
}