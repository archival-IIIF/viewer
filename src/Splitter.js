import React from "react";
import './css/splitter.css';

class Splitter extends React.Component {

    isMoving = false;

    constructor(props) {

        super(props);


        let t = this;

        document.addEventListener("mouseup", function (event) {
            t.isMoving = false;
            global.ee.emitEvent('splitter-move-end', []);
        });

        document.addEventListener("mousemove", function (event) {
            if (t.isMoving) {
                global.ee.emitEvent('splitter-move', [event.clientX]);
            }
        });
    }

    render() {

        return <div id="splitter"  onMouseDown={() => this.moveEnde() } onDoubleClick={() => this.hideTreeView()} />
    }




    moveEnde() {
        this.isMoving = true
    }


    hideTreeView() {
        global.ee.emitEvent('splitter-double-click');
    }



}

export default Splitter;
