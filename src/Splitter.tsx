import * as React from 'react';
require('./css/splitter.css');
import Cache from './lib/Cache';

interface IState {
    left: number;
}

interface IProps {
    changeWidthFunc?: (width: number) => void;
    left: number;
}

interface IState {
    left: number;
}

class Splitter extends React.Component<IProps, IState> {

    private isMoving: boolean = false;
    private minWidth: number = 60;

    constructor(props) {

        super(props);

        this.state = {left: this.props.left};

        const t = this;

        document.addEventListener('mouseup', function(event) {
            t.isMoving = false;
            t.enableGlobalTextSelect();
        });

        document.addEventListener('mousemove', function(event) {
            if (t.isMoving) {
                t.props.changeWidthFunc(event.clientX);
                Cache.ee.emit('splitter-move', event.clientX);
                t.disableGlobalTextSelect();
            }
        });

        document.addEventListener('touchmove', function(event) {
            if (t.isMoving) {
                t.props.changeWidthFunc(event.touches[0].clientX);
                Cache.ee.emit('splitter-move', event.touches[0].clientX);
                t.disableGlobalTextSelect();
            }
        });
        document.addEventListener('touchend', function(event) {
            t.isMoving = false;
            t.enableGlobalTextSelect();

        });
    }

    render() {
        return <div className="splitter" onMouseDown={() => this.moveEnd()} onTouchStart={() => this.moveEnd()}
                    onDoubleClick={() => this.splitterDoubleClick()} style={{left: this.state.left}} />;
    }

    moveEnd() {
        this.isMoving = true;
    }

    splitterDoubleClick() {
        if (this.state.left > this.minWidth) {
            this.props.changeWidthFunc(0);
        } else {
            this.props.changeWidthFunc(Cache.intialWidth);
        }
    }


    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.left !== this.state.left) {
            this.setState({ left: nextProps.left });
        }
    }

    enableGlobalTextSelect() {
        document.body.style.userSelect = 'auto';
    }

    disableGlobalTextSelect() {
        document.body.style.userSelect = 'none';
    }
}

export default Splitter;
