import React from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";

import styles from "./StartMenuLoad.module.scss";
import { gameManager } from "../../../services/GameManager";

interface Props {
    toggleView: () => void
}

interface State {
    loadCode: string;
    toggleView: () => void;
    validLoadCode: boolean;
}

export class StartMenuLoad extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loadCode: "",
            toggleView: props.toggleView,
            validLoadCode: false
        };
    }

    private validateLoadCode(code: string): boolean {
        console.log("StartMenuLoad: validateLoadCode", code);
        // Make sure code will actually work before enabling load button
        const reg = new RegExp('^[A-Za-z0-9]{16}$');
        return !!(code && reg.test(code));
    }

    public changedLoadCode(event: any): void {
        console.log("StartMenuLoad: changedLoadCode", event);
        const code = event.target.value;
        if (this.validateLoadCode(code)) {
            this.setState({ loadCode: code, validLoadCode: true });
        } else {
            this.setState({ validLoadCode: false });
        }
        
        console.log("StartMenuLoad: changedLoadCode", this.state.validLoadCode);
    }

    public loadGame(): void {
        if (this.state.validLoadCode) {
            // Get code from the text box
            gameManager.loadGame("");
        }
    }
    
    public render() {
        const { loadCode, toggleView, validLoadCode } = this.state;

        return (
            <>
                <div className="row">
                    <div
                        className="btn btn-primary col-6 col-lg-2 offset-3 offset-lg-5 my-4"
                        onClick={toggleView}
                        role="button">Back to Menu</div>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-6 offset-lg-3">
                        <InputGroup hasValidation>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="load-code-text">Code:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                id="load-code"
                                aria-describedby="load-code-text"
                                placeholder="XXXXXXXXXXXXXXXX"
                                onChange={(e) => this.changedLoadCode(e)}
                                isInvalid={ !validLoadCode }/>
                            <Form.Control.Feedback type='invalid' className={styles["fs-sm"]}>
                                Load Code must be 16 alphanumeric characters.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </div>
                </div>
                <div className="row">
                    <div
                        className={`btn btn-info col-6 col-lg-2 offset-3 offset-lg-5 my-4${validLoadCode ? "" : " disabled"}`}
                        onClick={() => this.loadGame()}
                        role="button">Load Game</div>
                </div>
            </>
        );
    }
}