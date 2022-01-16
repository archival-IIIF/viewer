import React, {useEffect, useContext} from 'react';
import Cache from './lib/Cache';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Nl2br from './viewer/plainText/Nl2br';
import './css/modal.css';
import {AppContext} from "./AppContext";

export interface IAlertContent {
    title?: string;
    titleJsx?: JSX.Element;
    body?: string;
    bodyJsx?:  JSX.Element;
}

export default function Alert() {

    const {alert, setAlert} = useContext(AppContext);

    useEffect(() => {
        const open = (input: IAlertContent) => {
            setAlert(input)
        }

        Cache.ee.addListener('alert', open);
        return () => {
            Cache.ee.removeListener('alert', open);
        }
    });

    if (!alert) {
        return <></>;
    }

    const title = alert.title ?? (alert.titleJsx ?? <></>);
    const body = alert.body ?
        <Nl2br text={alert.body} urlTransformation={true}/> :
        (alert.bodyJsx ?? <></>);

    return <Dialog
        open={true}
        onClose={() => setAlert(undefined)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
    >
        <DialogTitle>
            {title}
            <span className="close" onClick={() => setAlert(undefined)}>&times;</span>
        </DialogTitle>
        <DialogContent>
            <DialogContentText color="textPrimary" component="div">
                {body}
            </DialogContentText>
        </DialogContent>
    </Dialog>;
}
