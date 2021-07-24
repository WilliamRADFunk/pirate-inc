import { Tooltip } from 'react-bootstrap';

import { GUID } from './GUID';

export function RenderTooltip(props: any): JSX.Element {
    const id = `tooltip-${GUID()}`;
    return (
        <Tooltip id={ id }>
            { props.children }
        </Tooltip>
    );
}