import * as React from 'react';
import "./spinner.css";

interface IProps {
    show: boolean;
    center?: boolean;
}

export default function ViewerSpinner(props: IProps) {

    if (!props.show) {
        return <></>;
    }

    let className = 'lds-ripple';
    if (props.center !== false) {
        className += ' lds-ripple-center'
    }

    return <div className={className}><div/><div style={{color: 'black !important'}}/></div>;
}
