import React from 'react';
import { Button, Col, Image, OverlayTrigger, Row, Table } from 'react-bootstrap';
import { FaRegThumbsDown, FaSort, FaShieldAlt } from 'react-icons/fa';
import { GiCannon, GiReceiveMoney, GiSailboat } from 'react-icons/gi';
import { BehaviorSubject, Subscription } from 'rxjs';

import styles from './FleetManifest.module.scss';
import { gameManager } from '../../../Services/GameManager';
import { GUID } from '../../../Helpers/GUID';
import { RenderTooltip } from '../../../Helpers/Tooltip';
import { Ship } from '../../../Objects/Ships/Ship';
import { formatter } from '../../../Helpers/Format';

interface Props {}

interface State {
    fleet: Ship[];
}

function renderFullscreenTableHeader(props: any): JSX.Element {
    return (<>
        { props.headerLabel }
        <OverlayTrigger
            key={GUID()}
            placement="top"
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
                    src="images/scroll-top.png"
                    width='100%'
                    height='auto'
                    alt='Top of crew manifest scroll'
                    style={{ width: '100%', height: 'auto' }}/>
            </div>
            <div className={ styles['scroll-bottom'] }>
                <Image
                    src="images/scroll-bottom.png"
                    width='100%'
                    height='auto'
                    alt='Bottom of crew manifest scroll'
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
                    <Table className={ styles["manifest"] + ' table-striped px-5' }>
                        <thead>
                            <tr>
                                <th className="mr-3">Ship</th>
                                <th className="mr-3">
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Name',
                                            sortBy: () => this._sortBy('name')
                                        })
                                    }
                                </th>
                                <th className="mr-3" style={{ minWidth: '172px', width: '160px' }}>
                                    <Row className='no-gutters'>
                                        <Col xs='12'>Features</Col>
                                    </Row>
                                    <Row className='no-gutters'>
                                        <Col xs='2' className='clickable' aria-label='armor'>
                                            <span onClick={ () => this._sortBy('armor')}>
                                                <FaShieldAlt />
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='sailing'>
                                            <span onClick={ () => this._sortBy('sailing')}>
                                                <GiSailboat />
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='greed'>
                                            <span onClick={ () => this._sortBy('greed')}>
                                                <GiCannon />
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='hand2HandCombat'>
                                            <span onClick={ () => this._sortBy('hand2HandCombat')}>
                                                <GiCannon />
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='sailing'>
                                            <span onClick={ () => this._sortBy('sailing')}>
                                                <GiSailboat />
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='teamwork'>
                                            <span onClick={ () => this._sortBy('teamwork')}>
                                                <GiReceiveMoney />
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row className='no-gutters'>
                                        <Col xs='2' className='clickable' aria-label='armor average'>
                                            <span onClick={ () => this._sortBy('armor')}>
                                                { fleetStats.armor }
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='speed average'>
                                            <span onClick={ () => this._sortBy('speed')}>
                                                { fleetStats.speed }
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='first fire damage average'>
                                            <span onClick={ () => this._sortBy('firstFireDmg')}>
                                                { fleetStats.firstFireDmg }
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='main damage average'>
                                            <span onClick={ () => this._sortBy('mainDamage')}>
                                                { fleetStats.mainDamage }
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='first fire accuracy'>
                                            <span onClick={ () => this._sortBy('firstFireAccuracy')}>
                                                { fleetStats.firstFireAccuracy }
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='main gun accuracy'>
                                            <span onClick={ () => this._sortBy('mainFireAccuracy')}>
                                                { fleetStats.mainAccuracy }
                                            </span>
                                        </Col>
                                    </Row>
                                </th>
                                <th className="mr-3">
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Health',
                                            sortBy: () => { this._sortBy('maxHealth'); this._sortBy('health') }
                                        })
                                    }
                                </th>
                                <th className="mr-3">
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Crew: Min/Max (Current)',
                                            sortBy: () => { this._sortBy('maxCrew'); this._sortBy('maxCrew'); this._sortBy('crewCount') }
                                        })
                                    }
                                </th>
                                <th className="mr-3">
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Cargo Capacity',
                                            sortBy: () => this._sortBy('maxCargoCapacity')
                                        })
                                    }
                                </th>
                                <th className="mr-3">
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Cargo Carried',
                                            sortBy: () => this._sortBy('cargoCarried')
                                        })
                                    }
                                </th>
                                <th>
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Value',
                                            sortBy: () => this._sortBy('value')
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
                                        <td className={ styles['middle'] }>
                                            { f.getName() }
                                        </td>
                                        <td>
                                            <Row className='no-gutters'>
                                                <Col xs='2'>
                                                    { f.getArmorLevel() }
                                                </Col>
                                                <Col xs='2'>
                                                    { f.getTopSpeed() }
                                                </Col>
                                                <Col xs='2'>
                                                    { () => {
                                                        const dmg = f.getFirstFireDamageScore();
                                                        return `${dmg[0]}, ${dmg[1]}, ${dmg[2]}`;
                                                    }}
                                                </Col>
                                                <Col xs='2'>
                                                    { () => {
                                                        const dmg = f.getMainFireDamageScore();
                                                        return `${dmg[0]}, ${dmg[1]}, ${dmg[2]}`;
                                                    }}
                                                </Col>
                                                <Col xs='2'>
                                                    { () => {
                                                        const acc = f.getFirstFireAccuracyScore();
                                                        return `${acc[0]}, ${acc[1]}, ${acc[2]}`;
                                                    }}
                                                </Col>
                                                <Col xs='2'>
                                                    { () => {
                                                        const acc = f.getMainFireAccuracyScore();
                                                        return `${acc[0]}, ${acc[1]}, ${acc[2]}`;
                                                    }}
                                                </Col>
                                            </Row>
                                        </td>
                                        <td className={ styles['no-break'] }>
                                            { Math.floor((f.getHealth() / f.getHealthMax()) * 100) } %
                                        </td>
                                        <td>
                                            { f.getCrewMin() } / { f.getCrewMax() } ( { f.getCrewCount() } )
                                        </td>
                                        <td>
                                            { formatter.format(f.getValue()) }
                                        </td>
                                        <td>
                                            { f.getCargoCapacity() }
                                        </td>
                                        <td>
                                            { f.getCargoCarried() }
                                        </td>
                                        <td>
                                            {
                                                <Button
                                                    size='sm'
                                                    variant='danger'
                                                    aria-label='Scuttle this ship'
                                                    onClick={ () => this._scuttleShip(f) }>
                                                    <FaRegThumbsDown/>
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