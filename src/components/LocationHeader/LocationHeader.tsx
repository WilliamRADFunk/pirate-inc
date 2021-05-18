import React from 'react';
import './LocationHeader.scoped.scss';

export class LocationHeader extends React.Component {
    public render() {
        return (
            <React.Fragment>
                <img src="plank.png" width="400px" height="200px"></img>
                <div className="title">Location Header</div>
            </React.Fragment>
        );
    }
}