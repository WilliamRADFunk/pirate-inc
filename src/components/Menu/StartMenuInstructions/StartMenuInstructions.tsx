import React from "react";
import { Button, ButtonGroup, Dropdown, DropdownButton, Row } from "react-bootstrap";

import { Subscription } from "rxjs";

import styles from './StartMenuInstructions.module.scss';
import { ListOption } from "../../../types/ListOption";

interface Props {
    toggleView: () => void
}

interface State {
    selectedInstruction: number;
    toggleView: () => void;
}

export class StartMenuInstructions extends React.Component<Props, State> {
    private subscriptions: Subscription[] = [];

    public instructions: ListOption[] = [
        { label: 'Difficulty Modes', value: 0 },
        { label: 'How to Load a Saved Game', value: 1 },
        { label: 'Action Points', value: 2 },
        { label: 'Infamy', value: 3 },
    ];

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedInstruction: 0,
            toggleView: props.toggleView
        };
    }

    public instructionSelected(event: any): void {
        const instructionKey = Number(event);
        this.setState({ selectedInstruction: instructionKey });
    }
    
    public render() {
        const { selectedInstruction, toggleView } = this.state;

        return (
            <>
                <Row>
                    <Button
                        variant="primary"
                        className="col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                        onClick={toggleView}>
                        Back to Menu
                    </Button>
                </Row>
                <Row>
                    <DropdownButton
                        className={styles["instruction-dropdown-toggle"] + " col-6 offset-3 my-4 bg-info px-0"}
                        as={ButtonGroup}
                        key="instrunction-info"
                        id="instrunction-info-dropdown"
                        variant="info"
                        title={this.instructions[selectedInstruction].label}
                        onSelect={(e) => this.instructionSelected(e)}
                    >
                        {
                            this.instructions.map(instruction => (
                                <Dropdown.Item
                                    className={"text-light " + (selectedInstruction === instruction.value ? styles["bg-selected"] : " bg-info")}
                                    eventKey={instruction.value}
                                    key={instruction.value}
                                    as="button"
                                    active={selectedInstruction === instruction.value}>
                                    {instruction.label}
                                </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </Row>
            </>
        );
    }
}