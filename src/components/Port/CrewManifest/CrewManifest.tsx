import React from "react";
import { Col, Row } from "react-bootstrap";
import { Subscription } from "rxjs";
import { gameManager } from "../../../Services/GameManager";
import { SceneState, stateManager } from "../../../Services/StateManager";
import { CrewMember } from "../../../Types/CrewMember";

interface Props {}

interface State {
    crew: CrewMember[];
    sceneState: SceneState;
}

export class CrewManifest extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            crew: [],
            sceneState: SceneState.Port
        };
    }
    
    public componentDidMount() {
        this.subscriptions.push(
            gameManager.getCrew().subscribe(crew => {
                this.setState({ crew: crew });
            }),
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
        const { crew, sceneState } = this.state;
        return (
            <Row className="border-white border-bottom mb-2">
                <Col xs="12"
                    aria-label="Crew Manifest section"
                    className="text-center">
                    Crew Manifest
                    <br/><br/>
                    See the full compliment of you crew and their associated stats.
                    <br/><br/>
                    <table className="table table-striped text-light">
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                crew.map(c => {
                                    return (<tr>
                                        <td style={{"width": "25px", "height": "25px"}}>
                                            <span
                                                style={{"width": "25px", "height": "25px"}}
                                                className="Container"
                                                dangerouslySetInnerHTML={{__html: c.avatar}}></span>
                                        </td>
                                        <td>
                                            {
                                                `${c.nameFirst} ${c.nameLast}`
                                            }
                                        </td>
                                        <td>
                                            {
                                                c.isAlive ? 'Alive' : 'Deceased'
                                            }
                                        </td>
                                    </tr>);
                                })
                            }
                        </tbody>
                    </table>
                </Col>
            </Row>
        );
    }

}