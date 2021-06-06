import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";

import { Subscription } from "rxjs";

interface Props {}

interface State {
    shipYardMode: ShipYardMode;
}

enum ShipYardMode {
    Hidden = 0,
    Options = 1,
    Buy = 2,
    Sell = 3,
    Repair = 4,
    Outfit = 5
}

export class Shipyard extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            shipYardMode: ShipYardMode.Hidden
        };
    }

    private toggleMode(mode: ShipYardMode): void {
        if (mode >= ShipYardMode.Hidden && ShipYardMode.Outfit >= mode) {
            this.setState({ shipYardMode: mode });
        }
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
        const { shipYardMode } = this.state;
        return (
            <Col xs="12" lg="5" className="boundaries mt-5">
                <Row className="border-white border-bottom mb-2">
                    <Col xs={{ span: 8, offset: 2 }}
                        aria-label="Shipyard section"
                        className="text-center">
                        Shipyard
                    </Col>
                    <Button
                        variant="outline-secondary"
                        className="border-0 col-2"
                        onClick={() => shipYardMode === ShipYardMode.Hidden
                            ? this.toggleMode(ShipYardMode.Options)
                            : this.toggleMode(ShipYardMode.Hidden)}>
                        { shipYardMode === ShipYardMode.Hidden
                            ? <Eye color="white" size={20}></Eye>
                            : <EyeSlash color="white" size={20}></EyeSlash>
                        }
                    </Button>
                </Row>
                { shipYardMode !== ShipYardMode.Options ? null :
                    <Row>
                        <Button
                            aria-label="Open shipyard buy ships section"
                            variant="link"
                            className="col-4 offset-1"
                            onClick={() => this.toggleMode(ShipYardMode.Buy)}>
                            Buy
                        </Button>
                        <Button
                            aria-label="Open shipyard sell ships section"
                            variant="link"
                            className="col-4 offset-2"
                            onClick={() => this.toggleMode(ShipYardMode.Sell)}>
                            Sell
                        </Button>
                        <Button
                            aria-label="Open shipyard repair ships section"
                            variant="link"
                            className="col-4 offset-1"
                            onClick={() => this.toggleMode(ShipYardMode.Repair)}>
                            Repair
                        </Button>
                        <Button
                            aria-label="Open shipyard outfit ships section"
                            variant="link"
                            className="col-4 offset-2"
                            onClick={() => this.toggleMode(ShipYardMode.Outfit)}>
                            Outfit
                        </Button>
                    </Row>
                }
                { shipYardMode !== ShipYardMode.Buy ? null :
                    <Row>
                        <Col
                            aria-label="Shipyard buy ships section description"
                            className="fs-sm text-left">
                            There are a total of {0} ships available for purchase.
                            <br/>Select ship from list for details.
                        </Col>
                    </Row>
                }
                { shipYardMode !== ShipYardMode.Sell ? null :
                    <Row>
                        <Col
                            aria-label="Shipyard sell ships section description"
                            className="fs-sm text-left">
                            Select one of your ships from the list.
                            <br/>It's price is dependent on current condition, outfitting, and given need of this port.
                        </Col>
                    </Row>
                }
                { shipYardMode !== ShipYardMode.Repair ? null :
                    <Row>
                        <Col
                            aria-label="Shipyard repair ships section description"
                            className="fs-sm text-left">
                            Select a damaged ship from the list to see cost for repairs.
                            <br/>If you have no damaged ships, there will be no list.
                        </Col>
                    </Row>
                }
                { shipYardMode !== ShipYardMode.Outfit ? null :
                    <Row>
                        <Col
                            aria-label="Shipyard outfit ships section description"
                            className="fs-sm text-left">
                            The port has limited supplies of canon, armor, and sail cloth.
                            <br/>Each ship will also have a limit.
                            <br/>Select ship to buy or sell it's outfitting.
                        </Col>
                    </Row>
                }
            </Col>
        );
    }
}