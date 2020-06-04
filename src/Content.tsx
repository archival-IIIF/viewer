import * as React from 'react';
import Viewer from "./Viewer";
import Splitter from "./splitter/Splitter";
import Folder from "./Folder";

class Content extends React.Component<{}, {}> {

    render() {
        return <Splitter
            id="content"
            aSize={50}
            a={<Viewer />}
            b={<Folder />}
            direction="horizontal"
        />
    }
}

export default Content;
