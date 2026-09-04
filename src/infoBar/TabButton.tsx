import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import i18next from 'i18next';
import type {IconProp} from "@fortawesome/fontawesome-svg-core";

interface IProps {
    icon: IconProp;
    name: string;
    active: boolean;
    setTab: (currentTab: string) => void;
}

export default function TabButton(props: IProps) {

    if (props.active) {
        return <button type="button" className="active" onClick={() => props.setTab('')}>
            <FontAwesomeIcon icon={props.icon} title={i18next.t('common:' + props.name) ?? undefined}/>
        </button>;
    }

    return <button type="button" onClick={() => props.setTab(props.name)}>
            <FontAwesomeIcon icon={props.icon} title={i18next.t('common:' + props.name) ??  undefined}/>
        </button>;
}
