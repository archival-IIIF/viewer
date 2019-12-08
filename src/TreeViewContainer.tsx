import * as React from 'react';
import TreeView from './TreeView';
import Splitter from './Splitter';

interface IProps {
    width: number;
    widthChangedFunc: (width: number) => void;
}

class TreeViewContainer extends React.Component<IProps, {}> {

    render() {
        return <>
            <TreeView width={this.props.width}/>
            <Splitter left={this.props.width} widthChangedFunc={this.props.widthChangedFunc} />
        </>;
    }
}

export default TreeViewContainer;
