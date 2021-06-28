import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";

import { Subscription } from "rxjs";
import { PortSceneState, stateManager } from "../../../Services/StateManager";

interface Props {}

interface State {
    portSceneState: PortSceneState;
}

export class Tavern extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            portSceneState: PortSceneState.Menu
        };
    }

    private toggleMode(): void {
        const currState = this.state.portSceneState;
        if (currState === PortSceneState.Menu) {
            stateManager.changePortSceneState(PortSceneState.TavernOptions);
        } else {
            stateManager.changePortSceneState(PortSceneState.Menu);
        }
    }
    
    public componentDidMount() {
        // subscribe to all relevant player HUD data
        this.subscriptions.push(
            stateManager.getPortSceneState().subscribe(state => {
                this.setState({ portSceneState: state });
            }),
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public render() {
        const { portSceneState } = this.state;
        return (
            <div className='w-100 h-100' onClick={() => this.toggleMode()}>
                <Row className="border-white border-bottom mb-2">
                    <Col xs={{ span: 8, offset: 2 }}
                        aria-label="Tavern section"
                        className="text-center">
                        Tavern
                    </Col>
                    <Button
                        variant="outline-secondary"
                        className="border-0 col-2"
                        onClick={() => this.toggleMode()}>
                        { portSceneState !== PortSceneState.TavernOptions
                            ? <Eye color="white" size={20}></Eye>
                            : <EyeSlash color="white" size={20}></EyeSlash>
                        }
                    </Button>
                </Row>
                { portSceneState !== PortSceneState.TavernOptions
                    ? <img src='images/tavern-icon.png' width='50%' height='50%' className='small-square-icon'/>
                    : <Row>
                        <Button
                            aria-label="Open tavern buy supplies section"
                            variant="link"
                            className="col-2 offset-1"
                            onClick={() => stateManager.changePortSceneState(PortSceneState.TavernBuySupplies)}>
                            Buy Supplies
                        </Button>
                        <Button
                            aria-label="Open tavern fire crew section"
                            variant="link"
                            className="col-2"
                            onClick={() => stateManager.changePortSceneState(PortSceneState.TavernFireCrew)}>
                            Fire Crew
                        </Button>
                        <Button
                            aria-label="Open tavern hire crew section"
                            variant="link"
                            className="col-2"
                            onClick={() => stateManager.changePortSceneState(PortSceneState.TavernHireCrew)}>
                            Hire Crew
                        </Button>
                        <Button
                            aria-label="Open tavern fire officers section"
                            variant="link"
                            className="col-2"
                            onClick={() => stateManager.changePortSceneState(PortSceneState.TavernFireOfficers)}>
                            Fire Officers
                        </Button>
                        <Button
                            aria-label="Open tavern hire officers section"
                            variant="link"
                            className="col-2"
                            onClick={() => stateManager.changePortSceneState(PortSceneState.TavernHireOfficers)}>
                            Hire Officers
                        </Button>
                    </Row>
                }
                { portSceneState !== PortSceneState.TavernBuySupplies ? null :
                    <Row>
                        <Col
                            aria-label="Tavern buy suplies section description"
                            className="fs-sm text-left">
                            Buy some supplies
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.TavernFireCrew ? null :
                    <Row>
                        <Col
                            aria-label="Tavern fire crew section description"
                            className="fs-sm text-left">
                            Select specific crew members to let go, or let the quartermaster pick automatically given a number.
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.TavernHireCrew ? null :
                    <Row>
                        <Col
                            aria-label="Tavern hire crew section description"
                            className="fs-sm text-left">
                            Select specific crew members to hire, or let the quartemaster pick automatically given a number.
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.TavernFireOfficers ? null :
                    <Row>
                        <Col
                            aria-label="Tavern fire officers section description"
                            className="fs-sm text-left">
                            Which of your officers would you let go?
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.TavernHireOfficers ? null :
                    <Row>
                        <Col
                            aria-label="Tavern hire officers section description"
                            className="fs-sm text-left">
                            Which officer position are trying to fill?
                        </Col>
                    </Row>
                }
            </div>);
    }
}