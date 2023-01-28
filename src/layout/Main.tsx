import * as React from 'react';
import Alert from "../Alert";
import Login from "../Login";
import TopBar from "../topBar/TopBar";
import Content1 from "./Content1";
import {useContext} from "react";
import {AppContext} from "../AppContext";

export default function Main() {

    const {authDate} = useContext(AppContext);

    return <div className="aiiif-root">
        <Alert />
        <Login />
        <TopBar key={authDate} />
        <Content1 />
    </div>;

}
