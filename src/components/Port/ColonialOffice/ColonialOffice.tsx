import React from 'react';
import { Button, Col, Image, Row } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

import { Subscription } from 'rxjs';
import { PortSceneState, stateManager } from '../../../Services/StateManager';

interface Props {}

interface State {
    portSceneState: PortSceneState;
}

export class ColonialOffice extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            portSceneState: PortSceneState.Menu
        };
    }

    private toggleMode(): void {
        const currState = this.state.portSceneState;
        if (currState !== PortSceneState.ColonialOfficeOptions) {
            stateManager.changePortSceneState(PortSceneState.ColonialOfficeOptions);
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
                <Row className='mb-2 no-gutters'>
                    <Col xs={{ span: 7, offset: 2 }}
                        aria-label='Colonial Office section'
                        className='text-center clickable double-line-headers'
                        onClick={() => this.toggleMode()}>
                        <span>Colonial Office</span>
                    </Col>
                    <Button
                        variant='link'
                        className='border-0 col-2 text-dark'
                        onClick={() => this.toggleMode()}>
                        { portSceneState !== PortSceneState.ColonialOfficeOptions
                            ? <Eye></Eye>
                            : <EyeSlash></EyeSlash>
                        }
                    </Button>
                </Row>
                { (PortSceneState.ColonialOfficeBribe <= portSceneState && portSceneState <= PortSceneState.ColonialOfficeWritOfProtection) || portSceneState === PortSceneState.ColonialOfficeOptions
                    ? null
                    : <Image
                        src='images/colonial-office-icon.png'
                        alt='colonial office icon'
                        width='50%'
                        height='50%'
                        className='small-square-icon'
                        onClick={() => this.toggleMode()}/>
                }
                { portSceneState !== PortSceneState.ColonialOfficeOptions ? null :
                    <Row className='no-gutters'>
                        <Button
                            aria-label='Open colonial office bribe officials section'
                            variant='link'
                            className='col-12 col-md-2 col-xl-12 offset-md-1 offset-xl-0 text-dark fs-md mt-4 mb-2 my-md-4 mt-xl-4 mb-xl-2'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.ColonialOfficeBribe)}>
                            Bribe Officials
                        </Button>
                        <Button
                            aria-label='Open colonial office purchase royal pardon section'
                            variant='link'
                            className='col-12 col-md-4 col-xl-12 text-dark fs-md my-2 my-md-4 my-xl-2'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.ColonialOfficeRoyalPardon)}>
                            Purchase Royal Pardon
                        </Button>
                        <Button
                            aria-label='Open colonial office purchase writ of protection section'
                            variant='link'
                            className='col-12 col-md-4 col-xl-12 text-dark fs-md mt-2 mb-5 my-md-4 mt-xl-2 mb-xl-5'
                            onClick={() => stateManager.changePortSceneState(PortSceneState.ColonialOfficeWritOfProtection)}>
                            Purchase Writ of Protection
                        </Button>
                    </Row>
                }
                { portSceneState !== PortSceneState.ColonialOfficeBribe ? null :
                    <Row className='no-gutters'>
                        <Col
                            aria-label='Colonial Office bribe officials section description'
                            className='fs-sm text-left'>
                            This is a (small, medium, or large) port. To bribe all of the officials will cost $. Do you still want to bribe them?
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.ColonialOfficeRoyalPardon ? null :
                    <Row className='no-gutters'>
                        <Col
                            aria-label='Colonial Office purchase royal pardon section description'
                            className='fs-sm text-left'>
                            Purchasing a royal pardon is expensive but can drastically lower your bounty, and add a small bump to crown favor.
                        </Col>
                    </Row>
                }
                { portSceneState !== PortSceneState.ColonialOfficeWritOfProtection ? null :
                    <Row className='no-gutters'>
                        <Col
                            aria-label='Colonial Office writ of protection section description'
                            className='fs-sm text-left'>
                            Purchasing a writ of protection has no affect on your bounty, infamy or crown favor, but it will ensure you are not arrested in this port for the next # turns.
                        </Col>
                    </Row>
                }
            </div>);
    }
}