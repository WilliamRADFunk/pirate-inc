import React from 'react';
import { Button, Col, Image, OverlayTrigger, Row, Table } from 'react-bootstrap';
import { FaCaretDown, FaCaretUp, FaRegThumbsDown, FaSort } from 'react-icons/fa';
import { GiBroom, GiCannon, GiFist, GiReceiveMoney, GiSailboat } from 'react-icons/gi';
import { GrMoney } from 'react-icons/gr';
import { RiTeamFill } from 'react-icons/ri';
import { BehaviorSubject, Subscription } from 'rxjs';

import styles from './FleetManifest.module.scss';
import { gameManager } from '../../../Services/GameManager';
import { CrewMember } from '../../../Types/CrewMember';
import { ConcernTypes, MouthToMood } from '../../../Types/People';
import { GUID } from '../../../Helpers/GUID';
import { RenderTooltip } from '../../../Helpers/Tooltip';

interface Props {}

interface State {
    crew: CrewMember[];
}

function getSkillAvg(crew: CrewMember[], skillName: string): string {
    const sum = crew.reduce((acc, val) => {
        const skills = val.skills as any;
        return acc + skills[skillName];
    }, 0);
    return ((sum / crew.length) * 100).toFixed(0);
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

function renderDeathBenefits(props: any): JSX.Element {
    if (props.cMember?.hasPaidDeathBenefit) {
        return (
            <span>Paid</span>
        );
    }
    const benefitAmt = props.cMember?.deathBenefit;
    const turnsSinceDeath = props.cMember?.turnsSinceDeath;
    return (<>
        <Button
            size='sm'
            variant='success'
            aria-label='Pay death benefits'
            onClick={ () => props.pay() }>
            <GrMoney color="white" />
        </Button>
        <div>
            <span>${ benefitAmt }</span> <span>({ turnsSinceDeath })</span>
        </div>
    </>);
}

export class FleetManifest extends React.Component<Props, State> {
    private lastSort: BehaviorSubject<[string, string, boolean]> = new BehaviorSubject(['', '', true] as [string, string, boolean]);
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            crew: []
        };
    }

    private _fireCrew(cMember: CrewMember): void {
        gameManager.fireCrew([cMember]);
    }

    private _payDeathBenefits(cMember: CrewMember): void {
        gameManager.payDeathBenefits([cMember]);
    }

    private _payPriority(payNumber: number, isDown: boolean): void {
        gameManager.updatePayPriority(payNumber, isDown);
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
            gameManager.getCrew().subscribe(crew => {
                this.setState({ crew });
            }),
        );
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public render() {
        const { crew } = this.state;
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
                                <th className="mr-3">Avatar</th>
                                <th className="mr-3">
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Name',
                                            sortBy: () => this._sortBy('nameFirst')
                                        })
                                    }
                                </th>
                                <th className="mr-3" style={{ minWidth: '172px', width: '160px' }}>
                                    <Row className='no-gutters'>
                                        <Col xs='12'>Skills</Col>
                                    </Row>
                                    <Row className='no-gutters'>
                                        <Col xs='2' className='clickable' aria-label='cannoneering'>
                                            <span onClick={ () => this._sortBy('skills', 'cannoneering')}>
                                                <GiCannon />
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='cleanliness'>
                                            <span onClick={ () => this._sortBy('skills', 'cleanliness')}>
                                                <GiBroom />
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='greed'>
                                            <span onClick={ () => this._sortBy('skills', 'greed')}>
                                                <GiReceiveMoney />
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='hand2HandCombat'>
                                            <span onClick={ () => this._sortBy('skills', 'hand2HandCombat')}>
                                                <GiFist />
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='sailing'>
                                            <span onClick={ () => this._sortBy('skills', 'sailing')}>
                                                <GiSailboat />
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='teamwork'>
                                            <span onClick={ () => this._sortBy('skills', 'teamwork')}>
                                                <RiTeamFill />
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row className='no-gutters'>
                                        <Col xs='2' className='clickable' aria-label='cannoneering average'>
                                            <span onClick={ () => this._sortBy('skills', 'cannoneering')}>
                                                { getSkillAvg(crew, 'cannoneering') }
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='cleanliness average'>
                                            <span onClick={ () => this._sortBy('skills', 'cleanliness')}>
                                            { getSkillAvg(crew, 'cleanliness') }
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='greed average'>
                                            <span onClick={ () => this._sortBy('skills', 'greed')}>
                                            { getSkillAvg(crew, 'greed') }
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='hand2HandCombat average'>
                                            <span onClick={ () => this._sortBy('skills', 'hand2HandCombat')}>
                                            { getSkillAvg(crew, 'hand2HandCombat') }
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='sailing average'>
                                            <span onClick={ () => this._sortBy('skills', 'sailing')}>
                                            { getSkillAvg(crew, 'sailing') }
                                            </span>
                                        </Col>
                                        <Col xs='2' className='clickable' aria-label='teamwork average'>
                                            <span onClick={ () => this._sortBy('skills', 'teamwork')}>
                                            { getSkillAvg(crew, 'teamwork') }
                                            </span>
                                        </Col>
                                    </Row>
                                </th>
                                <th className="mr-3">
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Morale',
                                            sortBy: () => this._sortBy('morale')
                                        })
                                    }
                                </th>
                                <th className="mr-3">
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Concern',
                                            sortBy: () => this._sortBy('concern')
                                        })
                                    }
                                </th>
                                <th className="mr-3">
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Pay Priority',
                                            sortBy: () => this._sortBy('payOrder')
                                        })
                                    }
                                </th>
                                <th>
                                    {
                                        renderFullscreenTableHeader({
                                            headerLabel: 'Status',
                                            sortBy: () => this._sortBy('isAlive')
                                        })
                                    }
                                </th>
                                <th>
                                    Fire/Pay DB
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                crew.map(c => {
                                    const hasPayUpBtn = c.payOrder < crew.length - 1;
                                    const hasPayDownBtn = c.payOrder > 0;
                                    return (<tr key={`${c.nameFirst} ${c.nameLast}`}>
                                        <td className={ styles['avatar-sizing'] }>
                                            <span
                                                className={ styles['avatar-sizing'] }
                                                dangerouslySetInnerHTML={{__html: c.avatar}}></span>
                                        </td>
                                        <td className={ styles['middle'] }>
                                            { `${c.nameFirst}${ c.nameNick ? ` '${c.nameNick}' ` : ' '}${c.nameLast}` }
                                        </td>
                                        <td>
                                            <Row className='no-gutters'>
                                                <Col xs='2'> { (c.skills.cannoneering * 100).toFixed(0) }</Col>
                                                <Col xs='2'> { (c.skills.cleanliness * 100).toFixed(0) }</Col>
                                                <Col xs='2'> { (c.skills.greed * 100).toFixed(0) }</Col>
                                                <Col xs='2'> { (c.skills.hand2HandCombat * 100).toFixed(0) }</Col>
                                                <Col xs='2'> { (c.skills.sailing * 100).toFixed(0) }</Col>
                                                <Col xs='2'> { (c.skills.teamwork * 100).toFixed(0) }</Col>
                                            </Row>
                                        </td>
                                        <td className={ styles['no-break'] }>
                                            { (c.isAlive ? MouthToMood[c.mood] : '---') + ' (' + c.morale + ')'}
                                        </td>
                                        <td>
                                            { c.concern !== ConcernTypes.Empty ? c.concern : '---' }
                                        </td>
                                        <td className={ styles['pay-order-cell'] }>
                                            { !c.isAlive ? <span>---</span> : <>
                                                <span className={ styles['pay-order-text'] + ' text-center' }>
                                                    { c.payOrder }
                                                </span>
                                                <span className={ styles['pay-order-buttons'] }>
                                                    <span className='float-left'>{ !hasPayUpBtn ? null :
                                                        <Button
                                                            variant='info'
                                                            className={ styles['pay-order-button'] + ' py-1 px-1' }
                                                            size='sm'
                                                            aria-label='Increase priority of pay'
                                                            onClick={() => this._payPriority(c.payOrder, false)}>
                                                            <FaCaretUp />
                                                        </Button>
                                                    }</span>
                                                    <span className='float-right'> { !hasPayDownBtn ? null :
                                                        <Button
                                                            variant='info'
                                                            className={ styles['pay-order-button'] + ' py-1 px-1' }
                                                            size='sm'
                                                            aria-label='Decrease priority of pay'
                                                            onClick={() => this._payPriority(c.payOrder, true)}>
                                                            <FaCaretDown />
                                                        </Button>
                                                    }</span>
                                                </span>
                                            </>}
                                        </td>
                                        <td>
                                            { c.isAlive ? 'Alive' : 'Deceased' }
                                        </td>
                                        <td>
                                            { c.isAlive 
                                                ? <Button
                                                    size='sm'
                                                    variant='danger'
                                                    aria-label='Fire crew member'
                                                    onClick={ () => this._fireCrew(c) }>
                                                    <FaRegThumbsDown/>
                                                  </Button>
                                                : renderDeathBenefits({ cMember: c, pay: () => this._payDeathBenefits(c)})
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