import React from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { FaRegThumbsDown } from 'react-icons/fa';
import { Subscription } from 'rxjs';

import styles from './OfficersManifest.module.scss';
import { gameManager } from '../../../Services/GameManager';
import { ConcernTypes, MouthToMood } from '../../../Types/People';
import { Carpenter, Doctor, Quartermaster } from '../../../Types/Officers';
import { OfficerType } from '../../../Objects/Officers/Officers';

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
                <img
                    src="images/scroll-top.png"
                    width='100%'
                    height='auto'
                    alt='Top of officers manifest scroll'
                    style={{ width: '100%', height: 'auto' }}></img>
            </div>
            <div className={ styles['scroll-bottom'] }>
                <img
                    src="images/scroll-bottom.png"
                    width='100%'
                    height='auto'
                    alt='Bottom of officers manifest scroll'
                    style={{ width: '100%', height: 'auto' }}></img>
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
                    <Table className={ styles["manifest"] + ' table-striped px-5' }>
                        <thead>
                            <tr>
                                <th className="mr-3">
                                    Avatar
                                </th>
                                <th className="mr-3">
                                    Name
                                </th>
                                <th className="mr-3">
                                    Skills
                                </th>
                                <th className="mr-3">
                                    Morale
                                </th>
                                <th className="mr-3">
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
                                    <span
                                        className={ styles['avatar-sizing'] }
                                        dangerouslySetInnerHTML={{__html: quartermaster?.avatar ?? ''}}></span>
                                </td>
                                <td className={ styles['middle'] }>
                                    { `${quartermaster?.nameFirst}${ quartermaster?.nameNick ? ` '${quartermaster?.nameNick}' ` : ' '}${quartermaster?.nameLast}` }
                                </td>
                                <td>
                                    <Row className='no-gutters'>
                                        <Col xs='2'> Skills 1 </Col>
                                        <Col xs='2'> Skills 2 </Col>
                                    </Row>
                                </td>
                                <td className={ styles['no-break'] }>
                                    { (!!quartermaster ? MouthToMood[quartermaster.mood] : '---') + ' (' + quartermaster?.morale + ')'}
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
                                    <span
                                        className={ styles['avatar-sizing'] }
                                        dangerouslySetInnerHTML={{__html: doctor?.avatar ?? ''}}></span>
                                </td>
                                <td className={ styles['middle'] }>
                                    { `${doctor?.nameFirst}${ doctor?.nameNick ? ` '${doctor?.nameNick}' ` : ' '}${doctor?.nameLast}` }
                                </td>
                                <td>
                                    <Row className='no-gutters'>
                                        <Col xs='2'> Skills 1 </Col>
                                        <Col xs='2'> Skills 2 </Col>
                                    </Row>
                                </td>
                                <td className={ styles['no-break'] }>
                                    { (!!doctor ? MouthToMood[doctor.mood] : '---') + ' (' + doctor?.morale + ')'}
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
                                    <span
                                        className={ styles['avatar-sizing'] }
                                        dangerouslySetInnerHTML={{__html: carpenter?.avatar ?? ''}}></span>
                                </td>
                                <td className={ styles['middle'] }>
                                    { `${carpenter?.nameFirst}${ carpenter?.nameNick ? ` '${carpenter?.nameNick}' ` : ' '}${carpenter?.nameLast}` }
                                </td>
                                <td>
                                    <Row className='no-gutters'>
                                        <Col xs='2'> Skills 1 </Col>
                                        <Col xs='2'> Skills 2 </Col>
                                    </Row>
                                </td>
                                <td className={ styles['no-break'] }>
                                    { (!!carpenter ? MouthToMood[carpenter.mood] : '---') + ' (' + carpenter?.morale + ')'}
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