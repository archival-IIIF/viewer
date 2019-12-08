import * as React from 'react';
import TreeView from './TreeView';
import Splitter from './Splitter';
import Config from './lib/Config';

interface IProps {
    width: number;
    widthChangedFunc: (width: number) => void;
}

class TreeViewContainer extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return <>
            <TreeView width={this.props.width}/>
            <Splitter left={this.props.width} widthChangedFunc={this.props.widthChangedFunc} />
        </>;
    }

}

export default TreeViewContainer;
