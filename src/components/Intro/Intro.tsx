import React from 'react';
import { Subscription } from 'rxjs';

import styles from './Intro.module.scss';
import { gameManager } from "../../services/GameManager";

interface Props {}

interface State {
    difficulty: number;
}

export class Intro extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            difficulty: 0,
        };
    }
    
    public componentDidMount() {
        // subscribe to all relevant player HUD data
        this.subscriptions.push(
            gameManager.getDifficulty().subscribe(difficulty => {
                if (difficulty) {
                    this.setState({ difficulty: difficulty });
                }
            }),
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public getIntro(): JSX.Element {
        switch(this.state.difficulty) {
            case 1: {
                return (
                    <div className="row">
                        <div className="col-12 col-lg-8 offset-lg-2">
                            The Normal difficulty story
                        </div>
                    </div>
                );
            }
            case 2: {
                return (
                    <div className="row">
                        <div className="col-12 col-lg-8 offset-lg-2">
                            The Hard difficulty story
                        </div>
                    </div>
                );
            }
            case 3: {
                return (
                    <div className="row">
                        <div className="col-12 col-lg-8 offset-lg-2">
                            The Impossible difficulty story
                        </div>
                    </div>
                );
            }
            default: {
                return (
                    <div className="row">
                        <div className="col-12 col-lg-8 offset-lg-2">
                            The Easy difficulty story
                        </div>
                    </div>
                );
            }
        }
    }

    public render() {
        return (
            <div className="boundaries col-12 col-lg-8 offset-lg-2 py-5">
                {this.getIntro()}
                <div className="row">
                    <div
                        className="btn btn-primary col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                        role="button">To the Ship!
                    </div>
                </div>
            </div>
        );
    }
}