import React from "react";

class Banner extends React.Component {

    constructor(props) {

        super(props);


        this.state = {
            text: null,
        };
    }

    render() {

        if (this.state.text === null) {
            return "";
        }

        return <div id="banner">{this.state.text}</div>
    }


    updateText(text) {

        this.setState({
            text: text,
        });
    }

    componentDidMount() {
        global.ee.addListener('update-banner-text', this.updateText.bind(this));
    }

}

export default Banner;
