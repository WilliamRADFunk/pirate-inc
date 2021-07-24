import React from 'react';
import { Button, Col, Image, Row, Table } from 'react-bootstrap';
import { AiFillMedicineBox } from 'react-icons/ai';
import { FaPeopleCarry, FaRegThumbsDown } from 'react-icons/fa';
import { GiHandSaw } from 'react-icons/gi';
import { Subscription } from 'rxjs';

import styles from './OfficersManifest.module.scss';
import { gameManager } from '../../../Services/GameManager';
import { ConcernTypes, MouthToMood } from '../../../Types/People';
import { Carpenter, Doctor, Quartermaster } from '../../../Types/Officers';
import { OfficerType } from '../../../Objects/Officers/Officers';
import { formatter } from '../../../Helpers/Format';

interface Props {}

interface State {
    carpenter: Carpenter | null;
    doctor: Doctor | null;
    quartermaster: Quartermaster | null;
}

export class OfficersManifest extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            carpenter: null,
            doctor: null,
            quartermaster: null
        };
    }

    private _fireOfficer(officerType: OfficerType): void {
        gameManager.fireOfficer(officerType);
    }

    public componentDidMount() {
        this.subscriptions.push(
            gameManager.getCarpenter().subscribe(carp => {
                this.setState({ carpenter: carp });
            }),
            gameManager.getDoctor().subscribe(doc => {
                this.setState({ doctor: doc });
            }),
            gameManager.getQuartermaster().subscribe(quart => {
                this.setState({ quartermaster: quart });
            }),
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public render() {
        const { carpenter, doctor, quartermaster } = this.state;
        const children = React.Children.toArray(this.props.children);
        return (<>
            <div className={ styles['scroll-top'] }>
                <Image
                    src='images/scroll-top.png'
                    width='100%'
                    height='auto'
                    alt='Top of officers manifest scroll'
                    style={{ width: '100%', height: 'auto' }}/>
            </div>
            <div className={ styles['scroll-bottom'] }>
                <Image
                    src='images/scroll-bottom.png'
                    width='100%'
                    height='auto'
                    alt='Bottom of officers manifest scroll'
                    style={{ width: '100%', height: 'auto' }}/>
            </div>
            <Row className='mb-2 mx-1' style={{ position: 'relative', zIndex: 3 }}>
                <Col xs='12'
                    aria-label='Officers Manifest section'
                    className='text-center'>
                    <Row className='no-gutters mb-5'>
                        <Col className='col-6 offset-3'>
                            <h2 className={ styles['manifest-header'] }>Officers Manifest</h2>
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
                                <th className='mr-3'>
                                    Avatar
                                </th>
                                <th className='mr-3'>
                                    Name
                                </th>
                                <th className='mr-3 pl-0 pr-5'>
                                    <Row className='no-gutters'>
                                        <Col xs='10'>Skill</Col>
                                        <Col xs='2'>Level</Col>
                                    </Row>
                                </th>
                                <th className='mr-3'>
                                    Salary
                                </th>
                                <th className='mr-3'>
                                    Morale
                                </th>
                                <th className='mr-3'>
                                    Concern
                                </th>
                                <th>
                                    Fire
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key='quartermaster manifest'>
                                <td className={ styles['avatar-sizing'] }>
                                    <Row className='no-gutters mb-2'>
                                        <Col><u>Quartermaster</u></Col>
                                    </Row>
                                    <Row className='no-gutters'>
                                        <Col style={{ position: 'relative' }}>
                                            <div className={ styles['avatar-icon-wrapper'] + ' bg-light' }>
                                                < FaPeopleCarry size={30}/>
                                            </div>
                                            { !!quartermaster
                                                ? <div
                                                    className={ styles['avatar-sizing'] }
                                                    dangerouslySetInnerHTML={{__html: quartermaster?.avatar ?? ''}}></div>
                                                : <svg viewBox='0 0 360 360' xmlns='http://www.w3.org/2000/svg'>
                                                    <rect width='360' height='360' fill='#5554'/>
                                                  </svg>
                                            }
                                        </Col>
                                    </Row>
                                </td>
                                <td className={ styles['middle'] }>
                                    { !!quartermaster
                                        ? `Qmc. ${quartermaster?.nameFirst}${ quartermaster?.nameNick ? ` '${quartermaster?.nameNick}' ` : ' '}${quartermaster?.nameLast}`
                                        : 'No quartermaster employed'
                                    }
                                </td>
                                <td className='pl-0 pr-5'>
                                    <Row className='no-gutters mb-3'>
                                        <Col xs='10'>Cargo Distribution</Col>
                                        <Col xs='2'>{ !!quartermaster ? quartermaster?.skills?.cargoDistribution?.rank : 0 }</Col>
                                    </Row>
                                    <Row className='no-gutters mb-3'>
                                        <Col xs='10'>Human Resources</Col>
                                        <Col xs='2'>{ !!quartermaster ? quartermaster?.skills?.humanResourcing?.rank : 0 }</Col>
                                    </Row>
                                    <Row className='no-gutters'>
                                        <Col xs='10'>Morale Management</Col>
                                        <Col xs='2'>{ !!quartermaster ? quartermaster?.skills?.moraleManagement?.rank : 0 }</Col>
                                    </Row>
                                </td>
                                <td>
                                    { !!quartermaster ? formatter.format(quartermaster?.salary) : '$0' }
                                </td>
                                <td className={ styles['no-break'] }>
                                    { (!!quartermaster ? MouthToMood[quartermaster.mood] + ' (' + quartermaster?.morale + ')' : '---') }
                                </td>
                                <td>
                                    { (!!quartermaster && quartermaster.concern !== ConcernTypes.Empty) ? quartermaster?.concern : '---' }
                                </td>
                                <td>
                                    { !!quartermaster
                                        ? <Button
                                            size='sm'
                                            variant='danger'
                                            aria-label='Fire your quartermaster'
                                            onClick={ () => this._fireOfficer(OfficerType.Quartermaster) }>
                                            <FaRegThumbsDown/>
                                            </Button>
                                        : null
                                    }
                                </td>
                            </tr>
                            <tr key='doctor manifest'>
                                <td className={ styles['avatar-sizing'] }>
                                    <Row className='no-gutters mb-2'>
                                        <Col><u>Doctor</u></Col>
                                    </Row>
                                    <Row className='no-gutters'>
                                        <Col style={{ position: 'relative' }}>
                                            <div className={ styles['avatar-icon-wrapper'] + ' bg-light' }>
                                                < AiFillMedicineBox size={30}/>
                                            </div>
                                            { !!doctor
                                                ? <div
                                                    className={ styles['avatar-sizing'] }
                                                    dangerouslySetInnerHTML={{__html: doctor?.avatar ?? ''}}></div>
                                                : <svg viewBox='0 0 360 360' xmlns='http://www.w3.org/2000/svg'>
                                                    <rect width='360' height='360' fill='#5554'/>
                                                  </svg>
                                            }
                                        </Col>
                                    </Row>
                                </td>
                                <td className={ styles['middle'] }>
                                    { !!doctor
                                        ? `Dr. ${doctor?.nameFirst}${ doctor?.nameNick ? ` '${doctor?.nameNick}' ` : ' '}${doctor?.nameLast}`
                                        : 'No doctor employed'
                                    }
                                </td>
                                <td className='pl-0 pr-5'>
                                    <Row className='no-gutters'>
                                        <Col xs='10'>Medicine</Col>
                                        <Col xs='2'>{ !!doctor ? doctor?.skills?.medicine?.rank : 0 }</Col>
                                    </Row>
                                </td>
                                <td>
                                    { !!doctor ? formatter.format(doctor?.salary) : '$0' }
                                </td>
                                <td className={ styles['no-break'] }>
                                    { (!!doctor ? MouthToMood[doctor.mood] + ' (' + doctor?.morale + ')' : '---') }
                                </td>
                                <td>
                                    { (!!doctor && doctor.concern !== ConcernTypes.Empty) ? doctor?.concern : '---' }
                                </td>
                                <td>
                                    { !!doctor
                                        ? <Button
                                            size='sm'
                                            variant='danger'
                                            aria-label='Fire your doctor'
                                            onClick={ () => this._fireOfficer(OfficerType.Doctor) }>
                                            <FaRegThumbsDown/>
                                            </Button>
                                        : null
                                    }
                                </td>
                            </tr>
                            <tr key='carpenter manifest'>
                                <td className={ styles['avatar-sizing'] }>
                                    <Row className='no-gutters mb-2'>
                                        <Col><u>Carpenter</u></Col>
                                    </Row>
                                    <Row className='no-gutters'>
                                        <Col style={{ position: 'relative' }}>
                                            <div className={ styles['avatar-icon-wrapper'] + ' bg-light' }>
                                                < GiHandSaw size={30}/>
                                            </div>
                                            { !!carpenter
                                                ? <div
                                                    className={ styles['avatar-sizing'] }
                                                    dangerouslySetInnerHTML={{__html: carpenter?.avatar ?? ''}}></div>
                                                : <svg viewBox='0 0 360 360' xmlns='http://www.w3.org/2000/svg'>
                                                    <rect width='360' height='360' fill='#5554'/>
                                                  </svg>
                                            }
                                        </Col>
                                    </Row>
                                </td>
                                <td className={ styles['middle'] }>
                                    { !!carpenter
                                        ? `Carp. ${carpenter?.nameFirst}${ carpenter?.nameNick ? ` '${carpenter?.nameNick}' ` : ' '}${carpenter?.nameLast}`
                                        : 'No carpenter employed'
                                    }
                                </td>
                                <td className='pl-0 pr-5'>
                                    <Row className='no-gutters mb-3'>
                                        <Col xs='10'>Repair</Col>
                                        <Col xs='2'>{ !!carpenter ? carpenter?.skills?.repair?.rank : 0 }</Col>
                                    </Row>
                                    <Row className='no-gutters'>
                                        <Col xs='10'>DIY Medicine</Col>
                                        <Col xs='2'>{ !!carpenter ? carpenter?.skills?.diyMedicine?.rank : 0 }</Col>
                                    </Row>
                                </td>
                                <td>
                                    { !!carpenter ? formatter.format(carpenter?.salary) : '$0' }
                                </td>
                                <td className={ styles['no-break'] }>
                                    { (!!carpenter ? MouthToMood[carpenter.mood] + ' (' + carpenter?.morale + ')' : '---') }
                                </td>
                                <td>
                                    { (!!carpenter && carpenter.concern !== ConcernTypes.Empty) ? carpenter?.concern : '---' }
                                </td>
                                <td>
                                    { !!carpenter
                                        ? <Button
                                            size='sm'
                                            variant='danger'
                                            aria-label='Fire your carpenter'
                                            onClick={ () => this._fireOfficer(OfficerType.Carpenter) }>
                                            <FaRegThumbsDown/>
                                            </Button>
                                        : null
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>);
    }

}