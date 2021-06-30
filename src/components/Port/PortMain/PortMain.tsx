import React from "react";
import { Col, Row } from "react-bootstrap";

import { Subscription } from "rxjs";
import { PortSceneState, stateManager } from "../../../Services/StateManager";

import { Bungalow } from "../Bungalow/Bungalow";
import { ColonialOffice } from "../ColonialOffice/ColonialOffice";
import { Shipyard } from "../Shipyard/Shipyard";
import { Tavern } from "../Tavern/Tavern";

interface Props {}

interface State {
    portSceneState: PortSceneState;
}

export class PortMain extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            portSceneState: PortSceneState.Menu
        };
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
            <Col xs="12" xl={{ span: 10, offset: 1 }} className="boundaries">
                <Row>
                    { portSceneState > PortSceneState.TavernOptions ? null :
                        <>
                            <Col xs="12" xl="5" className="rope-border-square small-square">
                                <Shipyard></Shipyard>
                            </Col>
                            <Col xs="12" xl={{ span: 5, offset: 2 }} className="rope-border-square small-square">
                                <Tavern></Tavern>
                            </Col>
                            <Col xs="12" xl="5" className="rope-border-square small-square">
                                <ColonialOffice></ColonialOffice>
                            </Col>
                            <Col xs="12" xl={{ span: 5, offset: 2 }} className="rope-border-square small-square">
                                <Bungalow></Bungalow>
                            </Col>
                        </>
                    }
                    { (portSceneState < PortSceneState.BungalowCrewManifest || PortSceneState.BungalowShipManifest < portSceneState) ? null :
                        <Col xs="12" className="boundaries">
                            <Bungalow></Bungalow>
                        </Col>
                    }
                    { (portSceneState < PortSceneState.ColonialOfficeBribe || PortSceneState.ColonialOfficeWritOfProtection < portSceneState) ? null :
                        <Col xs="12" className="boundaries">
                            <ColonialOffice></ColonialOffice>
                        </Col>
                    }
                    { (portSceneState < PortSceneState.ShipyardBuy || PortSceneState.ShipyardSell < portSceneState) ? null :
                        <Col xs="12" className="boundaries">
                            <Shipyard></Shipyard>
                        </Col>
                    }
                    { portSceneState < PortSceneState.TavernBuySupplies ? null :
                        <Col xs="12" className="boundaries">
                            <Tavern></Tavern>
                        </Col>
                    }
                </Row>
            </Col>
        );
    }
}