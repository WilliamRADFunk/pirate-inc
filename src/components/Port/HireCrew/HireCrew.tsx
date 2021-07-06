import React from 'react';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HireableCrew } from '../../../Objects/Crew/HireableCrew';
import { portManager } from '../../../Services/PortManager';

import styles from './HireCrew.module.scss';
import { CrewMember } from '../../../Types/CrewMember';
import { Port } from '../../../Types/Port';
import { FaHireAHelper } from 'react-icons/fa';
import { GiBroom, GiCannon, GiFist, GiReceiveMoney, GiSailboat } from 'react-icons/gi';
import { IoArrowRedoCircleOutline, IoArrowUndoCircleOutline } from 'react-icons/io5';
import { RiTeamFill } from 'react-icons/ri';
import { GUID } from '../../../Helpers/GUID';
import { gameManager } from '../../../Services/GameManager';

interface Props {}

interface State {
    currentIndex: number;
    currentPort: Port | null;
    hireableCrew: HireableCrew;
    recruits: CrewMember[];
}

function renderTooltip(props: any): JSX.Element {
    return (
        <Tooltip id="button-tooltip" {...props}>
            { props.children }
        </Tooltip>
    );
}

export class HireCrew extends React.Component<Props, State> {
    private subscriptions: Subscription[] = []; // [Port, HireableCrew, Recruits]

    constructor(props: Props) {
        super(props);

        this.state = {
            currentIndex: 0,
            hireableCrew: new HireableCrew(),
            currentPort: null,
            recruits: []
        };
    }

    private _changeIndex(dir: number): void {
        const newIndex = dir + this.state.currentIndex;
        if (newIndex >= 0 && newIndex < this.state.recruits.length) {
            this.setState({ currentIndex: newIndex });
        }
    }

    private _hireCrew(crew: CrewMember[]): void {
        const currIndex = this.state.currentIndex;
        const recruits = this.state.recruits;
        if (currIndex >= recruits.length - 1 - crew.length) {
            this.setState({ currentIndex: currIndex - crew.length});
        }
        // TODO: Make sure the suggested crew member are actually present.
        // TODO: Remove the listed crew members from the eligibleCrew.
        gameManager.addCrew(crew);
        this.state.hireableCrew?.removeCrew(crew);
        
    }

    public componentDidMount() {
        this.subscriptions[0] = portManager.getCurrentPort()
            .pipe(filter(port => !!port))
            .subscribe(port => {
                this.subscriptions[1]?.unsubscribe();
                this.setState({ currentPort: port });
                this.subscriptions[1] = port.availableCrewToHire.subscribe(hireableCrew => {
                    this.subscriptions[2]?.unsubscribe();
                    this.setState({ hireableCrew: hireableCrew });
                    this.subscriptions[2] = hireableCrew.getCrew().subscribe(recruits => {
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
        const { currentIndex, recruits } = this.state;
        const props = this.props;
        return (
            <Row className='mb-2 no-gutters'>
                <Col xs='12' aria-label='Crew Manifest section' className='text-center text-light'>
                    <Row className='no-gutters mb-5'>
                        <Col className='col-6 offset-3'>
                            <h2 className={ styles['hire-crew-header'] }>Hire Recruits</h2>
                        </Col>
                        <Col className='col-3'>
                            <div className={ styles['hire-crew-exit'] + ' text-center' }>
                                { props.children }
                            </div>
                        </Col>
                    </Row>
                    { !recruits?.length ? null : <>
                        <div
                            className={ styles['avatar-sizing'] }
                            dangerouslySetInnerHTML={{__html: recruits[currentIndex].avatar}}></div>
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
                                { currentIndex >= recruits.length - 1 ? null :
                                    <span
                                        aria-label='Hire the recruit'
                                        className={ styles['hire-icon']}
                                        onClick={ () => { this._hireCrew([recruits[currentIndex]]) } }>
                                        <FaHireAHelper />
                                    </span>
                                }
                            </div>
                            <div className={ styles['stats-wrapper'] + ' text-dark' }>
                                <Row className={ styles['stats'] + ' mx-auto'}>
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
                                        { recruits[currentIndex].skills.cannoneering }
                                    </Col>
                                    <Col className={ styles['stats-text'] + ' col-4 no-select'}>
                                        { recruits[currentIndex].skills.cleanliness }
                                    </Col>
                                    <Col className={ styles['stats-text'] + ' col-4 no-select'}>
                                        { recruits[currentIndex].skills.greed }
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
                                        { recruits[currentIndex].skills.hand2HandCombat }
                                    </Col>
                                    <Col className={ styles['stats-text'] + ' col-4 no-select'}>
                                        { recruits[currentIndex].skills.sailing }
                                    </Col>
                                    <Col className={ styles['stats-text'] + ' col-4 no-select'}>
                                        { recruits[currentIndex].skills.teamwork }
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </>}
                </Col>
            </Row>
        );
    }
}