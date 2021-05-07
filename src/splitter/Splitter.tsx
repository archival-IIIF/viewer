import React, {CSSProperties, useEffect, useState} from 'react';
import './splitter.css';
import Cache from "../lib/Cache";

interface IProps {
    a: JSX.Element;
    b: JSX.Element;
    id?: string;
    aSize?: number;
    direction: "horizontal"|"vertical";
}

const defaultSize = 20;


export default function Splitter(props: IProps) {

    const myRef: React.RefObject<HTMLDivElement> = React.createRef();

    const getSize = (): number => {
        if (props.id) {
            const storesSize = sessionStorage.getItem('aiiif-splitter-' + props.id);
            if (storesSize && parseInt(storesSize) < 100 && parseInt(storesSize) > 0) {
                return parseInt(storesSize);
            }
        }
        if (props.aSize && props.aSize < 100 && props.aSize > 0) {
            return props.aSize;
        }

        return defaultSize;
    };

    const [size, setSize] = useState<number>(getSize());
    const [isMoving, setIsMoving] = useState<boolean>(false);
    const [lastSize, setLastSize] = useState<number>(0);

    const getAStyle = (): CSSProperties => {
        const sizeP = size.toString() + '%';
        if (props.direction === 'vertical') {
            return {minWidth: sizeP, maxWidth: sizeP};
        }

        return {minHeight: sizeP, maxHeight: sizeP};
    }

    const globalMoveStart = (size: number) => {

        if (isMoving && myRef.current) {
            let offset: number;
            let totalSize: number;
            if (props.direction === 'vertical') {
                totalSize = myRef.current.clientWidth;
                offset = myRef.current.offsetLeft;
            } else {
                totalSize = myRef.current.clientHeight;
                offset = myRef.current.offsetTop;
            }
            size = (size - offset) / totalSize * 100;
            if (props.id) {
                sessionStorage.setItem('aiiif-splitter-' + props.id, size.toString());
            }
            setSize(size);
        } else {
        }
    }

    const globalMoveEnd = () => {
        setIsMoving(false);
        document.body.classList.remove('no-select');
    }

    const movingStart = () => {
        document.body.classList.add('no-select');
        setIsMoving(true);
    }

    const mouseMove = (event: MouseEvent) => {
        if (props.direction === 'vertical') {
            globalMoveStart(event.clientX);
        } else {
            globalMoveStart(event.clientY);
        }
    }

    const touchMove = (event: TouchEvent) => {
        if (props.direction === 'vertical') {
            globalMoveStart(event.touches[0].clientX);
        } else {
            globalMoveStart(event.touches[0].clientY);
        }
    }

    useEffect(() => {
        if (props.id) {
            Cache.ee.addListener('toggle-splitter-'+props.id, toggleSplitter);
        }

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('touchmove', touchMove);
        document.addEventListener('mouseup', globalMoveEnd);
        document.addEventListener('touchend', globalMoveEnd);


        return () => {
            if (props.id) {
                Cache.ee.removeListener('toggle-splitter-' + props.id, toggleSplitter);
            }
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('touchmove', touchMove);
            document.removeEventListener('mouseup', globalMoveEnd);
            document.removeEventListener('touchend', globalMoveEnd);
        }
    })

    const toggleSplitter = () => {
        if (size > 0) {
            setLastSize(size);
            setSize(0);
        } else {
            if (lastSize > 0) {
                setSize(lastSize);
            } else if (props.aSize !== undefined && props.aSize < 100) {
                setSize(props.aSize);
            } else {
                setSize(defaultSize)
            }
        }
    }



    const containerClassName = 'aiiif-splitter-container aiiif-splitter-' + props.direction + ' aiiif-' + props.id;
    return <div className={containerClassName} ref={myRef}>
        <div className="aiiif-a" style={getAStyle()}>{props.a}</div>
        <div className="aiiif-splitter" onMouseDown={() => movingStart()} onTouchStart={() => movingStart()} />
        <div className="aiiif-b">{props.b}</div>
    </div>;
}

