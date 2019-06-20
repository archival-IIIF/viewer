import * as React from 'react';
require('./css/splitter.css');
import Cache from './lib/Cache';

class Splitter extends React.Component<{}, any> {

    private isMoving = false;
    private minWidth = 60;

    constructor(props) {

        super(props);

        this.state = {
            left: Cache.intialWidth
        };

        const t = this;

        document.addEventListener('mouseup', function(event) {
            t.isMoving = false;
            Cache.ee.emit('splitter-move-end');
        });

        document.addEventListener('mousemove', function(event) {
            if (t.isMoving) {
                Cache.ee.emit('splitter-move', event.clientX);
            }
        });

        document.addEventListener('touchmove', function(event) {
            if (t.isMoving) {
                Cache.ee.emit('splitter-move', event.touches[0].clientX);
            }
        });
        document.addEventListener('touchend', function(event) {
            t.isMoving = false;
            Cache.ee.emit('splitter-move-end');
        });

        this.splitterMove = this.splitterMove.bind(this);
        this.splitterDoubleClick = this.splitterDoubleClick.bind(this);
    }

    render() {

        return <div id="splitter"  onMouseDown={() => this.moveEnde()} onTouchStart={() => this.moveEnde()}
                    onDoubleClick={() => this.hideTreeView()} style={{left: this.state.left}} />;
    }

    moveEnde() {
        this.isMoving = true;
    }

    hideTreeView() {
        Cache.ee.emit('splitter-double-click');
    }

    splitterMove(width) {
        this.setState(
            {left: width}
        );
    }

    splitterDoubleClick() {
        if (this.state.width > this.minWidth) {
            this.setState({left: 0});
        } else {
            this.setState({left: Cache.intialWidth});
        }
    }


    componentDidMount() {
        Cache.ee.addListener('splitter-move', this.splitterMove);
        Cache.ee.addListener('splitter-double-click', this.splitterDoubleClick);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('splitter-move', this.splitterMove);
        Cache.ee.removeListener('splitter-move-end', this.splitterDoubleClick);
    }
}

export default Splitter;
