import React from 'react';
import ReactDOM from 'react-dom';
import Hammer from 'hammerjs';
import bindAll from 'lodash/bindAll';
import FaSpinner from 'react-icons/lib/fa/spinner';
import {scrollToVertical, isElementVisible} from '../utils/scroll';
import PdfHeader from './PdfHeader';
import PdfFile from './PdfFile';
import './PdfViewer.scss';

export class PDFViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            loaded: false,
            scale: 1,
            x: 0,
            y:0,
            deltaX: 0,
            deltaY: 0,
            rotation: 0,
            file: props.file
        };
        bindAll( this, [
            'onDocumentComplete',
            'onError',
            'onPinch',
            'onPanEnd',
            'onPan',
            'onScroll',
            'onPageBlur',
            'onPageChange',
            'onPageEnter',
            'onZoomIn',
            'onZoomOut',
            'onRotate',
            'onNext',
            'onPrev'
        ]);
    }

    componentDidMount() {
        let pdf =  ReactDOM.findDOMNode(this.refs.pdf);
        this.viewer = document.querySelector('.pdf-viewer-container');
        this.viewer.addEventListener('scroll', this.onScroll);

        this.hammer = new Hammer(pdf, {
            preventDefault: true
        });

        this.pinch = new Hammer.Pinch();
        this.hammer.add([this.pinch]);

        this.hammer.on('pinch', this.onPinch);
        this.hammer.on('panend', this.onPanEnd);
        this.hammer.on('pan', this.onPan);
        this.hammer.on('doubletap', this.onZoomIn);
    }

    componentWillReceiveProps(nextProps){
        if(this.props.file !== nextProps.file){
            this.setState({
                file: nextProps.file,
                loaded: false,
                scale: 1,
                x: 0,
                y: 0,
                rotation: 0
            });
        }
    }

    onPinch(e) {
        this.setState({deltaX: this.state.x, deltaY: this.state.y});
    }

    onPan(e) {
        this.state.scale !== 1 && this.setState({
            x: this.state.deltaX + (e.deltaX / this.state.scale) * 1.5,
            y: this.state.deltaY + (e.deltaY / this.state.scale) * 1.5
        });
    }

    onPanEnd(){
        this.state.scale !== 1 && this.setState({
            deltaX: this.state.x,
            deltaY: this.state.y
        });
    }

    onScroll(){
        let canvasElements = document.querySelectorAll('.pdf-viewer-loader.loaded canvas');
        for (let index = 0; canvasElements.length > index; index++){
            //set page to first visible element in list;
            if(isElementVisible(canvasElements[index])){
                this.setState({ pageTemp: index+1, page: index+1});
                return;
            }
        }
    }

    onDocumentComplete(pages) {
        this.setState({ page: 1, pageTemp: 1, pages, loaded: true});
    }

    onError(error){
        this.setState({ loaded:true, error });
    }

    onPageBlur(e){
        let page =  e.target.value;
        this.setState({pageTemp: page});
        if(page > 0 && page <= this.state.pages )
            this.gotoPage(page);
    }

    onPageChange(e){
        this.setState({pageTemp: e.target.value});
    }

    onPageEnter(e){
        e.key === 'Enter' && this.onPageBlur({target: {value:this.state.pageTemp}});
    }

    onRotate(){
        this.setState({rotation: this.state.rotation + 90})
    }

    onZoomIn(){
        this.setState({scale: this.state.scale * 1.5});
    }

    onZoomOut(){
        this.setState({scale: this.state.scale / 1.5});
    }

    onPrev(){
        this.gotoPage(this.state.page-1);
    }

    onNext(){
        this.gotoPage(this.state.page+1);
    }

    gotoPage(page){
        const canvasElements = document.querySelectorAll('.pdf-viewer-loader canvas');
        this.setState({page, pageTemp: page});
        scrollToVertical(this.viewer, canvasElements[page-1].offsetTop + 20, 500, this.state.scale);
    }

    getPDFWidth(){
        const canvas =  document.querySelector('.pdf-viewer-loader canvas');
        return canvas && canvas.offsetWidth;
    }

    render() {
        const {file, pages, page, pageTemp, loaded, error, scale, rotation, x, y} = this.state;
        return (
            <div className={`pdf-viewer ${scale !== 1 ? 'zoomed' : 'default'}`}>
                <PdfHeader
                    onPageBlur={this.onPageBlur}
                    onPageChange={this.onPageChange}
                    onPageEnter={this.onPageEnter}
                    onZoomIn={this.onZoomIn}
                    onZoomOut={this.onZoomOut}
                    onRotate={this.onRotate}
                    onNext={this.onNext}
                    onPrev={this.onPrev}
                    file={file}
                    pages={pages}
                    page={page}
                    pageTemp={pageTemp}
                    scale={scale}
                    x={x} y={y}
                />
                <div className="pdf-viewer-container"
                     ref="pdf">
                    <div className={`pdf-viewer-loader ${loaded ? 'loaded' : 'loading'}`}  style={{transform: `translate(${x}px, ${y}px)`, minWidth: this.getPDFWidth()}}>
                        <PdfFile file={file}
                             scale={scale}
                             rotation={rotation}
                             onDocumentComplete={this.onDocumentComplete}
                             onError={this.onError}
                             page={this.state.page}/>
                    </div>
                    {!loaded && <FaSpinner/>}
                    {error && <div className="pdf-viewer-error">{error}</div>}
                </div>
            </div>
        )
    }
}

export default PDFViewer;