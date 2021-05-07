import React, {useState, useEffect} from 'react';
import Cache from './lib/Cache';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Nl2br from './viewer/plainText/Nl2br';
import './css/modal.css';

interface IContent {
    title?: string;
    titleJsx?: JSX.Element;
    body?: string;
    bodyJsx?:  JSX.Element;
}

export default function Alert() {

    const [visible, setVisible] = useState<boolean>(false);
    const [content, setContent] = useState<IContent>({});


    const title = content.title ?? (content.titleJsx ?? <></>);
    const body = content.body ?
        <Nl2br text={content.body} urlTransformation={true}/> :
        (content.bodyJsx ?? <></>);

    const open = (input: IContent) => {
        setContent(input)
        setVisible(true);
    }

    useEffect(() => {
        Cache.ee.addListener('alert', open);
        return () => {
            Cache.ee.removeListener('alert', open);
        }
    });

    return <Dialog
        open={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
    >
        <DialogTitle>
            {title}
            <span className="close" onClick={() => setVisible(false)}>&times;</span>
        </DialogTitle>
        <DialogContent>
            <DialogContentText color="textPrimary" component="div">
                {body}
            </DialogContentText>
        </DialogContent>
    </Dialog>;
}
