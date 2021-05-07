import React, {useState} from 'react';
import IManifestData from '../interface/IManifestData';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TwitterIcon from '@material-ui/icons/Twitter';
import DialogContent from "@material-ui/core/DialogContent";
import EmailIcon from "@material-ui/icons/Email";
import CodeIcon from '@material-ui/icons/Code';
import './share.css';
import FacebookIcon from "../icons/fa/FacebookIcon";
import IIIFIcon from "../icons/IIIFIcon";
import {ServiceProfile} from "@iiif/vocabulary";
import Config from "../lib/Config";
import ShareIcon from '@material-ui/icons/Share';
import {Translation} from "react-i18next";
import {getLocalized} from "../lib/ManifestHelpers";


interface IProps {
    currentManifest: IManifestData;
}

declare let global: {
    config: Config;
};


export default function Share(props: IProps) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isEmbedVisible, setIsEmbedVisible] = useState<boolean>(false);

    const currentManifest = props.currentManifest;
    if (
        global.config.getDisableSharing() ||
        currentManifest.restricted ||
        (
            currentManifest.authService &&
            currentManifest.authService.profile !== ServiceProfile.AUTH_0_CLICK_THROUGH &&
            currentManifest.authService.profile !== ServiceProfile.AUTH_1_CLICK_THROUGH
        )
    ) {
        return <></>;
    }

    const title = getLocalized(currentManifest.label);
    const encodedUrl = encodeURI(window.location.href);
    const twitterUrl = 'https://twitter.com/intent/tweet?text=' + title + ': ' + encodedUrl;
    const facebookUrl = 'https://www.facebook.com/sharer.php?u=' + encodedUrl;

    return (
        <>
            <div className="aiiif-icon-button" onClick={() => setIsOpen(true)}>
                <ShareIcon />
                <Translation ns="common">{(t, { i18n }) => <p>{t('share')}</p>}</Translation>
            </div>

            <Dialog onClose={() => setIsOpen(false)} aria-labelledby="simple-dialog-title"
                    open={isOpen} fullWidth={true}>
                <DialogTitle>
                    <Translation ns="common">{(t, { i18n }) => <p>{t('share')}</p>}</Translation>
                    <span className="close" onClick={() => setIsOpen(false)}>&times;</span>
                </DialogTitle>
                <DialogContent>

                    <div className="aiiif-share-button-group">
                        <a target="_blank" rel="noopener noreferrer" href={props.currentManifest.id}
                           className="aiiif-share-button aiiif-share-button-iiif">
                            <IIIFIcon />
                        </a>

                        <a href={"mailto:?subject=" + title + "&body=" + window.location.href}
                           className="aiiif-share-button aiiif-share-button-email">
                            <EmailIcon />
                        </a>

                        <div className="aiiif-share-button aiiif-share-button-embed"
                             onClick={() => setIsEmbedVisible(!isEmbedVisible)}>
                            <CodeIcon />
                        </div>

                        <a target="_blank" rel="noopener noreferrer" href={facebookUrl}
                           className="aiiif-share-button aiiif-share-button-facebook">
                            <FacebookIcon />
                        </a>

                        <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
                           className="aiiif-share-button aiiif-share-button-twitter">
                            <TwitterIcon />
                        </a>
                    </div>

                    {isEmbedVisible &&
                        <code className="aiiif-share-code">
                            { unescape('<iframe width="560" height="315" src="'+window.location.href+'" />')}
                        </code>
                    }

                </DialogContent>
            </Dialog>
        </>
    );
}
