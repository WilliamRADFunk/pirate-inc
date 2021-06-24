import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Subscription } from "rxjs";

import styles from './CrewManifest.module.scss';
import { gameManager } from "../../../Services/GameManager";
// import { SceneState, stateManager } from "../../../Services/StateManager";
import { ConcernTypes, CrewMember, MouthToMood } from "../../../Types/CrewMember";

interface Props {}

interface State {
    crew: CrewMember[];
    // sceneState: SceneState;
}

export class CrewManifest extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            crew: [],
            // sceneState: SceneState.Port
        };
    }

    private _payPriority(payNumber: number, isDown: boolean): void {
        gameManager.updatePayPriority(payNumber, isDown);
    }

    public componentDidMount() {
        this.subscriptions.push(
            gameManager.getCrew().subscribe(crew => {
                this.setState({ crew: crew });
            }),
            // stateManager.getSceneState().subscribe(state => {
            //     this.setState({ sceneState: state });
            // }),
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public render() {
        const { crew, /*sceneState*/ } = this.state;
        return (
            <Row className="mb-2">
                <Col xs="12"
                    aria-label="Crew Manifest section"
                    className="text-center">
                    Crew Manifest
                    <br/><br/>
                    See the full compliment of your crew and their associated stats.
                    <br/><br/>
                    <table className="table table-striped text-light">
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Name</th>
                                <th>Morale</th>
                                <th>Concern</th>
                                <th>Pay Priority</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                crew.map(c => {
                                    const hasPayUpBtn = c.payOrder < crew.length - 1;
                                    const hasPayDownBtn = c.payOrder > 0;
                                    return (<tr key={`${c.nameFirst} ${c.nameLast}`}>
                                        <td style={{"width": "100px", "height": "100px"}}>
                                            <span
                                                style={{"width": "100px", "height": "100px"}}
                                                className="Container"
                                                dangerouslySetInnerHTML={{__html: c.avatar}}></span>
                                        </td>
                                        <td>
                                            { `${c.nameFirst}${ c.nameNick ? ` "${c.nameNick}" ` : ' '}${c.nameLast}` }
                                        </td>
                                        <td>
                                            { c.isAlive ? MouthToMood[c.mood] : '---' }
                                        </td>
                                        <td>
                                            { c.concern !== ConcernTypes.Empty ? c.concern : '---' }
                                        </td>
                                        <td className={ styles["pay-order-cell"] }>
                                            { !c.isAlive ? <span>-1</span> : <>
                                                <span className="float-left">{ !hasPayUpBtn ? null :
                                                    <Button
                                                        variant="info"
                                                        className={ styles["pay-order-button"] + " py-1 px-1" }
                                                        size="sm"
                                                        aria-label="Increase priority of pay"
                                                        onClick={() => this._payPriority(c.payOrder, false)}>
                                                        <FaCaretUp />
                                                    </Button>
                                                }</span>
                                                <span className={ styles["pay-order-text"] + " text-center" }>
                                                    { c.payOrder }
                                                </span>
                                                <span className="float-right"> { !hasPayDownBtn ? null :
                                                    <Button
                                                        variant="info"
                                                        className={ styles["pay-order-button"] + " py-1 px-1" }
                                                        size="sm"
                                                        aria-label="Decrease priority of pay"
                                                        onClick={() => this._payPriority(c.payOrder, true)}>
                                                        <FaCaretDown />
                                                    </Button>
                                                }</span>
                                            </>}
                                        </td>
                                        <td>
                                            { c.isAlive ? 'Alive' : 'Deceased' }
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