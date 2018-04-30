import React from "react";
import './css/treeview.css';
import Manifest from "./lib/Manifest";
import Loading from "./Loading";

class TreeViewItem extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            data: props.data,
            level: props.level,
            opened: props.opened,
            id: props.id,
            currentFolderId: props.currentFolderId
        };

    }

    render() {

        let data;
        if (this.state.data === undefined) {

            let url = this.state.id+"/manifest.json";
            let t = this;

            data = Manifest.fetchFromCache(url);

            if (data === false) {

                Manifest.get(
                    url,
                    function (data) {
                        t.setState({
                            data: data,
                            selected: null
                        });
                    }
                );

                return <Loading/>;
            }
        } else {
            data = this.state.data;
        }


        let className = "treeview-item level-" + this.props.level;
        let classNameCaret = "treeview-caret";


        if (data.collections === undefined) {
            classNameCaret += " no-caret";
        } else if (this.state.opened === true) {
            classNameCaret += " opened";
        }
        if (data["@id"] === this.state.currentFolderId) {
            className += " current";
        }
        let id = data["@id"];
        let label = data.label;


        let children = [];
        if (this.state.opened) {
            let childrenLevel = this.state.level + 1;
            let folders = data.collections;
            for (let key in folders) {

                let folder = folders[key];
                let opened = false;
                if (folder.hasOwnProperty("opened") && folder.opened) {
                    opened = true;
                }
                let id = folder["@id"];
                children.push(
                    <TreeViewItem level={childrenLevel} opened={opened} key={id} id={id} currentFolderId={this.state.currentFolderId} />
                );
            }
        }


        return (
            <div>
                <div className={className}>
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
        global.ee.emitEvent('open-folder', [itemId]);
    }

    updateCurrentFolder(folderId) {
        this.setState({
            currentFolderId: folderId
        });
    }

    updateCurrentFolderId = this.updateCurrentFolder.bind(this);

    componentDidMount() {
        global.ee.addListener('update-current-folder-id', this.updateCurrentFolderId);
    }

    componentWillUnmount() {
        global.ee.removeListener('update-current-folder-id', this.updateCurrentFolderId);
    }


}

export default TreeViewItem;
