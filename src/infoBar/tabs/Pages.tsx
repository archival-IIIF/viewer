import React, {CSSProperties, useContext} from "react";
import {AppContext} from "../../AppContext";



export default function Pages() {

    const {page, setPage, currentManifest} = useContext(AppContext);

    const output: JSX.Element[] = [];

    if (!currentManifest || currentManifest.images.length < 1) {
        return <></>;
    }

    let i = 0;
    for (const image of currentManifest.images) {
        let className = 'aiiif-image-preview';
        if (i === page) {
            className += ' active'
        }
        const width = 120;
        const style: CSSProperties = {width};
        if (image.width > 1 && image.height > 1) {
            style.height = width * image.height / image.width;
        }
        const j = i;
        output.push(
            <div className={className} key={i++} onClick={() => setPage(j)}>
                <img src={image.id + '/full/'+width+',/0/default.jpg'} alt="" style={style}/>
                <div><span>{i + 1}</span></div>
            </div>
        );
    }

    return <>{output}</>;
}
