import React from 'react';
import { Col, OverlayTrigger, Row } from 'react-bootstrap';
import { Subscription } from 'rxjs';
import { combineLatestWith, filter, switchMap } from 'rxjs/operators';
import { HireableOfficers } from '../../../Objects/Officers/HireableOfficers';
import { portManager } from '../../../Services/PortManager';

import styles from './HireOfficers.module.scss';
import { Port } from '../../../Types/Port';
import { AiFillMedicineBox } from 'react-icons/ai';
import { FaBoxes, FaHireAHelper } from 'react-icons/fa';
import { GiHandSaw, GiHumanPyramid, GiSewingNeedle } from 'react-icons/gi';
import { IoArrowRedoCircleOutline, IoArrowUndoCircleOutline } from 'react-icons/io5';
import { BiHappyBeaming } from 'react-icons/bi';
import { GUID } from '../../../Helpers/GUID';
import { gameManager } from '../../../Services/GameManager';
import { Carpenter, Doctor, Quartermaster } from '../../../Types/Officers';
import { OfficerType } from '../../../Objects/Officers/Officers';
import { RenderTooltip } from '../../../Helpers/Tooltip';
import { formatter } from '../../../Helpers/Format';

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
    recruits: [(Carpenter | null), (Doctor | null), (Quartermaster | null)];
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
            recruitableQuartermaster: null,
            recruits: [null, null, null]
        };
    }

    private _changeIndex(dir: number): void {
        const newIndex = dir + this.state.currentIndex;
        if (newIndex >= 0 && newIndex < 3) {
            this.setState({ currentIndex: newIndex });
        }
    }

    private _renderCarpenterStats(): JSX.Element {
        const { recruitableCarpenter } = this.state;
        if (!recruitableCarpenter) {
            return (
                <Row className={ styles['stats'] + ' mx-auto' }>
                    <Col className={ styles['stats-text'] + ' col-12 no-select mb-lg-2'}>
                        <u>Carpenter</u>
                    </Col>
                    <Col className={ styles['stats-text'] + ' col-12 no-select mt-lg-2 px-2 px-md-4'}>
                        There are no available carpenters for hire here
                    </Col>
                </Row>
            );
        }
        
        const skills = (recruitableCarpenter as Carpenter).skills;
        return (
            <Row className={ styles['stats'] + ' mx-auto' }>
                <Col className={ styles['stats-text'] + ' col-12 no-select mb-lg-2'}>
                    <u>Carpenter</u>
                </Col>
                <Col className={ styles['stats-icon'] + ' col-6'}>
                    <OverlayTrigger
                        key={GUID()}
                        placement="top"
                        delay={{ show: 100, hide: 250 }}
                        overlay={RenderTooltip({ children: 'Repair' })}>
                        {({ ref, ...triggerHandler }) => (
                            <span ref={ ref } {...triggerHandler}><GiHandSaw aria-label='repair' /></span>
                        )}
                    </OverlayTrigger>
                </Col>
                <Col  className={ styles['stats-icon'] + ' col-6'}>
                    <OverlayTrigger
                        key={GUID()}
                        placement="top"
                        delay={{ show: 100, hide: 250 }}
                        overlay={RenderTooltip({ children: 'DIY Medicine' })}>
                        {({ ref, ...triggerHandler }) => (
                            <span ref={ ref } {...triggerHandler}><GiSewingNeedle aria-label='D.I.Y. Medicine' /></span>
                        )}
                    </OverlayTrigger>
                </Col>
                <Col className={ styles['stats-text'] + ' col-6 no-select px-0'}>
                    { skills.repair.rank } / 10
                </Col>
                <Col className={ styles['stats-text'] + ' col-6 no-select px-0'}>
                    { skills.diyMedicine.rank } / 10
                </Col>
                <Col className={ styles['stats-text'] + ' col-12 no-select mt-1 mt-lg-2'}>
                    Salary: { formatter.format(recruitableCarpenter?.salary ?? 0) }
                </Col>
            </Row>
        );
    }

    private _renderDoctorStats(): JSX.Element {
        const { recruitableDoctor } = this.state;
        if (!recruitableDoctor) {
            return (
                <Row className={ styles['stats'] + ' mx-auto' }>
                    <Col className={ styles['stats-text'] + ' col-12 no-select mb-lg-2'}>
                        <u>Doctor</u>
                    </Col>
                    <Col className={ styles['stats-text'] + ' col-12 no-select mt-lg-2 px-2 px-md-4'}>
                        There are no available doctors for hire here
                    </Col>
                </Row>
            );
        }

        const skills = (recruitableDoctor as Doctor).skills;
        return (
            <Row className={ styles['stats'] + ' mx-auto' }>
                <Col className={ styles['stats-text'] + ' col-12 no-select mb-lg-2'}>
                    <u>Doctor</u>
                </Col>
                <Col className={ styles['stats-icon'] + ' col-12'}>
                    <OverlayTrigger
                        key={GUID()}
                        placement="top"
                        delay={{ show: 100, hide: 250 }}
                        overlay={RenderTooltip({ children: 'Medicine' })}>
                        {({ ref, ...triggerHandler }) => (
                            <span ref={ ref } {...triggerHandler}><AiFillMedicineBox aria-label='medicine' /></span>
                        )}
                    </OverlayTrigger>
                </Col>
                <Col className={ styles['stats-text'] + ' col-12 no-select px-0'}>
                    { skills.medicine.rank } / 10
                </Col>
                <Col className={ styles['stats-text'] + ' col-12 no-select mt-1 mt-lg-2'}>
                    Salary: { formatter.format(recruitableDoctor?.salary ?? 0) }
                </Col>
            </Row>
        );
    }

    private _renderQuartermasterStats(): JSX.Element {
        const { recruitableQuartermaster } = this.state;
        if (!recruitableQuartermaster) {
            return (
                <Row className={ styles['stats'] + ' mx-auto' }>
                    <Col className={ styles['stats-text'] + ' col-12 no-select mb-lg-2 pl-4 pl-sm-3'}>
                        <u>Quartermaster</u>
                    </Col>
                    <Col className={ styles['stats-text'] + ' col-12 no-select mt-lg-2 px-2 px-md-4 pl-4 pl-sm-3'}>
                        There are no available quartermasters for hire here
                    </Col>
                </Row>
            );
        }

        const skills = (recruitableQuartermaster as Quartermaster).skills;
        return (
            <Row className={ styles['stats'] + ' mx-auto' }>
                <Col className={ styles['stats-text'] + ' col-12 no-select mb-lg-2 pl-4 pl-sm-3'}>
                    <u>Quartermaster</u>
                </Col>
                <Col className={ styles['stats-icon'] + ' col-4'}>
                    <OverlayTrigger
                        key={GUID()}
                        placement="top"
                        delay={{ show: 100, hide: 250 }}
                        overlay={RenderTooltip({ children: 'Cargo Distribution' })}>
                        {({ ref, ...triggerHandler }) => (
                            <span ref={ ref } {...triggerHandler}><FaBoxes aria-label='Cargo Distribution' /></span>
                        )}
                    </OverlayTrigger>
                </Col>
                <Col className={ styles['stats-icon'] + ' col-4'}>
                    <OverlayTrigger
                        key={GUID()}
                        placement="top"
                        delay={{ show: 100, hide: 250 }}
                        overlay={RenderTooltip({ children: 'Human Resources' })}>
                        {({ ref, ...triggerHandler }) => (
                            <span ref={ ref } {...triggerHandler}><GiHumanPyramid aria-label='Human Resources' /></span>
                        )}
                    </OverlayTrigger>
                </Col>
                <Col className={ styles['stats-icon'] + ' col-4'}>
                    <OverlayTrigger
                        key={GUID()}
                        placement="top"
                        delay={{ show: 100, hide: 250 }}
                        overlay={RenderTooltip({ children: 'Morale Management' })}>
                        {({ ref, ...triggerHandler }) => (
                            <span ref={ ref } {...triggerHandler}><BiHappyBeaming aria-label='Morale Management' /></span>
                        )}
                    </OverlayTrigger>
                </Col>
                <Col className={ styles['stats-text'] + ' col-4 no-select px-0'}>
                    { skills.cargoDistribution.rank } / 10
                </Col>
                <Col className={ styles['stats-text'] + ' col-4 no-select px-0'}>
                    { skills.humanResourcing.rank } / 10
                </Col>
                <Col className={ styles['stats-text'] + ' col-4 no-select px-0'}>
                    { skills.moraleManagement.rank } / 10
                </Col>
                <Col className={ styles['stats-text'] + ' col-12 no-select mt-1 mt-lg-2'}>
                    Salary: { formatter.format(recruitableQuartermaster?.salary ?? 0) }
                </Col>
            </Row>
        );
    }

    private _renderStats(): JSX.Element {
        const { currentIndex } = this.state;
        let type = OfficerType.Carpenter;
        if (currentIndex === 1) {
            type = OfficerType.Doctor;
        } else if (currentIndex === 2) {
            type = OfficerType.Quartermaster;
        }

        switch (type) {
            case OfficerType.Carpenter: {
                return this._renderCarpenterStats();
            }
            case OfficerType.Doctor: {
                return this._renderDoctorStats();
            }
            case OfficerType.Quartermaster: {
                return this._renderQuartermasterStats();
            }
            default: {
                return <></>;
            }
        }
    }

    private _hireOfficers(officer: (Carpenter | Doctor | Quartermaster | null)): void {
        const currIndex = this.state.currentIndex;

        // Make sure the suggested officer is actually present.
        if (!officer || this.state.recruits[currIndex]?.id !== officer?.id) {
            return;
        }

        switch (currIndex) {
            case 0: {
                const oldOfficer = this.state.carpenter;
                gameManager.addOfficer(this.state.recruitableCarpenter, OfficerType.Carpenter);
                console.log(oldOfficer);
                this.state.hireableOfficers.removeOfficer(OfficerType.Carpenter);
                this.state.hireableOfficers.addOfficer(oldOfficer, OfficerType.Carpenter, false, true);
                break;
            }
            case 1: {
                const oldOfficer = this.state.doctor;
                gameManager.addOfficer(this.state.recruitableDoctor, OfficerType.Doctor);
                this.state.hireableOfficers.removeOfficer(OfficerType.Doctor);
                this.state.hireableOfficers.addOfficer(oldOfficer, OfficerType.Doctor, false, true);
                break;
            }
            case 2: {
                const oldOfficer = this.state.quartermaster;
                gameManager.addOfficer(this.state.recruitableQuartermaster, OfficerType.Quartermaster);
                this.state.hireableOfficers.removeOfficer(OfficerType.Quartermaster);
                this.state.hireableOfficers.addOfficer(oldOfficer, OfficerType.Quartermaster, false, true);
                break;
            }
        }
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
            portManager.getCurrentPort()
                .pipe(
                    filter(port => !!port),
                    switchMap(port => {
                        this.setState({ currentPort: port });
                        return port.availableOfficersToHire.asObservable();
                    }),
                    switchMap((hireableOfficers: HireableOfficers) => {
                        this.setState({ hireableOfficers: hireableOfficers });
                        return hireableOfficers.getCarpenter()
                            .pipe(combineLatestWith(hireableOfficers.getDoctor(), hireableOfficers.getQuartermaster()));
                    })
                ).subscribe((officers: any[]) => {
                    console.log('the new recruit officer: ', officers);
                    this.setState({
                        recruitableCarpenter: officers[0],
                        recruitableDoctor: officers[1],
                        recruitableQuartermaster: officers[2],
                        recruits: [officers[0], officers[1], officers[2]]
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
        const { currentIndex, recruits } = this.state;
        const children = React.Children.toArray(this.props.children);
        const currRecruit = recruits[currentIndex] ?? null;
        const recAvailable = (recruits?.filter(x => !!x) ?? []).length;
        return (
            <Row className='no-gutters'>
                <Col xs='12' aria-label='Officers Manifest section' className='text-center text-light'>
                    <Row className='no-gutters mb-2'>
                        <Col className='col-6 offset-3'>
                            <h2 className={ styles['hire-officer-header'] }>Hire Officers</h2>
                        </Col>
                        <Col className='col-1'>
                            <div className={ styles['hire-officer-help'] + ' text-right' }>
                                { children[0] }
                            </div>
                        </Col>
                        <Col className='col-2'>
                            <div className={ styles['hire-officer-exit'] + ' text-left' }>
                                { children[1] }
                            </div>
                        </Col>
                    </Row>
                    <Row className='no-gutters mb-3'>
                        { !currRecruit
                            ? <Col className='col-6 offset-3'>
                                <h5 className={ styles['hire-officer-name-header'] }>&nbsp;</h5>
                              </Col>
                            : <Col className='col-6 offset-3'>
                                <h5 className={ styles['hire-officer-name-header'] }>
                                    { `${currRecruit.nameFirst}${ currRecruit.nameNick ? ` '${currRecruit.nameNick}' ` : ' '}${currRecruit.nameLast}` }
                                </h5>
                              </Col>
                        }
                    </Row>
                    { recAvailable
                        ? <div
                            className={ styles['avatar-sizing'] }
                            dangerouslySetInnerHTML={{__html: currRecruit?.avatar ?? `
                                <svg viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="20vw" height="25vw" fill="transparent"/>
                                </svg>`}}>
                          </div>
                        : <div
                            className={ styles['avatar-sizing'] }
                            dangerouslySetInnerHTML={{__html: `
                                <svg viewBox="0 0 360 369" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="20vw" height="25vw" fill="transparent"/>
                                </svg>`}}>
                          </div>
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
                        { !recAvailable
                            ? <div className={ styles['stats-wrapper'] + ' text-dark' }>
                                <Row className={ styles['stats'] + ' mx-auto' }>
                                    <Col className={ styles['stats-text'] + ' col-12 no-select mt-2 pl-4' }>
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
                                    { !currRecruit ? null :
                                        <span
                                            aria-label='Hire the recruit'
                                            className={ styles['hire-icon']}
                                            onClick={ () => { this._hireOfficers(currRecruit) } }>
                                            <FaHireAHelper />
                                        </span>
                                    }
                                </div>
                                <div className={ styles['stats-wrapper'] + ' text-dark' }>
                                    { this._renderStats() }
                                </div>
                        </>}
                    </div>
                </Col>
            </Row>
        );
    }
}