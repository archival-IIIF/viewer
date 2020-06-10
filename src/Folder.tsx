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
        let folderViewKey = this.props.data ? 'folderViewKey' + this.props.data.id : 'folderViewKey';
        return <Splitter
            id="aiiif-splitter-folder"
            a={<FolderView key={folderViewKey}  data={this.props.data}/>}
            b={<FileInfo data={this.props.data}/>}
            aSize={70}
            direction="vertical"
        />
    }
}

export default Folder;
