import * as React from 'react';
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

interface IState {
    isOpen: boolean;
    isEmbedVisible: boolean;
}

declare let global: {
    config: Config;
};


export default class Share extends React.Component<IProps,IState> {

    constructor(props: any) {

        super(props);

        this.state = {isOpen: false, isEmbedVisible: false};

        this.toggleIsEmbedVisible = this.toggleIsEmbedVisible.bind(this);
    }

    render() {
        const currentManifest = this.props.currentManifest;
        if (
            global.config.getDisableSharing() ||
            currentManifest.restricted ||
            (
                currentManifest.authService &&
                currentManifest.authService.profile !== ServiceProfile.AUTH_0_CLICK_THROUGH &&
                currentManifest.authService.profile !== ServiceProfile.AUTH_1_CLICK_THROUGH
            )
        ) {
            return '';
        }

        const title = getLocalized(currentManifest.label);
        const encodedUrl = encodeURI(window.location.href);
        const twitterUrl = 'https://twitter.com/intent/tweet?text=' + title + ': ' + encodedUrl;
        const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '&t=' + title;

        return (
            <nav className="aiiif-bar">
                <div className="aiiif-icon-button" onClick={() => this.setIsOpen(true)}>
                    <ShareIcon />
                    <Translation ns="common">{(t, { i18n }) => <p>{t('share')}</p>}</Translation>
                </div>

                <Dialog onClose={() => this.setIsOpen(false)} aria-labelledby="simple-dialog-title"
                        open={this.state.isOpen} fullWidth={true}>
                    <DialogTitle>
                        <Translation ns="common">{(t, { i18n }) => <p>{t('share')}</p>}</Translation>
                        <span className="close" onClick={() => this.setIsOpen(false)}>&times;</span>
                    </DialogTitle>
                    <DialogContent>

                        <div className="aiiif-share-button-group">
                            <a target="_blank" rel="noopener noreferrer" href={this.props.currentManifest.id}
                               className="aiiif-share-button aiiif-share-button-iiif">
                                <IIIFIcon />
                            </a>

                            <a href={"mailto:?subject=" + title + "&body=" + window.location.href}
                               className="aiiif-share-button aiiif-share-button-email">
                                <EmailIcon />
                            </a>

                            <div className="aiiif-share-button aiiif-share-button-embed"
                                 onClick={this.toggleIsEmbedVisible}>
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

                        {this.renderEmbed()}

                    </DialogContent>
                </Dialog>
            </nav>
        );
    }

    setIsOpen(isOpen: boolean) {
        this.setState({isOpen})
    }

    toggleIsEmbedVisible() {
        this.setState({isEmbedVisible: !this.state.isEmbedVisible})
    }

    renderEmbed() {
        const iframe = unescape(
            '<iframe width="560" height="315" src="'+window.location.href+'" frameBorder="0" />'
        );
        if (this.state.isEmbedVisible) {
            return <code className="aiiif-share-code">
                {iframe}
            </code>;
        }
    }

}
