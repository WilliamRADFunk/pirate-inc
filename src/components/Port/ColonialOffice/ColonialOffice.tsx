import React from "react";
import { Col } from "react-bootstrap";

import { Subscription } from "rxjs";

interface Props {}

interface State {
    
}

export class ColonialOffice extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            
        };
    }
    
    public componentDidMount() {
        // subscribe to all relevant player HUD data
        this.subscriptions.push(
            // stateManager.getSceneState().subscribe(state => {
            //     if (state) {
            //         // add balance to local state if number
            //         this.setState({ sceneState: state });
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
        // const {  } = this.state;
        return (
            <Col xs="12" lg="5" className="boundaries mt-5">
                Colonial Office
            </Col>
        );
    }
}