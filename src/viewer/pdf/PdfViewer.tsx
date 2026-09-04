import {useContext} from "react";
import {AppContext} from "../../AppContext";

export default function PdfViewer() {

    const {currentManifest} = useContext(AppContext);
    if (!currentManifest?.resource) {
        return null;
    }

    const id = currentManifest.resource.id;

    return <iframe className="aiiif-viewer" src={id} title={id}/>;
}
