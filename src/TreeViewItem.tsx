import * as React from 'react';
import Manifest from './lib/Manifest';
import Loading from './Loading';
import Cache from './lib/Cache';

require('./css/treeview.css');

interface IProps {
    id?: string;
    level: number;
    opened: boolean;
    data?: object;
    currentFolderId?: string;
}

interface IState {
    id: string | null;
    level: number;
    opened: boolean;
    data: object | undefined;
    currentFolderId: string | undefined;
}

class TreeViewItem extends React.Component<IProps, IState> {


    constructor(props: IProps) {

        super(props);

        this.state = {
            level: props.level,
            opened: props.opened,
            data: this.props.data || undefined,
            id: this.props.id || null,
            currentFolderId: this.props.currentFolderId || undefined,
        };

        this.updateCurrentFolder = this.updateCurrentFolder.bind(this);
    }

    render() {

        let data;
        if (this.state.data === undefined) {
            if (typeof this.state.id === 'string') {

                const url: string = this.state.id;
                const t = this;

                data = Manifest.fetchFromCache(url);

                if (!data) {

                    Manifest.get(
                        url,
                        function (data2: any) {
                            t.setState({
                                data: data2
                            });
                        }
                    );

                    return <Loading/>;
                }
            } else {
                return '';
            }
        } else {
            data = this.state.data;
        }

        const style = {marginLeft: (this.props.level - 1) * 10};
        let className = 'treeview-item level-' + this.props.level;
        let classNameCaret = 'treeview-caret';


        if (data && data.collections && data.collections.length === 0) {
            classNameCaret += ' no-caret';
        } else if (this.state.opened) {
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


    openFolder(itemId: any) {
        Cache.ee.emit('open-folder', itemId);
    }

    updateCurrentFolder(folderId: string) {
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
