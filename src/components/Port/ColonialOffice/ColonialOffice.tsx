import React from "react";

import { Subscription } from "rxjs";

import { gameManager } from "../../../services/GameManager";
import { SceneLocation } from "../../../Types/SceneLocation";

interface Props {}

interface State {
    sceneLocation: SceneLocation;
}

export class ColonialOffice extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            sceneLocation: SceneLocation.Port,
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
            <div className="boundaries col-12 col-lg-5 mt-5">
                Colonial Office
            </div>
        );
    }
}