import React from 'react';


interface IContext {
    treeDate: number;
}

export const AppContext = React.createContext<IContext>({
    treeDate: 0
});
