import * as React from 'react';
import TreeView from './TreeView';
import Splitter from './Splitter';
import Cache from './lib/Cache';

interface IState {
    width: number;
}

class TreeViewContainer extends React.Component<{}, IState> {

    constructor(props) {
        super(props);

        this.state = {
            width: Cache.intialWidth
        };

        this.changeWidth = this.changeWidth.bind(this);
    }

    render() {
        return <>
            <TreeView width={this.state.width}/>
            <Splitter left={this.state.width} changeWidthFunc={this.changeWidth} />
        </>;
    }

    changeWidth(width: number) {
        this.setState({width});
    }

}

export default TreeViewContainer;
