import React from "react";
import { Col, Row } from "react-bootstrap";
import { Subscription } from "rxjs";
import { SceneState, stateManager } from "../../../Services/StateManager";

interface Props {}

interface State {
    sceneState: SceneState;
}

export class CrewManifest extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            sceneState: SceneState.Port
        };
    }
    
    public componentDidMount() {
        this.subscriptions.push(
            stateManager.getSceneState().subscribe(state => {
                this.setState({ sceneState: state });
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
            <Row className="border-white border-bottom mb-2">
                <Col xs="12"
                    aria-label="Crew Manifest section"
                    className="text-center">
                    Crew Manifest
                    <br/><br/>
                    See the full compliment of you crew and their associated stats.
                </Col>
            </Row>
        );
    }

}