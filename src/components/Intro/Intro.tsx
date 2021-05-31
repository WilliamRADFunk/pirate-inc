import React from 'react';
import { Subscription } from 'rxjs';

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
                            <p>
                                It's 17** and the Golden Age of Piracy has begun. Inspired by the great names that pass through the drinking halls of (British Port) about those that dared to strike it rich against Dutch merchants and Spanish treasure vessels alike.
                            </p>
                            <p>
                                Names like Benjamin Hornigold and the founding of the Pirate Republic of Nassau, Edward “Black Beard” Thatch with his beard set aflame, and the duo of William Palsgrave and Samuel Bellamy; the one seeking fortune, and the other the love of his sweetheart.
                            </p>
                            <p>
                                Your prospects under the English crown seem grim. A life of piracy, while deadly dangerous, appear a welcomed escape from a tedious life.
                            </p>
                            <p>
                                Will you add your name among the infamous and gain your fortune, or will you find yourself a watery grave where no one remembers you?
                            </p>
                            <p>
                                You and a band of misanthropes have stolen aboard a small frigate. The crew were on leave after a long voyage and the few left on board to stand watch were alseep after a long night of drinking. In quick order you’ve managed to tie them up and deposit them on the dock before setting sail for the Caribbean. You find yourself at the port of St. Croix, one pirate captain among many.
                            </p>
                            <p>
                                What will you do first?
                            </p>
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