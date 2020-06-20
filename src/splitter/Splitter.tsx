import * as React from 'react';
import './splitter.css';
import {CSSProperties} from "react";
import Cache from "../lib/Cache";

interface IProps {
    a: JSX.Element;
    b: JSX.Element;
    id?: string;
    aSize?: number;
    direction: "horizontal"|"vertical";
}

interface IState {
    size: number
}

class Splitter extends React.Component<IProps, IState> {

    private isMoving: boolean = false;
    private readonly myRef: React.RefObject<HTMLDivElement>;
    private lastSize = 0;
    private readonly defaultSize = 20;

    constructor(props: IProps) {

        super(props);

        const t = this;
        this.globalMoveStart = this.globalMoveStart.bind(this);
        this.globalMoveEnd = this.globalMoveEnd.bind(this);

        this.state = {size: this.getSize()};
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

        this.toggleSplitter = this.toggleSplitter.bind(this);
    }

    render() {
        const containerClassName = 'aiiif-splitter-container aiiif-splitter-' + this.props.direction + ' aiiif-' + this.props.id;
        return <div className={containerClassName} ref={this.myRef}>
            <div className="aiiif-a" style={this.getAStyle()}>{this.props.a}</div>
            <div className="aiiif-splitter" onMouseDown={() => this.movingStart()} onTouchStart={() => this.movingStart()}
                    onDoubleClick={() => this.splitterDoubleClick()} />
            <div className="aiiif-b">{this.props.b}</div>
        </div>;
    }

    getSize(): number {
        if (this.props.id) {
            const storesSize = sessionStorage.getItem('aiiif-splitter-' + this.props.id);
            if (storesSize && parseInt(storesSize) < 100 && parseInt(storesSize) > 0) {
                return parseInt(storesSize);
            }
        }
        if (this.props.aSize && this.props.aSize < 100 && this.props.aSize > 0) {
            return this.props.aSize;
        }

        return this.defaultSize;
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
            if (this.props.id) {
                sessionStorage.setItem('aiiif-splitter-' + this.props.id, size.toString());
            }
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

    componentDidMount() {
        if (this.props.id) {
            Cache.ee.addListener('toggle-splitter-'+this.props.id, this.toggleSplitter);
        }
    }


    componentWillUnmount() {
        if (this.props.id) {
            Cache.ee.removeListener('toggle-splitter-' + this.props.id, this.toggleSplitter);
        }
    }

    toggleSplitter() {
        if (this.state.size > 0) {
            this.lastSize = this.state.size;
            this.setState({size: 0})
        } else {
            if (this.lastSize > 0) {
                this.setState({size: this.lastSize})
            } else if (this.props.aSize !== undefined && this.props.aSize < 100) {
                this.setState({size: this.props.aSize})
            } else {
                this.setState({size: this.defaultSize})
            }
        }
    }
}

export default Splitter;
