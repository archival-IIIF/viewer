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

        let size = this.getSize();
        let key = "content";
        if(this.state.data && this.state.data.id) {
            key += this.state.data.id;
        }
        if (size.size) {
            key += size.size.toString();
        }

        if (size.size === 0) {
            return <Folder data={this.state.data}/>;
        }

        return <Splitter
            id="content"
            key={key}
            aSize={size.size}
            aMaxSize={size.max}
            a={<Viewer data={this.state.data}/>}
            b={<Folder data={this.state.data}/>}
            direction="horizontal"
        />
    }

    getSize(): {size?: number, max?: number} {
        const manifestData: any = this.state.data;
        if (!manifestData || !manifestData.hasOwnProperty('resource')) {
            return {size: 0}
        }

        if (manifestData.resource.type === 'imageService' || manifestData.resource.format === 'text/plain') {
            return {size: 50}
        }

         if (manifestData.resource.type === 'audioVideo') {
            if (manifestData.resource.source.format.startsWith('audio')) {
                return {max: 30}
            }

            return {size: 50}
        }

        return {size: 0}
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
