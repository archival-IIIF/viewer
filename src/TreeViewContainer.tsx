import * as React from 'react';
import TreeView from './TreeView';
import Splitter from './Splitter';
import Config from './lib/Config';

interface IState {
    width: number;
}

interface IProps {
    width: number;
    widthChangedFunc: (width: number) => void;
}

declare let global: {
    config: Config;
};

class TreeViewContainer extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            width: global.config.getDefaultNavBarWith()
        };
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.width !== this.state.width) {
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
