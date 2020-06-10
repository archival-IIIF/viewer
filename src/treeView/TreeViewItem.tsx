import * as React from 'react';
import Loading from '../Loading';
import './treeview.css';
import ITree from "../interface/ITree";
import Cache from "../lib/Cache";
import TreeBuilder from "./TreeBuilder";

interface IPros {
    tree?: ITree;
    level: number;
    currentFolderId?: string;
    isOpen?: boolean;
}

interface IState {
    isOpen: boolean;
    tree?: ITree;
}

class TreeViewItem extends React.Component<IPros, IState> {


    constructor(props: IPros) {

        super(props);

        this.state = {isOpen: this.props.isOpen === true, tree: this.props.tree};

        this.openIt = this.openIt.bind(this);
    }

    render() {
        const data = this.state.tree;

        if (!data) {
            return <Loading/>;
        }

        const style = {marginLeft: (this.props.level - 1) * 10};
        let className = 'treeview-item level-' + this.props.level;
        let classNameCaret = 'treeview-caret';


        if ((!data.children || data.children.length === 0) && data.hasLockedChildren !== true) {
            classNameCaret += ' no-caret';
        } else if (this.state.isOpen) {
            classNameCaret += ' opened';
        }
        if (data.id === this.props.currentFolderId) {
            className += ' current';
        }
        const label = data.label;


        const children: any = [];
        if (this.state.isOpen) {
            const childrenLevel = this.props.level + 1;
            if (data.children) {
                for (const child of data.children) {
                    children.push(
                        <TreeViewItem level={childrenLevel} key={child.id} tree={child} isOpen={child.isOpen}
                                   currentFolderId={this.props.currentFolderId} />
                    );
                }
            }
        }

        return (
            <div>
                <div className={className} style={style}>
                    <div className={classNameCaret} onClick={() => this.toggleCaret()}/>
                    <div className="treeview-label" onClick={() => this.openFolder(data.id)}>{label}</div>
                </div>
                {children}
            </div>
        );
    }

    toggleCaret() {

        if (this.state.isOpen) {
            this.setState({isOpen: false});
            return;
        }

        this.setOpen();
    }

    openFolder(itemId: string) {
        this.setOpen();

        Cache.ee.emit('open-folder', itemId);
    }

    isSubTreeMissing() {
        return (
            this.props.tree &&
            this.props.tree.hasLockedChildren &&
            this.props.tree.children.length === 0
        )
    }

    loadSubTree() {
        if (this.props.tree) {
            const t = this;
            TreeBuilder.get(this.props.tree.id, undefined, (tree) => {
                t.setState({tree, isOpen: true})
            }, true);
        }

    }

    setOpen() {
        if (this.isSubTreeMissing()) {
            this.loadSubTree();
        } else {
            this.setState({isOpen: true});
        }
    }

    openIt(id: string) {
        if (this.props.tree && this.props.tree.id === id) {
            this.setOpen();
        }
    }

    componentDidMount() {
        Cache.ee.addListener('update-current-folder-id', this.openIt);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('update-current-folder-id', this.openIt);
    }
}

export default TreeViewItem;
