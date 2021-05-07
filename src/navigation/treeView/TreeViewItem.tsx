import * as React from 'react';
import Loading from '../../Loading';
import './treeview.css';
import ITree from "../../interface/ITree";
import TreeBuilder from "./TreeBuilder";
import CaretDownIcon from '@material-ui/icons/ArrowDropDown';
import CaretRightIcon from '@material-ui/icons/ArrowRight';
import {useState} from "react";


interface IPros {
    tree?: ITree;
    level: number;
    currentFolderId?: string;
    isOpen?: boolean;
    setCurrentManifest: (id: string) => void;
}

export default function TreeViewItem(props: IPros) {

    const [isOpen, setIsOpen] = useState<boolean>(props.isOpen === true);
    const [tree, setTree] = useState<ITree | undefined>(props.tree);

    const isSubTreeMissing = (): boolean => {
        return (props.tree && props.tree.hasLockedChildren && props.tree.children.length === 0) ? true : false;
    }

    const loadSubTree = () => {
        if (props.tree) {
            TreeBuilder.get(props.tree.id, undefined, (tree) => {
                setTree(tree);
                setIsOpen(true);
            }, true);
        }

    }


    const setOpen = () => {
        if (isSubTreeMissing()) {
            loadSubTree();
        } else {
            setIsOpen(true);
        }
    }

    const toggleCaret = () => {

        if (isOpen) {
            setIsOpen(false)
            return;
        }

        setOpen();
    }

    if (!tree) {
        return <Loading/>;
    }

    const style = {marginLeft: (props.level - 1) * 10};
    let className = 'aiiif-treeview-item level-' + props.level;
    let classNameCaret = 'aiiif-treeview-caret';
    let caret = <></>;
    const iconStyle = {
        color: "#8C8C8C",
        fontSize: 32
    }

    if ((!tree.children || tree.children.length === 0) && tree.hasLockedChildren !== true) {
        classNameCaret += ' aiiif-no-caret';
    } else if (isOpen) {
        caret = <CaretDownIcon style={iconStyle} />;
    } else {
        caret = <CaretRightIcon style={iconStyle} />;
    }
    if (tree.id === props.currentFolderId) {
        className += ' aiiif-current';
    }
    const label = tree.label;


    const children: any = [];
    if (isOpen) {
        const childrenLevel = props.level + 1;
        if (tree.children) {
            for (const child of tree.children) {
                children.push(
                    <TreeViewItem
                        level={childrenLevel}
                        key={Math.random()}
                        tree={child}
                        isOpen={child.isOpen}
                        currentFolderId={props.currentFolderId}
                        setCurrentManifest={props.setCurrentManifest}
                    />
                );
            }
        }
    }

    return (
        <div>
            <div className={className} style={style}>
                <div className={classNameCaret} onClick={() => toggleCaret()}>
                    {caret}
                </div>
                <div className="aiiif-treeview-label" onClick={() => props.setCurrentManifest(tree.id)}>{label}</div>
            </div>
            {children}
        </div>
    );
}

