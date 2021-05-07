import React, {useState, useEffect} from 'react';
import Cache from './lib/Cache';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Nl2br from './viewer/plainText/Nl2br';
import './css/modal.css';


export default function  Alert() {

    const [visible, setVisible] = useState<boolean>(false);
    const [title, setTitle] = useState<string | undefined>(undefined);
    const [titleJsx, setTitleJsx] = useState<JSX.Element | undefined>(undefined);
    const [body, setBody] = useState<string | undefined>(undefined);
    const [bodyJsx, setBodyJsx] = useState<JSX.Element | undefined>(undefined);


    const t = title ?? (titleJsx ?? <></>);
    const b = body ?
        <Nl2br text={body} urlTransformation={true}/> :
        (bodyJsx ?? <></>);

    const open = (args: any) => {
        setTitle(args['title']);
        setTitleJsx(args['titleJsx']);
        setBody(args['body']);
        setBodyJsx(args['bodyJsx']);
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
        <DialogTitle >
            {t}
            <span className="close" onClick={() => setVisible(false)}>&times;</span>
        </DialogTitle>
        <DialogContent>
            <DialogContentText color="textPrimary" component="div">
                {b}
            </DialogContentText>
        </DialogContent>
    </Dialog>;
}
