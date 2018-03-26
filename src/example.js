import React from 'react';
import ReactDOM from 'react-dom';
import PdfViewer from './index';
import 'bootstrap/scss/bootstrap-reboot.scss';

ReactDOM.render( <PdfViewer file="pdf.pdf"></PdfViewer>,
    document.getElementById('root')
);