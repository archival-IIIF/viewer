import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import i18next from 'i18next';
import {IconProp} from "@fortawesome/fontawesome-svg-core";

interface IProps {
    icon: IconProp;
    name: string;
    active: boolean;
    setTab: (currentTab: string) => void;
}

export default function TabButton(props: IProps) {

    if (props.active) {
        return <button className="active" onClick={() => props.setTab('')}>
            <FontAwesomeIcon icon={props.icon} title={i18next.t('common:' + props.name)}/>
        </button>;
    }

    return<button onClick={() => props.setTab(props.name)}>
            <FontAwesomeIcon icon={props.icon} title={i18next.t('common:' + props.name)}/>
        </button>;
}
