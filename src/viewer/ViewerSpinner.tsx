import * as React from 'react';
import WindowInfo from '../lib/WindowInfo';

interface IProps {
    show: boolean;
}

class ViewerSpinner extends React.Component<IProps, {}> {

    render() {
        if (!this.props.show) {
            return '';
        }

        return <div className="aiiif-viewer-spinner" style={{top: WindowInfo.getHeight() / 4 + 32}}>
            <div /><div />
        </div>;
    }
}

export default ViewerSpinner;
