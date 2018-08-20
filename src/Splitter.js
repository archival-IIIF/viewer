import React from "react";
import './css/splitter.css';

class Splitter extends React.Component {

    isMoving = false;

    constructor(props) {

        super(props);

        this.state = {
            left: global.intialWidth
        };

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

        return <div id="splitter"  onMouseDown={() => this.moveEnde() } onDoubleClick={() => this.hideTreeView()} style={{"left": this.state.left}} />
    }




    moveEnde() {
        this.isMoving = true
    }


    hideTreeView() {
        global.ee.emitEvent('splitter-double-click');
    }


    splitterMove(width) {
        this.setState(
            {left: width}
        )
    }

    splitterDoubleClick() {
        if (this.state.width > this.minWidth) {
            this.setState({left: 0})
        } else {
            this.setState({left: this.intialWidth})
        }

    }

    splitterMove = this.splitterMove.bind(this);
    splitterDoubleClick = this.splitterDoubleClick.bind(this);


    componentDidMount() {
        global.ee.addListener('splitter-move', this.splitterMove);
        global.ee.addListener('splitter-double-click', this.splitterDoubleClick);
    }

    componentWillUnmount() {

        global.ee.removeListener('splitter-move', this.splitterMove);
        global.ee.removeListener('splitter-move-end', this.splitterDoubleClick);
    }


}

export default Splitter;
