import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

import { Subscription } from 'rxjs';
import { PortSceneState, stateManager } from '../../../Services/StateManager';

interface Props {}

interface State {
    portSceneState: PortSceneState;
}

export class Shipyard extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            portSceneState: PortSceneState.Menu
        };
    }

    private toggleMode(): void {
        const currState = this.state.portSceneState;
        if (currState !== PortSceneState.ShipyardOptions) {
            stateManager.changePortSceneState(PortSceneState.ShipyardOptions);
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
            <div className='w-100 h-100 text-dark'>
                <Row className='mb-2'>
                    <Col xs={{ span: 6, offset: 3 }}
                        aria-label='Shipyard section'
                        className='text-center clickable'
                        onClick={() => this.toggleMode()}>
                        Shipyard
                    </Col>
                    <Button
                        variant='link'
                        className='border-0 col-2 text-dark'
                        onClick={() => this.toggleMode()}>
                        { portSceneState !== PortSceneState.ShipyardOptions
                            ? <Eye></Eye>
                            : <EyeSlash></EyeSlash>
                        }
                    </Button>
                </Row>
                { (PortSceneState.ShipyardBuy <= portSceneState && portSceneState <= PortSceneState.ShipyardSell) || portSceneState === PortSceneState.ShipyardOptions
                    ? null
                    : <img
                        src='images/shipyard-icon.png'
                        alt='shipyard icon'
                        width='50%'
                        height='50%'
                        className='small-square-icon clickable'
                        onClick={() => this.toggleMode()}/>
                }
                { portSceneState !== PortSceneState.ShipyardOptions ? null :
                    <Row>
                        <Button
                            aria-label='Open shipyard buy ships section'
                            variant='link'
                            className='col-4 offset-1 text-dark my-4 fs-md text-xl-left'
                            size='lg'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.ShipyardBuy)}>
                            Buy Ships
                        </Button>
                        <Button
                            aria-label='Open shipyard sell ships section'
                            variant='link'
                            className='col-4 offset-2 text-dark my-4 fs-md'
                            size='lg'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.ShipyardSell)}>
                            Sell Ships
                        </Button>
                        <Button
                            aria-label='Open shipyard repair ships section'
                            variant='link'
                            className='col-xl-5 col-4 offset-1 text-dark my-4 fs-md text-xl-left'
                            size='lg'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.ShipyardRepair)}>
                            Repair Hull
                        </Button>
                        <Button
                            aria-label='Open shipyard outfit ships section'
                            variant='link'
                            className='col-4 offset-2 offset-xl-1 text-dark my-4 fs-md'
                            size='lg'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.ShipyardOutfit)}>
                            Outfitting
                        </Button>
                    </Row>
                }
                { portSceneState !== PortSceneState.ShipyardBuy ? null :
                    <Row>
                        <Col
                            aria-label='Shipyard buy ships section description'
                            className='fs-sm text-left'>
                            There are a total of {0} ships available for purchase.
                            <br/>Select ship from list for details.
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.ShipyardSell ? null :
                    <Row>
                        <Col
                            aria-label='Shipyard sell ships section description'
                            className='fs-sm text-left'>
                            Select one of your ships from the list.
                            <br/>It's price is dependent on current condition, outfitting, and given need of this port.
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.ShipyardRepair ? null :
                    <Row>
                        <Col
                            aria-label='Shipyard repair ships section description'
                            className='fs-sm text-left'>
                            Select a damaged ship from the list to see cost for repairs.
                            <br/>If you have no damaged ships, there will be no list.
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.ShipyardOutfit ? null :
                    <Row>
                        <Col
                            aria-label='Shipyard outfit ships section description'
                            className='fs-sm text-left'>
                            The port has limited supplies of canon, armor, and sail cloth.
                            <br/>Each ship will also have a limit.
                            <br/>Select ship to buy or sell it's outfitting.
                        </Col>
                    </Row>
                }
            </div>);
    }
}