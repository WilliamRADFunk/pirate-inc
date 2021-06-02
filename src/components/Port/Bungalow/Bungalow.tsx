import React from "react";
import { Col } from "react-bootstrap";

import { Subscription } from "rxjs";

interface Props {}

interface State {
    
}

export class Bungalow extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            
        };
    }
    
    public componentDidMount() {
        // subscribe to all relevant player HUD data
        this.subscriptions.push(
            // gameManager.getSceneLocation().subscribe(location => {
            //     if (location) {
            //         // add balance to local state if number
            //         this.setState({ sceneLocation: location });
            //     }
            // }),
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public render() {
        // const { } = this.state;
        return (
            <Col xs="12" lg={{ span: 5, offset: 2 }} className="boundaries mt-5">
                Bungalow
            </Col>
        );
    }
}