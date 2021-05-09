import * as React from 'react';
import './treeview.css';
import CaretDownIcon from '@material-ui/icons/ArrowDropDown';
import CaretRightIcon from '@material-ui/icons/ArrowRight';
import {useState} from "react";
import {getLocalized} from "../../lib/ManifestHelpers";
import PresentationApi from "../../fetch/PresentationApi";
import IManifestData, {IManifestReference} from "../../interface/IManifestData";
import {PropertyValue} from "manifesto.js";
import TreeBuilder from "./TreeBuilder";


interface IPros {
    id: string;
    children?: IManifestReference[];
    label: PropertyValue;
    level: number;
    currentFolderId?: string;
    setCurrentManifest: (id: string) => void;
}

export default function TreeViewItem(props: IPros) {

    const [children, setChildren] = useState<IManifestReference[] | undefined>(props.children);
    const [isOpen, setIsOpen] = useState<boolean>(TreeBuilder.cache[props.id] ?? false);

    const isSubTreeMissing = (): boolean => {

        return !children;
    }



    const loadSubTree = () => {
        PresentationApi.get(
            props.id,
            async function(manifestData: IManifestData) {
                setChildren(manifestData.collections ?? []);
                setIsOpen(true);
            }
        );

    }

    const toggleCaret = () => {

        if (isOpen) {
            TreeBuilder.cache[props.id] = false;
            setIsOpen(false);
        } else {
            TreeBuilder.cache[props.id] = true;
            if (isSubTreeMissing()) {
                loadSubTree();
            } else {
                setIsOpen(true);
            }
        }
    }

    const style = {marginLeft: (props.level - 1) * 10};
    let className = 'aiiif-treeview-item level-' + props.level;
    let classNameCaret = 'aiiif-treeview-caret';
    let caret = <></>;
    const iconStyle = {
        color: "#8C8C8C",
        fontSize: 32
    }



    if (children?.length === 0) {
        classNameCaret += ' aiiif-no-caret';
    } else if (isOpen) {
        caret = <CaretDownIcon style={iconStyle} />;
    } else {
        caret = <CaretRightIcon style={iconStyle} />;
    }
    if (props.id === props.currentFolderId) {
        className += ' aiiif-current';
    }
    const label = getLocalized(props.label);


    const childrenElements: JSX.Element[] = [];



    if (isOpen && children) {
        const childrenLevel = props.level + 1;


        for (const child of children) {
            const c = PresentationApi.fetchFromCache(child.id);
            if (c === false) {
                childrenElements.push(
                    <TreeViewItem
                        level={childrenLevel}
                        key={Math.random()}
                        id={child.id}
                        label={child.label}
                        currentFolderId={props.currentFolderId}
                        setCurrentManifest={props.setCurrentManifest}
                    />
                );
           } else {
                childrenElements.push(
                   <TreeViewItem
                       level={childrenLevel}
                       key={Math.random()}
                       id={c.id}
                       label={c.label}
                       children={c.collections ?? []}
                       currentFolderId={props.currentFolderId}
                       setCurrentManifest={props.setCurrentManifest}
                   />
               );
           }
        }
    }


    return <div>
        <div className={className} style={style}>
            <div className={classNameCaret} onClick={() => toggleCaret()}>
                {caret}
            </div>
            <div className="aiiif-treeview-label" onClick={() => props.setCurrentManifest(props.id)}>{label}</div>
        </div>
        {childrenElements}
    </div>;
}
