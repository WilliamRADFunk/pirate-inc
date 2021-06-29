import React from 'react';
import { Button, Col, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import { FaCaretDown, FaCaretUp, FaSort } from 'react-icons/fa';
import { GiBroom, GiCannon, GiFist, GiReceiveMoney, GiSailboat } from 'react-icons/gi';
import { RiTeamFill } from 'react-icons/ri';
import { BehaviorSubject, Subscription } from 'rxjs';

import styles from './CrewManifest.module.scss';
import { gameManager } from '../../../Services/GameManager';
import { ConcernTypes, CrewMember, MouthToMood } from '../../../Types/CrewMember';

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
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip({ children: `Sort ${props.headerLabel.toLowerCase() }` })}>
            <span className='clickable ml-1' onClick={ () => props.sortBy() }><FaSort /></span>
        </OverlayTrigger>
    </>);
}

function renderTooltip(props: any): JSX.Element {
    return (
        <Tooltip id="button-tooltip" {...props}>
            { props.children }
        </Tooltip>
    );
}

export class CrewManifest extends React.Component<Props, State> {
    private lastSort: BehaviorSubject<[string, string, boolean]> = new BehaviorSubject(['', '', true] as [string, string, boolean]);
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            crew: []
        };
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
        gameManager.sortCrewManifest(key, secondaryKey, dir);
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
        return (
            <Row className='mb-2'>
                <Col xs='12'
                    aria-label='Crew Manifest section'
                    className='text-center'>
                    Crew Manifest
                    <br/><br/>
                    See the full compliment of your crew and their associated stats.
                    <br/><br/>
                    <Table variant='dark' striped className={ styles["min-headers"] }>
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
                                <th className="mr-3">
                                    <Row>
                                        <Col xs='12'>Skills</Col>
                                    </Row>
                                    <Row>
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
                                    <Row>
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
                                            sortBy: () => this._sortBy('status')
                                        })
                                    }
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
                                        <td>
                                            { `${c.nameFirst}${ c.nameNick ? ` '${c.nameNick}' ` : ' '}${c.nameLast}` }
                                        </td>
                                        <td>
                                            <Row>
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
                                            { !c.isAlive ? <span>-1</span> : <>
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
                                    </tr>);
                                })
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        );
    }

}