import React from 'react';
import { Button, Col, Image, OverlayTrigger, Row, Table } from 'react-bootstrap';
import { AiFillMedicineBox } from 'react-icons/ai';
import { BiTargetLock } from 'react-icons/bi';
import { FaBoxes, FaSort, FaShieldAlt } from 'react-icons/fa';
import { GiCannon, GiReceiveMoney, GiSailboat, GiSinkingShip } from 'react-icons/gi';
import { BehaviorSubject, Subscription } from 'rxjs';

import styles from './FleetManifest.module.scss';
import { gameManager } from '../../../Services/GameManager';
import { GUID } from '../../../Helpers/GUID';
import { RenderTooltip } from '../../../Helpers/Tooltip';
import { Ship } from '../../../Objects/Ships/Ship';
import { formatter } from '../../../Helpers/Format';
import { Cargo } from '../../../Types/Cargo';

interface Props {}

interface State {
    fleet: Ship[];
}

function renderFullscreenTableHeader(props: any): JSX.Element {
    return (<>
        { props.headerLabel }
        <OverlayTrigger
            key={GUID()}
            placement='top'
            delay={{ show: 100, hide: 250 }}
            overlay={RenderTooltip({ children: `Sort ${props.headerLabel.toLowerCase() }` })}>
            {({ ref, ...triggerHandler }) => (
                <span ref={ ref } {...triggerHandler} className='clickable ml-1' onClick={ () => props.sortBy() }><FaSort /></span>
            )}
        </OverlayTrigger>
    </>);
}

export class FleetManifest extends React.Component<Props, State> {
    private lastSort: BehaviorSubject<[string, string, boolean]> = new BehaviorSubject(['', '', true] as [string, string, boolean]);
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            fleet: []
        };
    }

    private _reduceCarriedCargo(cargo: Cargo[]): number {
        const carriedQuantity = cargo.reduce((sum, cargo) => {
            return sum += cargo.quantity;
        }, 0);
        return carriedQuantity;
    }

    private _scuttleShip(ship: Ship): void {
        gameManager.scuttleShip(ship);
    }

    private _sortBy(key: string, secondaryKey?: string): void {
        secondaryKey = secondaryKey ?? '';
        const lastSort = this.lastSort.value;
        // Whether or not the sort direction is ascending. Should flip to false if this is 2nd time same sort button is clicked.
        let dir = lastSort[2];
        if (key === lastSort[0] && secondaryKey === lastSort[1]) {
            dir = !dir;
        } else {
            dir = true;
        }
        this.lastSort.next([key, secondaryKey, dir]);
        gameManager.sortFleetManifest(key, secondaryKey, dir);
    }

    private _splitTripleScore(val: [number, number, number]): string {
        return `(${val[0].toFixed(0)}, ${val[1].toFixed(0)}, ${val[2].toFixed(0)})`;
    }

    public componentDidMount() {
        this.subscriptions.push(
            gameManager.getFleet().subscribe(fleet => {
                this.setState({ fleet });
            })
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public render() {
        const { fleet } = this.state;
        const fleetStats = gameManager.getFleetStats();
        const children = React.Children.toArray(this.props.children);
        return (<>
            <div className={ styles['scroll-top'] }>
                <Image
                    src='images/scroll-top.png'
                    width='100%'
                    height='auto'
                    alt='Top of fleet manifest scroll'
                    style={{ width: '100%', height: 'auto' }}/>
            </div>
            <div className={ styles['scroll-bottom'] }>
                <Image
                    src='images/scroll-bottom.png'
                    width='100%'
                    height='auto'
                    alt='Bottom of fleet manifest scroll'
                    style={{ width: '100%', height: 'auto' }}/>
            </div>
            <Row className='mb-2 mx-1' style={{ position: 'relative', zIndex: 3 }}>
                <Col xs='12'
                    aria-label='Fleet Manifest section'
                    className='text-center'>
                    <Row className='no-gutters mb-5'>
                        <Col className='col-6 offset-3'>
                            <h2 className={ styles['manifest-header'] }>Fleet Manifest</h2>
                        </Col>
                        <Col className='col-1'>
                            <div className={ styles['manifest-help'] + ' text-right' }>
                                { children[0] }
                            </div>
                        </Col>
                        <Col className='col-2'>
                            <div className={ styles['manifest-exit'] + ' text-left' }>
                                { children[1] }
                            </div>
                        </Col>
                    </Row>
                    <Table className={ styles['manifest'] + ' table-striped px-5' }>
                        <thead>
                            <tr>
                                <th className='mr-3'>Ship</th>
                                <th className='mr-3'>
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Type',
                                            sortBy: () => this._sortBy('type')
                                        })
                                    }
                                </th>
                                <th className='mr-3'>
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Name',
                                            sortBy: () => this._sortBy('name')
                                        })
                                    }
                                </th>
                                <th className='mr-3'>
                                    <Row className='no-gutters'>
                                        <Col className='clickable' aria-label='armor'>
                                            <span onClick={ () => this._sortBy('armor')}>
                                                <FaShieldAlt />
                                            </span>
                                        </Col>
                                        <Col className='clickable' aria-label='speed'>
                                            <span onClick={ () => this._sortBy('speed')}>
                                                <GiSailboat />
                                            </span>
                                        </Col>
                                        <Col className='clickable' aria-label='cargo capacity'>
                                            <span onClick={ () => this._sortBy('cargoCapacity')}>
                                                <FaBoxes />
                                            </span>
                                        </Col>
                                        <Col className='clickable' aria-label='health'>
                                            <span onClick={ () => this._sortBy('health')}>
                                                <AiFillMedicineBox />
                                            </span>
                                        </Col>
                                        <Col className={ styles['no-break'] + ' clickable' } aria-label='first fire accuracy'>
                                            <span onClick={ () => this._sortBy('firstFireAccuracy')}>
                                                <BiTargetLock />
                                            </span>
                                        </Col>
                                        <Col className={ styles['no-break'] + ' clickable' } aria-label='main gun accuracy'>
                                            <span onClick={ () => this._sortBy('mainAccuracy')}>
                                                <BiTargetLock />
                                            </span>
                                        </Col>
                                        <Col className={ styles['no-break'] + ' clickable' } aria-label='first fire damage'>
                                            <span onClick={ () => this._sortBy('firstFireDamage')}>
                                                <GiCannon />
                                            </span>
                                        </Col>
                                        <Col className={ styles['no-break'] + ' clickable' } aria-label='main gun damage'>
                                            <span onClick={ () => this._sortBy('mainDamage')}>
                                                <GiCannon />
                                            </span>
                                        </Col>
                                        <Col className='clickable' aria-label='value'>
                                            <span onClick={ () => this._sortBy('value')}>
                                                <GiReceiveMoney />
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row className='no-gutters'>
                                        <Col className='clickable' aria-label='armor average'>
                                            <span onClick={ () => this._sortBy('armor')}>
                                                { fleetStats.armor }
                                            </span>
                                        </Col>
                                        <Col className='clickable' aria-label='speed average'>
                                            <span onClick={ () => this._sortBy('speed')}>
                                                { fleetStats.speed }
                                            </span>
                                        </Col>
                                        <Col className='clickable' aria-label='cargo capacity total'>
                                            <span onClick={ () => this._sortBy('cargoCapacity')}>
                                                { fleetStats.cargoCapacity }
                                            </span>
                                        </Col>
                                        <Col className='clickable' aria-label='health average'>
                                            <span onClick={ () => this._sortBy('health')}>
                                                { fleetStats.health }
                                            </span>
                                        </Col>
                                        <Col className={ styles['no-break'] + ' clickable' } aria-label='first fire accuracy'>
                                            <span onClick={ () => this._sortBy('firstFireAccuracy')}>
                                                { this._splitTripleScore(fleetStats.firstFireAccuracy) }
                                            </span>
                                        </Col>
                                        <Col className={ styles['no-break'] + ' clickable' } aria-label='main gun accuracy'>
                                            <span onClick={ () => this._sortBy('mainFireAccuracy')}>
                                                { this._splitTripleScore(fleetStats.mainAccuracy) }
                                            </span>
                                        </Col>
                                        <Col className={ styles['no-break'] + ' clickable' } aria-label='first fire damage'>
                                            <span onClick={ () => this._sortBy('firstFireDamage')}>
                                                { this._splitTripleScore(fleetStats.firstFireDmg) }
                                            </span>
                                        </Col>
                                        <Col className={ styles['no-break'] + ' clickable' } aria-label='main gun damage'>
                                            <span onClick={ () => this._sortBy('mainFireDamage')}>
                                                { this._splitTripleScore(fleetStats.mainDamage) }
                                            </span>
                                        </Col>
                                        <Col className='clickable' aria-label='value total'>
                                            <span onClick={ () => this._sortBy('value')}>
                                                ${ fleetStats.value }
                                            </span>
                                        </Col>
                                    </Row>
                                </th>
                                <th className='mr-3'>
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Crew: Min/Max (Current)',
                                            sortBy: () => { this._sortBy('maxCrew'); this._sortBy('maxCrew'); this._sortBy('crewCount') }
                                        })
                                    }
                                </th>
                                <th className='mr-3'>
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Cargo',
                                            sortBy: () => this._sortBy('cargoCarriedType')
                                        })
                                    }
                                </th>
                                <th>
                                    Scuttle
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                fleet.map(f => {
                                    return (<tr key={`${f.getName()}`}>
                                        <td className={ styles['avatar-sizing'] }>
                                            <span className={ styles['avatar-sizing'] }>
                                                { f.getIcon() }
                                            </span>
                                        </td>
                                        <td>
                                            { f.getType() }
                                        </td>
                                        <td className={ styles['middle'] }>
                                            { f.getName() }
                                        </td>
                                        <td>
                                            <Row className='no-gutters'>
                                                <Col>
                                                    { f.getArmorLevel() }
                                                </Col>
                                                <Col>
                                                    { f.getTopSpeed() }
                                                </Col>
                                                <Col>
                                                    { 
                                                        f.getCargoCapacity()
                                                    }
                                                </Col>
                                                <Col>
                                                    { Math.floor((f.getHealth() / f.getHealthMax()) * 100) } %
                                                </Col>
                                                <Col>
                                                    { 
                                                        this._splitTripleScore(f.getFirstFireAccuracyScore())
                                                    }
                                                </Col>
                                                <Col>
                                                    { 
                                                        this._splitTripleScore(f.getMainFireAccuracyScore())
                                                    }
                                                </Col>
                                                <Col>
                                                    { 
                                                        this._splitTripleScore(f.getFirstFireDamageScore())
                                                    }
                                                </Col>
                                                <Col>
                                                    { 
                                                        this._splitTripleScore(f.getMainFireDamageScore())
                                                    }
                                                </Col>
                                                <Col>
                                                    { 
                                                        formatter.format(f.getValue())
                                                    }
                                                </Col>
                                            </Row>
                                        </td>
                                        <td>
                                            { f.getCrewMin() } / { f.getCrewMax() } ( { f.getCrewCount() } )
                                        </td>
                                        <td>
                                            { 
                                                this._reduceCarriedCargo(f.getCargoCarried())
                                            }
                                        </td>
                                        <td>
                                            {
                                                <Button
                                                    size='sm'
                                                    variant='danger'
                                                    aria-label='Scuttle this ship'
                                                    onClick={ () => this._scuttleShip(f) }>
                                                    <GiSinkingShip size={35}/>
                                                </Button>
                                            }
                                        </td>
                                    </tr>);
                                })
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>);
    }

}