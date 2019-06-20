import * as React from 'react';
require('./css/treeview.css');
import Manifest from './lib/Manifest';
import Loading from './Loading';
import Cache from './lib/Cache';

interface IProps {
    id?: string;
    level: number;
    opened: boolean;
    data?: object;
    currentFolderId?: string;
}

class TreeViewItem extends React.Component<IProps, any> {


    constructor(props) {

        super(props);

        this.state = {
            data: props.data,
            level: props.level,
            opened: props.opened,
            id: props.id,
            currentFolderId: props.currentFolderId
        };

        this.updateCurrentFolder = this.updateCurrentFolder.bind(this);
    }

    render() {

        let data;
        if (this.state.data === undefined) {
            const url = this.state.id;
            const t = this;

            data = Manifest.fetchFromCache(url);

            if (data === false) {

                Manifest.get(
                    url,
                    function(data2) {
                        t.setState({
                            data: data2,
                            selected: null
                        });
                    }
                );

                return <Loading/>;
            }
        } else {
            data = this.state.data;
        }


        const style = {marginLeft: (this.props.level - 1) * 10};
        let className = 'treeview-item level-' + this.props.level;
        let classNameCaret = 'treeview-caret';


        if (data.collections.length === 0) {
            classNameCaret += ' no-caret';
        } else if (this.state.opened === true) {
            classNameCaret += ' opened';
        }
        const id = data.id;
        if (id === this.state.currentFolderId) {
            className += ' current';
        }
        const label = data.label;


        const children = [];
        if (this.state.opened) {
            const childrenLevel = this.state.level + 1;
            const folders = data.collections;
            for (const key in folders) {
                if (folders.hasOwnProperty(key)) {
                    const folder = folders[key];
                    let opened = false;
                    if (folder.hasOwnProperty('opened') && folder.opened) {
                        opened = true;
                    }
                    const folderId = folder.id;
                    children.push(
                        <TreeViewItem level={childrenLevel} opened={opened} key={folderId} id={folderId}
                                      currentFolderId={this.state.currentFolderId} />
                    );
                }

            }
        }


        return (
            <div>
                <div className={className} style={style}>
                    <div className={classNameCaret} onClick={() => this.toggleCaret()} />
                    <div className="treeview-label" onClick={() => this.openFolder(id)}>{label}</div>
                </div>
                {children}
            </div>
        );
    }

    toggleCaret() {
        this.setState({
            opened: !this.state.opened
        });

    }


    openFolder(itemId) {
        Cache.ee.emit('open-folder', itemId);
    }

    updateCurrentFolder(folderId) {
        this.setState({
            currentFolderId: folderId
        });
    }


    componentDidMount() {
        Cache.ee.addListener('update-current-folder-id', this.updateCurrentFolder);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('update-current-folder-id', this.updateCurrentFolder);
    }


}

export default TreeViewItem;
