interface ITree {
    id: string;
    label: string;
    children: ITree[];
    hasLockedChildren?: boolean;
    isOpen?: boolean;
}

export default ITree;
