import React from 'react';
import './Title.scoped.scss';

export class Title extends React.Component {
    public render() {
        return (
            <React.Fragment>
                <img src="pirate-flag.png" width="400px" height="200px"></img>
                <div className="title">Pirates Incorporated</div>
            </React.Fragment>
        );
    }
}