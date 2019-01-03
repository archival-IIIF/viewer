import * as React from 'react';
require('./css/modal.css');


class Modal extends React.Component<{}, any> {

    render() {

        if (!this.state.visible) {
            return '';
        }

        return (
            <div id={this.state.id} className="modal">
                <div className="modal-content">
                    <span className="close"  onClick={() => this.closeModal()}>&times;</span>
                    {this.title()}
                    {this.body()}
                    {this.button1()}
                </div>
            </div>
        );
    }

    title() {
        if (this.state.title) {
            return <div className="modal-title">{this.state.title}</div>;
        }

        return '';
    }

    body() {

        const output = [];
        if (this.state.body) {
            output.push(<div className="modal-body" key={1}>{this.state.body}</div>);

            return output;
        }

        return [];
    }

    button1() {
        if (this.state.button1) {
            return <div className="modal-button">{this.state.button1}</div>;
        }

        return '';
    }

    closeModal(service?) {
        this.setState({
            visible: false
        });
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.closeModal();
        }
    }

    componentDidMount() {
        this.escFunction = this.escFunction.bind(this);
        document.addEventListener('keydown', this.escFunction, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.escFunction, false);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }
}

export default Modal;
