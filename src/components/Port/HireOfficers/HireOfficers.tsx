import React from 'react';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HireableOfficers } from '../../../Objects/Officers/HireableOfficers';
import { portManager } from '../../../Services/PortManager';

import styles from './HireOfficers.module.scss';
import { Port } from '../../../Types/Port';
import { FaHireAHelper } from 'react-icons/fa';
import { GiBroom, GiCannon, GiFist, GiReceiveMoney, GiSailboat } from 'react-icons/gi';
import { IoArrowRedoCircleOutline, IoArrowUndoCircleOutline } from 'react-icons/io5';
import { RiTeamFill } from 'react-icons/ri';
import { GUID } from '../../../Helpers/GUID';
import { gameManager } from '../../../Services/GameManager';
import { Carpenter, Doctor, Quartermaster } from '../../../Types/Officers';
import { OfficerType } from '../../../Objects/Officers/Officers';

interface Props {}

interface State {
    carpenter: Carpenter | null;
    doctor: Doctor | null;
    quartermaster: Quartermaster | null;
    currentIndex: number;
    currentPort: Port | null;
    hireableOfficers: HireableOfficers;
    recruitableCarpenter: Carpenter | null;
    recruitableDoctor: Doctor | null;
    recruitableQuartermaster: Quartermaster | null;
}

function renderTooltip(props: any): JSX.Element {
    const id = `tooltip-${GUID()}`;
    return (
        <Tooltip id={ id }>
            { props.children }
        </Tooltip>
    );
}

export class HireOfficers extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            carpenter: null,
            doctor: null,
            quartermaster: null,
            currentIndex: 0,
            currentPort: null,
            hireableOfficers: new HireableOfficers(),
            recruitableCarpenter: null,
            recruitableDoctor: null,
            recruitableQuartermaster: null
        };
    }

    private _changeIndex(dir: number): void {
        const newIndex = dir + this.state.currentIndex;
        if (newIndex >= 0 && newIndex < 3) {
            this.setState({ currentIndex: newIndex });
        }
    }

    private _hireOfficers(officer: (Carpenter | Doctor | Quartermaster)): void {
        const currIndex = this.state.currentIndex;
        const recruits = this.state.recruits;

        // Make sure the suggested crew member are actually present.
        const existingChoices = crew.filter(elem => recruits.includes(elem))
        if (!existingChoices.length) {
            return;
        }

        if (currIndex >= recruits.length - existingChoices.length - 1) {
            this.setState({ currentIndex: recruits.length - existingChoices.length - 1 });
        }

        gameManager.addCrew(existingChoices, true);
        // Remove the listed crew members from the eligibleCrew.
        this.state.hireableOfficers?.removeOfficer(existingChoices);
        
    }

    public componentDidMount() {
        this.subscriptions.push(
            gameManager.getCarpenter().subscribe(carp => {
                this.setState({ carpenter: carp });
            }),
            gameManager.getDoctor().subscribe(doc => {
                this.setState({ doctor: doc });
            }),
            gameManager.getQuartermaster().subscribe(qmc => {
                this.setState({ quartermaster: qmc });
            }),
        );

        this.subscriptions[3] = portManager.getCurrentPort()
            .pipe(filter(port => !!port))
            .subscribe(port => {
                this.subscriptions[4]?.unsubscribe();
                this.setState({ currentPort: port });
                this.subscriptions[4] = port.availableOfficersToHire.subscribe(hireableOfficers => {
                    this.subscriptions[5]?.unsubscribe();
                    this.setState({ hireableOfficers: hireableOfficers });
                    this.subscriptions[5] = hireableOfficers.getOfficers().subscribe(recruits => {
                        this.setState({ recruits });
                    });
                });
            });
    }

    public componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
        this.subscriptions.length = 0;
    }

    public render() {
        const { carpenter, currentIndex, doctor, recruits, quartermaster } = this.state;
        const children = React.Children.toArray(this.props.children);
        const currRecruit = recruits[currentIndex] ?? null;
        const currType = currRecruit?.type ?? OfficerType.Quartermaster;
        return (
            <Row className='no-gutters'>
                <Col xs='12' aria-label='Crew Manifest section' className='text-center text-light'>
                    <Row className='no-gutters mb-5'>
                        <Col className='col-6 offset-3'>
                            <h2 className={ styles['hire-crew-header'] }>Hire Officers</h2>
                        </Col>
                        <Col className='col-1'>
                            <div className={ styles['hire-crew-help'] + ' text-right' }>
                                { children[0] }
                            </div>
                        </Col>
                        <Col className='col-2'>
                            <div className={ styles['hire-crew-exit'] + ' text-left' }>
                                { children[1] }
                            </div>
                        </Col>
                    </Row>
                    { !recruits?.length
                        ? <div className={ styles['avatar-sizing'] }></div>
                        : <div
                            className={ styles['avatar-sizing'] }
                            dangerouslySetInnerHTML={{__html: recruits[currentIndex].avatar}}></div>
                    }
                    <div style={{ minHeight: '32vw', position: 'relative', width: '100%' }}>
                        <div className={ styles['table-bg-wrapper'] + ' no-select' }>
                            <img src='images/tavern-table.svg' alt='tavern table' style={{ width: '90%' }}/>
                        </div>
                        <div className={ styles['stats-bg-wrapper'] }>
                            <img src='images/rope-border-square.png' alt='recruit stat parchment' className={ styles['stats-bg'] + ' no-select' }/>
                        </div>
                        <div className={ styles['beer-mug-wrapper'] + ' no-select' }>
                            <img src='images/beer-mug.png' alt='mug of beer' className={ styles['beer-mug'] }/>
                        </div>
                        <div className={ styles['ink-quill-wrapper'] + ' no-select' }>
                            <img src='images/tavern-ink-quill.png' alt='ink and quill' className={ styles['ink-quill'] }/>
                        </div>
                        { !recruits?.length
                            ? <div className={ styles['stats-wrapper'] + ' text-dark' }>
                                <Row className={ styles['stats'] + ' mx-auto' }>
                                    <Col className={ styles['stats-text'] + ' col-12 no-select mt-2' }>
                                        No Officers Available
                                    </Col>
                                </Row>
                            </div>
                            : <>
                                <div className={ styles['move-icon-wrapper-prev'] + ' text-info'}>
                                    { currentIndex <= 0 ? null :
                                        <span
                                            aria-label='Move to next recruit'
                                            className={ styles['move-icon-prev']}
                                            onClick={ () => { this._changeIndex(-1) } }>
                                            <IoArrowUndoCircleOutline />
                                        </span>
                                    }
                                </div>
                                <div className={ styles['recruit-count-wrapper'] + ' text-info'}>
                                    <span className={ styles['recruit-count-text'] + ' no-select' }>
                                        { currentIndex + 1 } of { recruits.length }
                                    </span>
                                </div>
                                <div className={ styles['move-icon-wrapper-next'] + ' text-info'}>
                                    { currentIndex >= recruits.length - 1 ? null :
                                        <span
                                            aria-label='Move to previous recruit'
                                            className={ styles['move-icon-next']}
                                            onClick={ () => { this._changeIndex(1) } }>
                                            <IoArrowRedoCircleOutline />
                                        </span>
                                    }
                                </div>
                                <div className={ styles['hire-icon-wrapper'] + ' text-info'}>
                                    { currentIndex > recruits.length - 1 ? null :
                                        <span
                                            aria-label='Hire the recruit'
                                            className={ styles['hire-icon']}
                                            onClick={ () => { this._hireOfficers(recruits[currentIndex]) } }>
                                            <FaHireAHelper />
                                        </span>
                                    }
                                </div>
                                <div className={ styles['stats-wrapper'] + ' text-dark' }>
                                    <Row className={ styles['stats'] + ' mx-auto' }>
                                        <Col className={ styles['stats-icon'] + ' col-4'}>
                                            <OverlayTrigger
                                                key={GUID()}
                                                placement="top"
                                                delay={{ show: 100, hide: 250 }}
                                                overlay={renderTooltip({ children: 'cannoneering' })}>
                                                {({ ref, ...triggerHandler }) => (
                                                    <span ref={ ref } {...triggerHandler}><GiCannon aria-label='cannoneering' /></span>
                                                )}
                                            </OverlayTrigger>
                                        </Col>
                                        <Col  className={ styles['stats-icon'] + ' col-4'}>
                                            <OverlayTrigger
                                                key={GUID()}
                                                placement="top"
                                                delay={{ show: 100, hide: 250 }}
                                                overlay={renderTooltip({ children: 'cleanliness' })}>
                                                {({ ref, ...triggerHandler }) => (
                                                    <span ref={ ref } {...triggerHandler}><GiBroom aria-label='cleanliness' /></span>
                                                )}
                                            </OverlayTrigger>
                                        </Col>
                                        <Col  className={ styles['stats-icon'] + ' col-4'}>
                                            <OverlayTrigger
                                                key={GUID()}
                                                placement="top"
                                                delay={{ show: 100, hide: 250 }}
                                                overlay={renderTooltip({ children: 'greed' })}>
                                                {({ ref, ...triggerHandler }) => (
                                                    <span ref={ ref } {...triggerHandler}><GiReceiveMoney aria-label='greed' /></span>
                                                )}
                                            </OverlayTrigger>
                                        </Col>
                                        <Col className={ styles['stats-text'] + ' col-4 no-select'}>
                                            { (recruits[currentIndex]?.skills[0]?.rank * 100).toFixed(0) }
                                        </Col>
                                        <Col className={ styles['stats-text'] + ' col-4 no-select'}>
                                            { (recruits[currentIndex].skills.cleanliness * 100).toFixed(0) }
                                        </Col>
                                        <Col className={ styles['stats-text'] + ' col-4 no-select'}>
                                            { (recruits[currentIndex].skills.greed * 100).toFixed(0) }
                                        </Col>
                                        <Col  className={ styles['stats-icon'] + ' col-4'}>
                                            <OverlayTrigger
                                                key={GUID()}
                                                placement="top"
                                                delay={{ show: 100, hide: 250 }}
                                                overlay={renderTooltip({ children: 'hand to hand combat' })}>
                                                {({ ref, ...triggerHandler }) => (
                                                    <span ref={ ref } {...triggerHandler}><GiFist aria-label='hand2HandCombat' /></span>
                                                )}
                                            </OverlayTrigger>
                                        </Col>
                                        <Col  className={ styles['stats-icon'] + ' col-4'}>
                                            <OverlayTrigger
                                                key={GUID()}
                                                placement="top"
                                                delay={{ show: 100, hide: 250 }}
                                                overlay={renderTooltip({ children: 'sailing' })}>
                                                {({ ref, ...triggerHandler }) => (
                                                    <span ref={ ref } {...triggerHandler}><GiSailboat aria-label='sailing' /></span>
                                                )}
                                            </OverlayTrigger>
                                        </Col>
                                        <Col  className={ styles['stats-icon'] + ' col-4'}>
                                            <OverlayTrigger
                                                key={GUID()}
                                                placement="top"
                                                delay={{ show: 100, hide: 250 }}
                                                overlay={renderTooltip({ children: 'teamwork' })}>
                                                {({ ref, ...triggerHandler }) => (
                                                    <span ref={ ref } {...triggerHandler}><RiTeamFill aria-label='teamwork' /></span>
                                                )}
                                            </OverlayTrigger>
                                        </Col>
                                        <Col className={ styles['stats-text'] + ' col-4 no-select'}>
                                            { (recruits[currentIndex].skills.hand2HandCombat * 100).toFixed(0) }
                                        </Col>
                                        <Col className={ styles['stats-text'] + ' col-4 no-select'}>
                                            { (recruits[currentIndex].skills.sailing * 100).toFixed(0) }
                                        </Col>
                                        <Col className={ styles['stats-text'] + ' col-4 no-select'}>
                                            { (recruits[currentIndex].skills.teamwork * 100).toFixed(0) }
                                        </Col>
                                    </Row>
                                </div>
                        </>}
                    </div>
                </Col>
            </Row>
        );
    }
}