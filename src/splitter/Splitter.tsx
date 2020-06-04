import * as React from 'react';
import './splitter.css';
import {CSSProperties} from "react";

interface IProps {
    a: JSX.Element;
    b: JSX.Element;
    id?: string;
    aSize?: number
    direction: "horizontal"|"vertical"
}

interface IState {
    size: number
}

class Splitter extends React.Component<IProps, IState> {

    private isMoving: boolean = false;
    private readonly myRef: React.RefObject<HTMLDivElement>;

    constructor(props: IProps) {

        super(props);

        const t = this;
        this.globalMoveStart = this.globalMoveStart.bind(this);
        this.globalMoveEnd = this.globalMoveEnd.bind(this);
        let size = 20;
        if (this.props.aSize !== undefined && this.props.aSize < 100) {
            size = this.props.aSize;
        }
        this.state = {size};
        this.myRef = React.createRef();

        document.addEventListener('mousemove', function(event) {
            if (t.props.direction === 'vertical') {
                t.globalMoveStart(event.clientX);
            } else {
                t.globalMoveStart(event.clientY);
            }
        });
        document.addEventListener('touchmove', function(event) {
            if (t.props.direction === 'vertical') {
                t.globalMoveStart(event.touches[0].clientX);
            } else {
                t.globalMoveStart(event.touches[0].clientY);
            }
        });


        document.addEventListener('mouseup', this.globalMoveEnd);
        document.addEventListener('touchend', this.globalMoveEnd);
    }

    render() {
        const containerClassName = 'splitter-container splitter-' + this.props.direction;
        return <div className={containerClassName} id={this.props.id} ref={this.myRef}>
            <div className="a" style={this.getAStyle()}>{this.props.a}</div>
            <div className="splitter" onMouseDown={() => this.movingStart()} onTouchStart={() => this.movingStart()}
                    onDoubleClick={() => this.splitterDoubleClick()} />
            <div className="b">{this.props.b}</div>
        </div>;
    }


    getAStyle(): CSSProperties {
        const size = (this.state.size).toString() + '%';
        if (this.props.direction === 'vertical') {
            return {minWidth: size, maxWidth: size};
        }

        return {minHeight: size, maxHeight: size};
    }

    globalMoveStart(size: number) {
        if (this.isMoving && this.myRef.current) {
            let offset = 0;
            let totalSize = 1;
            if (this.props.direction === 'vertical') {
                totalSize = this.myRef.current.clientWidth;
                offset = this.myRef.current.offsetLeft;
            } else {
                totalSize = this.myRef.current.clientHeight;
                offset = this.myRef.current.offsetTop;
            }
            size = (size - offset) / totalSize * 100;
            this.setState({size})
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
        /*if (this.props.left > 0) {
            this.props.widthChangedFunc(0);
        } else {
            this.props.widthChangedFunc(global.config.getDefaultNavBarWith());
        }*/
    }
}

export default Splitter;
