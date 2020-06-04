import * as React from 'react';
import Viewer from "./viewer/Viewer";
import Splitter from "./splitter/Splitter";
import Folder from "./Folder";
import IManifestData from "./interface/IManifestData";
import Cache from "./lib/Cache";

interface IState {
    data: IManifestData | null;
}

class Content extends React.Component<{}, IState> {

    constructor(props: any) {

        super(props);

        this.state = {
            data: null,
        };

        this.open = this.open.bind(this);
    }

    render() {

        const size = this.getSize();
        let key = "content" + size.toString();
        if(this.state.data && this.state.data.id) {
            key += this.state.data.id;
        }

        if (size === 0) {
            return <Folder data={this.state.data}/>;
        }

        if (this.isAudio()) {
            return <div id="content-audio">
                <Viewer data={this.state.data}/>
                <Folder data={this.state.data}/>
            </div>;
        }

        return <Splitter
            id="content"
            key={key}
            aSize={size}
            a={<Viewer data={this.state.data}/>}
            b={<Folder data={this.state.data}/>}
            direction="horizontal"
        />
    }

    isAudio() {
        const manifestData: any = this.state.data;
        if (!manifestData || !manifestData.hasOwnProperty('resource')) {
            return false;
        }

        if (manifestData.resource.type !== 'audioVideo') {
            return false;
        }

        if (!manifestData.resource.source.format.startsWith('audio')) {
            return false;
        }

        return true;
    }

    getSize(): number {
        const manifestData: any = this.state.data;
        if (!manifestData || !manifestData.hasOwnProperty('resource')) {
            return 0;
        }

        if (
            manifestData.resource.type === 'imageService' ||
            manifestData.resource.type === 'audioVideo' ||
            manifestData.resource.format === 'text/plain'
        ) {
            return 50;
        }

        return 0;
    }

    open(manifestData: any) {
        this.setState({data: manifestData});
    }

    componentDidMount() {
        Cache.ee.addListener('update-file-info', this.open);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('update-file-info', this.open);
    }
}

export default Content;
