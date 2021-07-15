import React from 'react';
import { Col, Image, OverlayTrigger, Row } from 'react-bootstrap';
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
import { RenderTooltip } from '../../../Helpers/Tooltip';

interface Props {}

interface State {
    crewCount: number;
    currentIndex: number;
    currentPort: Port | null;
    hireableCrew: HireableCrew;
    maxCrew: number;
    recruits: CrewMember[];
}

export class HireCrew extends React.Component<Props, State> {
    private subscriptions: Subscription[] = []; // [Port, HireableCrew, Recruits]

    constructor(props: Props) {
        super(props);

        this.state = {
            crewCount: 0,
            currentIndex: 0,
            hireableCrew: new HireableCrew(),
            currentPort: null,
            maxCrew: 0,
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

        // Make sure the suggested crew member are actually present.
        const existingChoices = crew.filter(elem => recruits.includes(elem))
        if (!existingChoices.length) {
            return;
        }

        if (currIndex >= recruits.length - existingChoices.length - 1) {
            this.setState({ currentIndex: recruits.length - existingChoices.length - 1 });
        }

        gameManager.addCrew(existingChoices);
        // Remove the listed crew members from the eligibleCrew.
        this.state.hireableCrew?.removeCrew(existingChoices);
        
    }

    public componentDidMount() {
        this.subscriptions.push(
            gameManager.getMaxCrewCount().subscribe(maxC => {
                this.setState({ maxCrew: maxC });
            }),
            gameManager.getCrew().subscribe(crew => {
                this.setState({ crewCount: crew.filter(c => c.isAlive).length });
            })
        );

        this.subscriptions[2] = portManager.getCurrentPort()
            .pipe(filter(port => !!port))
            .subscribe(port => {
                this.subscriptions[3]?.unsubscribe();
                this.setState({ currentPort: port });
                this.subscriptions[3] = port.availableCrewToHire.subscribe(hireableCrew => {
                    this.subscriptions[4]?.unsubscribe();
                    this.setState({ hireableCrew: hireableCrew });
                    this.subscriptions[4] = hireableCrew.getCrew().subscribe(recruits => {
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
        const { crewCount, currentIndex, maxCrew, recruits } = this.state;
        const children = React.Children.toArray(this.props.children);
        const maxCrewReached = crewCount >= maxCrew;
        const currRecruit = recruits[currentIndex] ?? null;
        return (
            <Row className='no-gutters'>
                <Col xs='12' aria-label='Crew Manifest section' className='text-center text-light'>
                    <Row className='no-gutters mb-5'>
                        <Col className='col-6 offset-3'>
                            <h2 className={ styles['hire-crew-header'] }>Hire Recruits</h2>
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
                    <Row className='no-gutters mb-3'>
                        { !currRecruit || maxCrewReached
                            ? <Col className='col-6 offset-3'>
                                <h5 className={ styles['hire-crew-name-header'] }>&nbsp;</h5>
                              </Col>
                            : <Col className='col-6 offset-3'>
                                <h5 className={ styles['hire-crew-name-header'] }>
                                    { `${currRecruit.nameFirst}${ currRecruit.nameNick ? ` '${currRecruit.nameNick}' ` : ' '}${currRecruit.nameLast}` }
                                </h5>
                              </Col>
                        }
                    </Row>
                    { (!recruits?.length || maxCrewReached)
                        ? <div
                            className={ styles['avatar-sizing'] }
                            dangerouslySetInnerHTML={{__html: `
                                <svg viewBox="0 0 360 369" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="20vw" height="25vw" fill="transparent"/>
                                </svg>`}}>
                          </div>
                        : <div
                            className={ styles['avatar-sizing'] }
                            dangerouslySetInnerHTML={{__html: currRecruit?.avatar ?? `
                                <svg viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="20vw" height="25vw" fill="transparent"/>
                                </svg>`}}>
                          </div>
                    }
                    <div style={{ minHeight: '32vw', position: 'relative', width: '100%' }}>
                        <div className={ styles['table-bg-wrapper'] + ' no-select' }>
                            <Image src='images/tavern-table.svg' alt='tavern table' style={{ width: '90%' }}/>
                        </div>
                        <div className={ styles['stats-bg-wrapper'] }>
                            <Image src='images/rope-border-square.png' alt='recruit stat parchment' className={ styles['stats-bg'] + ' no-select' }/>
                        </div>
                        <div className={ styles['beer-mug-wrapper'] + ' no-select' }>
                            <Image src='images/beer-mug.png' alt='mug of beer' className={ styles['beer-mug'] }/>
                        </div>
                        <div className={ styles['ink-quill-wrapper'] + ' no-select' }>
                            <Image src='images/tavern-ink-quill.png' alt='ink and quill' className={ styles['ink-quill'] }/>
                        </div>
                        { (!recruits?.length || maxCrewReached)
                            ? <div className={ styles['stats-wrapper'] + ' text-dark' }>
                                <Row className={ styles['stats'] + ' mx-auto' }>
                                    <Col className={ styles['stats-text'] + ' col-12 no-select mt-2' }>
                                        { maxCrewReached
                                            ? 'You\'ve eached the maximum crew your ships can support'
                                            : 'No Recruits Available'
                                        }
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
                                            onClick={ () => { this._hireCrew([recruits[currentIndex]]) } }>
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
                                                overlay={RenderTooltip({ children: 'cannoneering' })}>
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
                                                overlay={RenderTooltip({ children: 'cleanliness' })}>
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
                                                overlay={RenderTooltip({ children: 'greed' })}>
                                                {({ ref, ...triggerHandler }) => (
                                                    <span ref={ ref } {...triggerHandler}><GiReceiveMoney aria-label='greed' /></span>
                                                )}
                                            </OverlayTrigger>
                                        </Col>
                                        <Col className={ styles['stats-text'] + ' col-4 no-select'}>
                                            { (recruits[currentIndex].skills.cannoneering * 100).toFixed(0) }
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
                                                overlay={RenderTooltip({ children: 'hand to hand combat' })}>
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
                                                overlay={RenderTooltip({ children: 'sailing' })}>
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
                                                overlay={RenderTooltip({ children: 'teamwork' })}>
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