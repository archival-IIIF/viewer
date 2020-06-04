import * as React from 'react';
import FolderView from "./FolderView";
import Splitter from "./splitter/Splitter";
import FileInfo from "./FileInfo";

class Folder extends React.Component<{}, {}> {

    render() {
        return <Splitter
            a={<FolderView />}
            b={<FileInfo />}
            aSize={70}
            direction="vertical"
        />
    }
}

export default Folder;
