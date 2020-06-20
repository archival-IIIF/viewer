import * as React from 'react';
import ViewerSpinner from './ViewerSpinner';
import Nl2br from './Nl2br';

interface IProps {
    source: string;
}

interface IState {
    loading: boolean;
    text: string;
}


class PlainTextViewer extends React.Component<IProps, IState> {


    constructor(props: IProps) {

        super(props);

        this.state = {
            loading: true,
            text: '',
        };
    }

    render() {
        if (this.state.loading) {
            return <ViewerSpinner show={this.state.loading} />;
        }

        return <div className="aiiif-plain-text">
            <Nl2br text={this.state.text} />
        </div>;
    }

    componentDidMount() {
        const t = this;
        fetch(this.props.source)
            .then(function(response) {
                return response.text();
            })
            .then(function(text) {
                t.setState({
                    loading: false,
                    text
                });
            });
    }

}

export default PlainTextViewer;
