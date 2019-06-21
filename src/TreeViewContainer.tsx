import * as React from 'react';
import TreeView from './TreeView';
import Splitter from './Splitter';
import Cache from './lib/Cache';

interface IState {
    width: number;
}

interface IProps {
    width: number;
    widthChangedFunc: (width: number) => void;
}

class TreeViewContainer extends React.Component<IProps, IState> {

    constructor(props) {
        super(props);

        this.state = {
            width: Cache.intialWidth
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.left !== this.state.width) {
            this.setState({ width: nextProps.width });
        }
    }

    render() {
        return <>
            <TreeView width={this.props.width}/>
            <Splitter left={this.state.width} widthChangedFunc={this.props.widthChangedFunc} />
        </>;
    }

}

export default TreeViewContainer;
