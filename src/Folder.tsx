import * as React from 'react';
import FolderView from "./FolderView";
import Splitter from "./splitter/Splitter";
import FileInfo from "./FileInfo";
import IManifestData from "./interface/IManifestData";

interface IProps {
    data: IManifestData | null;
}

class Folder extends React.Component<IProps, {}> {

    render() {
        return <Splitter
            a={<FolderView data={this.props.data}/>}
            b={<FileInfo data={this.props.data}/>}
            aSize={70}
            direction="vertical"
        />
    }
}

export default Folder;
