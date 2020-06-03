import * as React from 'react';
import './css/splitter.css';
import Viewer from "./Viewer";
import Splitter from "./Splitter";
import Folder from "./Folder";

class Content extends React.Component<{}, {}> {

    render() {
        return <Splitter
            id="content"
            aSize={50}
            a={<Viewer />}
            b={<Folder/>}
            direction="horizontal"
        />
    }
}

export default Content;
