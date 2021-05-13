import React, {CSSProperties, useContext} from 'react';
import i18next from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faSearchPlus, faSearchMinus, faUndo, faExpand, faArrowLeft, faArrowRight}
    from "@fortawesome/free-solid-svg-icons";
import './imageButtons.css';
import {AppContext} from "../../AppContext";
import {IPresentationApiImage} from "../../interface/IManifestData";

interface IProps {
    viewerId: number;
    show: boolean;
    data: IPresentationApiImage[];
}

export default function ImageButtons(props: IProps) {

    const {page, setPage} = useContext(AppContext);

    const style: CSSProperties = {};
    if (!props.show) {
        style.display = 'none';
    }

    return <div className="aiiif-openseadragon-action-buttons" style={style}>
        <button id={"zoom-in-button-" + props.viewerId}>
            <FontAwesomeIcon icon={faSearchPlus} />
        </button>
        <button id={"zoom-out-button-" + props.viewerId}>
            <FontAwesomeIcon icon={faSearchMinus}  />
        </button>
        <button id={"rotate-right-button-" + props.viewerId}>
            <FontAwesomeIcon icon={faUndo} flip="horizontal" />
        </button>
        <button id={"home-button-" + props.viewerId.toString()}>
            <FontAwesomeIcon icon={faHome}  />
        </button>
        <button id={"fullpage-button-" + props.viewerId.toString()} className="aiiif-openseadragon-icon aiiif-fullpage-button">
            <FontAwesomeIcon icon={faExpand} />
        </button>
        {(props.data.length > 1) &&
        <button disabled={(page === 0)}
                onClick={() => setPage(page - 1)} title={i18next.t('common:previousPage')}>
            <FontAwesomeIcon icon={faArrowLeft}/>
        </button>
        }
        {(props.data.length > 1) &&
        <button disabled={(page + 1 === props.data.length)}
                onClick={() => setPage(page + 1)} title={i18next.t('common:nextPage')}>
            <FontAwesomeIcon icon={faArrowRight}/>
        </button>
        }
    </div>
}
