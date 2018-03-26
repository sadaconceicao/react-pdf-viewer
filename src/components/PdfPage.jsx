import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class PdfPage extends Component {

    constructor(props){
        super(props);
        this.state = {rendering: false};
        this.checkRenderPage = this.checkRenderPage.bind(this);
    }

    componentDidMount() {
        this.props.pdf.getPage(this.props.page).then(this.checkRenderPage);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.scale !== this.props.scale)
        this.props.pdf.getPage(nextProps.page).then(this.checkRenderPage);
    }

    renderPage(){
        const { scale } = this.props,
            canvas = ReactDOM.findDOMNode(this.refs[`canvas-${this.props.page}`]),
            canvasContext = canvas.getContext('2d'),
            viewport = this.pdfPage.getViewport(scale),
            dimensions = this.getDimensions(viewport);
        this.setState({rendering: true});
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        this.pdfPage.render({ canvasContext, viewport }).then(()=>{
            this.setState({rendering:false});
        });

    }

    getDimensions(viewport){
        return {
            height: viewport.height,
            width: viewport.width
        }
    }

    checkRenderPage (pdfPage) {
        if (pdfPage) {
            this.pdfPage = pdfPage;
            if (!this.state.rendering){
                this.renderPage();
            } else {
                setTimeout(()=>{
                    this.checkRenderPage(pdfPage);
                }, 500);
            }
        }
    }

    render() {
        return (
            <canvas ref={`canvas-${this.props.page}`}
                    className={this.props.className}
                    style={{transform: `rotate(${this.props.rotation}deg)`}}/>
        );
    }

}
