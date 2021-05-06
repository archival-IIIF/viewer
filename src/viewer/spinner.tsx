import React from "react";
import "./spinner.css";

interface IProps {
   show?: boolean;
   center?: boolean;
}

export default function Spinner(props: IProps) {
    if (props.show === false) {
        return <></>;
    }

    let className = 'lds-ripple';
    if (props.center === true) {
        className += ' lds-ripple-center'
    }

    return <div className={className}><div /><div/></div>;
}
