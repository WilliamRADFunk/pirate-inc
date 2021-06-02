import React from "react";
import { Button } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";

import { Subscription } from "rxjs";

import { gameManager } from "../../../services/GameManager";

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
            <div className="boundaries col-12 col-lg-5 mt-5">
                <div className="row">
                    <div
                        aria-label="Shipyard section"
                        className="col-8 offset-2 text-center">
                        Shipyard
                    </div>
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
                </div>
                { shipYardMode !== ShipYardMode.Options ? null :
                    <div className="row">
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
                    </div>
                }
                { shipYardMode !== ShipYardMode.Buy ? null :
                    <div className="row">
                        <div
                            aria-label="Shipyard buy ships section"
                            className="col-12">
                            Buy Ships
                        </div>
                    </div>
                }
                { shipYardMode !== ShipYardMode.Sell ? null :
                    <div className="row">
                        <div
                            aria-label="Shipyard sell ships section"
                            className="col-12">
                            Sell Ships
                        </div>
                    </div>
                }
                { shipYardMode !== ShipYardMode.Repair ? null :
                    <div className="row">
                        <div
                            aria-label="Shipyard repair ships section"
                            className="col-12">
                            Repair Ships
                        </div>
                    </div>
                }
                { shipYardMode !== ShipYardMode.Outfit ? null :
                    <div className="row">
                        <div
                            aria-label="Shipyard outfit ships section"
                            className="col-12">
                            Outfit Ships
                        </div>
                    </div>
                }
            </div>
        );
    }
}