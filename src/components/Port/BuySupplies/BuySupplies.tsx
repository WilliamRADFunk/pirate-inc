import React from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import { Subscription } from 'rxjs';
import { combineLatestWith, filter, switchMap } from 'rxjs/operators';

import styles from './BuySupplies.module.scss';
import { portManager } from '../../../Services/PortManager';
import { Port } from '../../../Types/Port';
import { gameManager } from '../../../Services/GameManager';

interface Props {}

interface State {
    availableProvisions: [number, number, number];
    currentPort: Port | null;
    intendedProvisionPurchase: [number, number, number];
    provisionPrices: [number, number, number];
    provisions: [number, number, number];
    purchaseTotal: number;
}

export class BuySupplies extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            availableProvisions: [0, 0, 0],
            currentPort: null,
            intendedProvisionPurchase: [0, 0, 0],
            provisionPrices: [0, 0, 0],
            provisions: [0, 0, 0],
            purchaseTotal: 0
        };
    }

    private _changeIndex(provIndex: number, dir: number): void {
        const intendedProvisionPurchases = this.state.intendedProvisionPurchase;
    }

    private _buyProvisions(): void {
    }

    public componentDidMount() {
        this.subscriptions.push(
            gameManager.getProvisions().subscribe(prov => {
                this.setState({ provisions: prov });
            }),
            portManager.getCurrentPort()
                .pipe(
                    filter(port => !!port),
                    switchMap(port => {
                        this.setState({ currentPort: port });
                        return port.availableProvisions.pipe(combineLatestWith(port.provisionPrices));
                    })
                ).subscribe((portData: [[number, number, number], [number, number, number]]) => {
                    this.setState({
                        availableProvisions: portData[0],
                        provisionPrices: portData[1]
                    });
                })
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public render() {
        const { availableProvisions, intendedProvisionPurchase } = this.state;
        const children = React.Children.toArray(this.props.children);
        const hasProvisions = availableProvisions.reduce((acc, val) => { return acc += val; }, 0);
        return (
            <Row className='no-gutters'>
                <Col xs='12' aria-label='Officers Manifest section' className='text-center text-light'>
                    <Row className='no-gutters mb-2'>
                        <Col className='col-6 offset-3'>
                            <h2 className={ styles['buy-supplies-header'] }>Buy Supplies</h2>
                        </Col>
                        <Col className='col-1'>
                            <div className={ styles['buy-supplies-help'] + ' text-right' }>
                                { children[0] }
                            </div>
                        </Col>
                        <Col className='col-2'>
                            <div className={ styles['buy-supplies-exit'] + ' text-left' }>
                                { children[1] }
                            </div>
                        </Col>
                    </Row>
                    <Row className='no-gutters mb-3'>
                        {/* { !currRecruit
                            ? <Col className='col-6 offset-3'>
                                <h5 className={ styles['buy-supplies-name-header'] }>&nbsp;</h5>
                              </Col>
                            : <Col className='col-6 offset-3'>
                                <h5 className={ styles['buy-supplies-name-header'] }>
                                    { `${currRecruit.nameFirst}${ currRecruit.nameNick ? ` '${currRecruit.nameNick}' ` : ' '}${currRecruit.nameLast}` }
                                </h5>
                              </Col>
                        } */}
                    </Row>
                    { hasProvisions
                        ? <div
                            className={ styles['avatar-sizing'] }
                            dangerouslySetInnerHTML={{__html:  `
                                <svg viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="20vw" height="25vw" fill="transparent"/>
                                </svg>`}}>
                          </div>
                        : <div
                            className={ styles['avatar-sizing'] }
                            dangerouslySetInnerHTML={{__html: `
                                <svg viewBox="0 0 360 369" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="20vw" height="25vw" fill="transparent"/>
                                </svg>`}}>
                          </div>
                    }
                    <div style={{ minHeight: '32vw', position: 'relative', width: '100%' }}>
                        <div className={ styles['table-bg-wrapper'] + ' no-select' }>
                            <Image src='images/tavern-table.svg' alt='tavern table' style={{ width: '90%' }}/>
                        </div>
                        <div className={ styles['luxury-provisions-wrapper'] + ' no-select' }>
                            <Row className='no-gutters'>
                                <Col xs={{ span: 6, offset: 3}} className='text-center'>
                                    <Image src='images/flour.png' alt='luxury provisions - flour' className={ styles['luxury-provisions'] }/>
                                    <Image src='images/meat.png' alt='luxury provisions - meat' className={ styles['luxury-provisions'] }/>
                                    <Image src='images/fruits-veggies.png' alt='luxury provisions - fruits and veggies' className={ styles['luxury-provisions'] }/>
                                </Col>
                            </Row>
                            <Row className='no-gutters'>
                                <Col xs={{ span: 6, offset: 3}} className='text-center'>
                                    <Image src='images/bread.png' alt='luxury provisions - bread' className={ styles['luxury-provisions'] }/>
                                    <Image src='images/cheese.png' alt='luxury provisions - cheese' className={ styles['luxury-provisions'] }/>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        );
    }
}