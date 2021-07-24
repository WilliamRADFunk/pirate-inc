import React from 'react';
import { Col, Image, OverlayTrigger, Row } from 'react-bootstrap';
import { Subscription } from 'rxjs';
import { combineLatestWith, filter, switchMap } from 'rxjs/operators';
import { MdHelpOutline } from 'react-icons/md';

import styles from './Provisions.module.scss';
import { portManager } from '../../../Services/PortManager';
import { Merchant, Port } from '../../../Types/Port';
import { gameManager } from '../../../Services/GameManager';
import { GUID } from '../../../Helpers/GUID';
import { RenderTooltip } from '../../../Helpers/Tooltip';

interface Props {}

interface State {
    availableProvisions: [number, number, number];
    currentPort: Port | null;
    intendedProvisionPurchase: [number, number, number];
    intendedProvisionSale: [number, number, number];
    provisionBuyPrices: [number, number, number];
    provisionSellPrices: [number, number, number];
    provisions: [number, number, number];
    purchaseTotal: number;
}

export class Provisions extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            availableProvisions: [0, 0, 0],
            currentPort: null,
            intendedProvisionPurchase: [0, 0, 0],
            intendedProvisionSale: [0, 0, 0],
            provisionBuyPrices: [0, 0, 0],
            provisionSellPrices: [0, 0, 0],
            provisions: [0, 0, 0],
            purchaseTotal: 0
        };
    }

    private _changeBuyIndex(provIndex: number, dir: number): void {
        const intendedProvisionPurchases = this.state.intendedProvisionPurchase;
    }

    private _changeSellIndex(provIndex: number, dir: number): void {
        const intendedProvisionSale = this.state.intendedProvisionSale;
    }

    private _buyProvisions(): void {
    }

    private _sellProvisions(): void {
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
                        provisionBuyPrices: portData[1],
                        provisionSellPrices: portData[1].map(val => val * 0.9) as [number, number, number]
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
        const { availableProvisions, intendedProvisionPurchase, intendedProvisionSale, currentPort, provisionBuyPrices } = this.state;
        const children = React.Children.toArray(this.props.children);
        const merchant = currentPort?.merchant as Merchant;
        const hasProvisions = availableProvisions.reduce((acc, val) => { return acc += val; }, 0) > 0;
        const canBuy = intendedProvisionPurchase.reduce((acc, val) => { return acc += val; }, 0) > 0;
        const canSell = intendedProvisionSale.reduce((acc, val) => { return acc += val; }, 0) > 0;
        return (
            <Row className='no-gutters'>
                <Col xs='12' aria-label='Officers Manifest section' className='text-center text-light'>
                    <Row className='no-gutters mb-2'>
                        <Col className='col-6 offset-3'>
                            <h2 className={ styles['provisions-header'] }>Buy or Sell Provisions</h2>
                        </Col>
                        <Col className='col-1'>
                            <div className={ styles['provisions-help'] + ' text-right' }>
                                { children[0] }
                            </div>
                        </Col>
                        <Col className='col-2'>
                            <div className={ styles['provisions-exit'] + ' text-left' }>
                                { children[1] }
                            </div>
                        </Col>
                    </Row>
                    <Row className='no-gutters mb-3'>
                        <Col className='col-6 offset-3'>
                            <h5 className={ styles['provisions-name-header'] }>
                                { `Master ${merchant?.nameFirst}${ merchant?.nameNick ? ` '${merchant?.nameNick}' ` : ' '}${merchant?.nameLast}` }
                            </h5>
                        </Col>
                    </Row>
                    { hasProvisions
                        ? <div
                            className={ styles['avatar-sizing'] }
                            dangerouslySetInnerHTML={{__html: merchant?.avatar ?? `
                                <svg viewBox='0 0 360 360' xmlns='http://www.w3.org/2000/svg'>
                                    <rect width='20vw' height='25vw' fill='transparent'/>
                                </svg>`}}>
                          </div>
                        : <div
                            className={ styles['avatar-sizing'] }
                            dangerouslySetInnerHTML={{__html: `
                                <svg viewBox='0 0 360 369' xmlns='http://www.w3.org/2000/svg'>
                                    <rect width='20vw' height='25vw' fill='transparent'/>
                                </svg>`}}>
                          </div>
                    }
                    <div style={{ minHeight: '32vw', position: 'relative', width: '100%' }}>
                        <div className={ styles['table-bg-wrapper'] + ' no-select' }>
                            <Image src='images/tavern-table.svg' alt='tavern table' style={{ width: '90%' }}/>
                        </div>
                        <div className={ styles['provisions-wrapper'] + ' no-select' }>
                            <Row className={ styles['provisions-backing-wrapper'] + ' no-gutters'}>
                                <Col xs={{ span: 2, offset: 2 }} className='text-center'>
                                    <Image src='images/scroll-sideways.png' alt='Scroll background for luxury provisions label' className={ styles['provisions-backing'] }/>
                                </Col>
                                <Col xs={{ span: 2, offset: 1 }} className='text-center'>
                                    <Image src='images/scroll-sideways.png' alt='Scroll background for average provisions label' className={ styles['provisions-backing'] }/>
                                </Col>
                                <Col xs={{ span: 2, offset: 1 }} className='text-center'>
                                    <Image src='images/scroll-sideways.png' alt='Scroll background for sparse provisions label' className={ styles['provisions-backing'] }/>
                                </Col>
                            </Row>
                            <Row className={ styles['provisions-labels-wrapper'] + ' no-gutters text-dark'}>
                                <Col xs={{ span: 2, offset: 2 }} className='text-left'>
                                    <Row className='no-gutters'>
                                        <Col xs='8'>
                                            Luxurious:
                                        </Col>
                                        <Col xs='3' className='text-center'>
                                            <span className={ styles['provisions-price'] }>${ provisionBuyPrices[0] }</span>
                                        </Col>
                                        <Col xs='1' className='text-right'>
                                            <span className={ styles['provisions-quantity-help'] }>
                                            <OverlayTrigger rootClose
                                                key={GUID()}
                                                placement='top'
                                                delay={{ show: 100, hide: 250 }}
                                                overlay={RenderTooltip({
                                                    children: 'Premium food and wine to keep your crew in high spirits'
                                                })}>
                                                {({ ref, ...triggerHandler }) => ( 
                                                    <span ref={ref} {...triggerHandler }>
                                                        <MdHelpOutline></MdHelpOutline>
                                                    </span>
                                                )}
                                            </OverlayTrigger>
                                            </span>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={{ span: 2, offset: 1 }} className='text-left'>
                                    <Row className='no-gutters'>
                                        <Col xs='8'>
                                            Average:
                                        </Col>
                                        <Col xs='3' className='text-center'>
                                            <span className={ styles['provisions-price'] }>${ provisionBuyPrices[1] }</span>
                                        </Col>
                                        <Col xs='1' className='text-right'>
                                            <span className={ styles['provisions-quantity-help'] }>
                                            <OverlayTrigger rootClose
                                                key={GUID()}
                                                placement='top'
                                                delay={{ show: 100, hide: 250 }}
                                                overlay={RenderTooltip({
                                                    children: 'Enough food and beer to keep the crew from complaining'
                                                })}>
                                                {({ ref, ...triggerHandler }) => ( 
                                                    <span ref={ref} {...triggerHandler }>
                                                        <MdHelpOutline></MdHelpOutline>
                                                    </span>
                                                )}
                                            </OverlayTrigger>
                                            </span>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={{ span: 2, offset: 1 }} className='text-left'>
                                    <Row className='no-gutters'>
                                        <Col xs='8'>
                                            Sparse:
                                        </Col>
                                        <Col xs='3' className='text-center'>
                                            <span className={ styles['provisions-price'] }>${ provisionBuyPrices[2] }</span>
                                        </Col>
                                        <Col xs='1' className='text-right'>
                                            <span className={ styles['provisions-quantity-help'] }>
                                            <OverlayTrigger rootClose
                                                key={GUID()}
                                                placement='top'
                                                delay={{ show: 100, hide: 250 }}
                                                overlay={RenderTooltip({
                                                    children: 'The bare minimum food and water to keep the crew alive physically, but morale will suffer'
                                                })}>
                                                {({ ref, ...triggerHandler }) => ( 
                                                    <span ref={ref} {...triggerHandler }>
                                                        <MdHelpOutline></MdHelpOutline>
                                                    </span>
                                                )}
                                            </OverlayTrigger>
                                            </span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className={ styles['provisions-platter-wrapper'] + ' no-gutters'}>
                                <Col xs={{ span: 2, offset: 2 }} className='text-center'>
                                    <Image src='images/platter-3.png' alt='luxury provisions' className={ styles['provisions'] }/>
                                </Col>
                                <Col xs={{ span: 2, offset: 1 }} className='text-center'>
                                    <Image src='images/platter-2.png' alt='average provisions' className={ styles['provisions'] }/>
                                </Col>
                                <Col xs={{ span: 2, offset: 1 }} className='text-center'>
                                    <Image src='images/platter-1.png' alt='sparse provisions' className={ styles['provisions'] }/>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        );
    }
}