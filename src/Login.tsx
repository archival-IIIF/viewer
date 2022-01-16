import React, {useRef, useEffect, useState} from 'react';
import PresentationApi from './fetch/PresentationApi';
import ImageApi from './fetch/ImageApi';
import Cache from './lib/Cache';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Token from "./lib/Token";
import {ServiceProfile} from "@iiif/vocabulary/dist-commonjs";
import * as DOMPurify from "dompurify";
import {IAuthService} from "./interface/IManifestData";
import {sanitizeRulesSet} from "./lib/ManifestHelpers";

export default function Login() {

    const messageFrameId = useRef<number>(Math.random());
    const openWindows = useRef<string[]>([]);
    const authService = useRef<IAuthService | undefined>(undefined);


    const [visible, setVisible] = useState<boolean>(false);
    const [error, setError] = useState<boolean | undefined>(undefined);

    const origin = window.location.protocol + '//' + window.location.hostname
        + (window.location.port ? ':' + window.location.port : '');

    useEffect(() => {
        const escFunction = (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                setVisible(false)
            }
        }

        const showLogin = (service: IAuthService) => {

            authService.current = service;
            if (service.profile === ServiceProfile.AUTH_1_KIOSK) {
                openWindow(service.id);
                return;
            }

            if (!visible) {
                setError(false);
                setVisible(true);
            }
        }

        document.addEventListener('keydown', escFunction, false);
        Cache.ee.addListener('show-login', showLogin);

        return () => {
            document.removeEventListener('keydown', escFunction, false);
            Cache.ee.removeListener('show-login', showLogin);
        }
    })


    const openWindow = (id: string) => {

        if (!authService.current || !authService.current.token) {
            return;
        }
        const token = authService.current.token;
        setVisible(false);

        const url = id + '?origin=' + origin;
        if (openWindows.current.includes(id)) {
            return;
        }
        openWindows.current.push(id);

        const win = window.open(url);
        let checkIfLoginWindowIsClosedInterval = window.setInterval(() => {
            try {
                if (win === null || win.closed) {
                    window.clearInterval(checkIfLoginWindowIsClosedInterval);
                    window.addEventListener(
                        'message',
                        (event) => receiveToken(event, id), {once: true}
                    );
                    const src = token + '?messageId=1&origin=' + origin;
                    const messageFrame: any = document.getElementById('message-frame-' + messageFrameId.current);
                    if (messageFrame) {
                        messageFrame.src = src;
                    }
                }
            } catch (e) {
            }

        }, 1000);
    }





    const body = (authService: IAuthService) => {
        const body = [];
        body.push(<div key="description" dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
            __html: DOMPurify.sanitize(authService.description ?? '', sanitizeRulesSet)
        }} />);


        if (error) {
            body.push(<div className="modal-error-message" key="error">{authService.errorMessage}</div>);
        }

        return body;
    }


    const receiveToken = (event: any, id: string) => {

        if (!authService.current || !authService.current.token) {
            return;
        }

        const index = openWindows.current.indexOf(id);
        if (index > -1) {
            openWindows.current.splice(index, 1);
        }

        if (!event.data.hasOwnProperty('accessToken') || event.data.hasOwnProperty('error')) {
            setError(true);
            return;
        }
        PresentationApi.clearCache();
        ImageApi.clearCache();
        Token.set(event.data, authService.current.token, authService.current.logout);
        setVisible(false);
    }

    if (!authService.current) {
        return <></>
    }
    const aService = authService.current;

    return <>
        <iframe id={"message-frame-" + messageFrameId.current} className="aiiif-message-frame " title="message frame" />
        <Dialog
            id={aService.id}
            open={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle >
                {aService.header}
                <span className="close" onClick={() => setVisible(false)}>&times;</span>
            </DialogTitle>
            <DialogContent>
                <DialogContentText color="textPrimary" component="div">
                    {body(aService)}
                </DialogContentText>
                <DialogActions>
                    <Button onClick={() => openWindow(aService.id)} color="primary">
                        {aService.confirmLabel}
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    </>;
}
