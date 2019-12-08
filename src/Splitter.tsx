import * as React from 'react';
import Config from './lib/Config';
import './css/splitter.css';

interface IProps {
    widthChangedFunc: (width: number) => void;
    left: number;
}

declare let global: {
    config: Config;
};

class Splitter extends React.Component<IProps, {}> {

    private isMoving: boolean = false;

    constructor(props: IProps) {

        super(props);

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

        const splitterWidth = global.config.getSplitterWidth(this.props.left === 0);
        const style = {
            maxWidth: splitterWidth,
            minWidth: splitterWidth,
            left: this.props.left
        };

        return <div className="splitter" onMouseDown={() => this.movingStart()} onTouchStart={() => this.movingStart()}
                    onDoubleClick={() => this.splitterDoubleClick()} style={style} />;
    }

    globalMoveStart(x: number) {
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
        if (this.props.left > 0) {
            this.props.widthChangedFunc(0);
        } else {
            this.props.widthChangedFunc(global.config.getDefaultNavBarWith());
        }
    }
}

export default Splitter;
