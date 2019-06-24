import * as React from 'react';
require('./css/splitter.css');
import Cache from './lib/Cache';
import TouchDetection from './lib/TouchDetection';

interface IState {
    left: number;
}

interface IProps {
    widthChangedFunc?: (width: number) => void;
    left: number;
}

interface IState {
    left: number;
}

class Splitter extends React.Component<IProps, IState> {

    private isMoving: boolean = false;

    constructor(props) {

        super(props);

        this.state = {left: this.props.left};

        const t = this;
        this.globalMoveStart = this.globalMoveStart.bind(this);
        this.globalMoveEnd = this.globalMoveEnd.bind(this);

        document.addEventListener('mousemove', function(event) {
            t.globalMoveStart(event.clientX);
        });
        document.addEventListener('touchmove', function(event) {
            t.globalMoveStart(event.touches[0].clientX);
        });

        document.addEventListener('mouseup', this.globalMoveEnd);
        document.addEventListener('touchend', this.globalMoveEnd);
    }

    render() {

        const splitterWidth = Cache.getSplitterWidth(this.state.left === 0);
        const style = {
            maxWidth: splitterWidth,
            minWidth: splitterWidth,
            left: this.state.left
        };

        return <div className="splitter" onMouseDown={() => this.movingStart()} onTouchStart={() => this.movingStart()}
                    onDoubleClick={() => this.splitterDoubleClick()} style={style} />;
    }

    globalMoveStart(x) {
        if (this.isMoving) {
            this.props.widthChangedFunc(x);
        }
    }

    globalMoveEnd() {
        this.isMoving = false;
        document.body.classList.remove('no-select');
    }

    movingStart() {
        document.body.classList.add('no-select');
        this.isMoving = true;
    }

    splitterDoubleClick() {
        if (this.state.left > 0) {
            this.props.widthChangedFunc(0);
        } else {
            this.props.widthChangedFunc(Cache.intialWidth);
        }
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.left !== this.state.left) {
            this.setState({ left: nextProps.left });
        }
    }
}

export default Splitter;
