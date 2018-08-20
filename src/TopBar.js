import React from "react";
import './css/topbar.css';

class TopBar extends React.Component {

    render() {
        return <div id="topbar">
            <span id="show-icon-view" onClick={() => this.showIconView()}>Icon view</span>&nbsp;
            <span id="show-list-view" onClick={() => this.showListView()}>List view</span>
        </div>
    }


    showListView() {
        global.ee.emitEvent('show-list-view');
    }

    showIconView() {
        global.ee.emitEvent('show-icon-view');
    }

}

export default TopBar;
