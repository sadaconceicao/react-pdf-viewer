import React from 'react';
import FaSearchPlus from 'react-icons/lib/fa/search-plus';
import FaSearchMinus from 'react-icons/lib/fa/search-minus';
import FaRepeat from 'react-icons/lib/fa/repeat';
import FaDownload from 'react-icons/lib/fa/download';

export const PdfHeader = (props) => {

    const {onZoomIn, onZoomOut, onPageBlur, onPageChange, onPageEnter, onRotate,
        file, pageTemp, pages, scale} = props;
    return (
        <header className="pdf-header-controls brand-toolbar">
            <div className="pdf-header-controls-left">
            {pages > 1 &&
                <span className="pdf-header-page-display">
                    <input className="pdf-header-page-input" type="text"
                       onBlur={onPageBlur}
                       onKeyPress={onPageEnter}
                       onChange={onPageChange}
                       value={pageTemp}/>
                    <span className="pdf-header-page-total"> / {pages} </span>
                </span>
            }
            </div>
            <div className="pdf-header-controls-right">
                <button id="pdf-btn-zoom-out" className="brand-toolbar-button"
                        onClick={onZoomOut}
                        disabled={scale < 0.5}><FaSearchMinus/></button>
                <button id="pdf-btn-zoom-in" className="brand-toolbar-button"
                        onClick={onZoomIn}
                        disabled={scale > 10}><FaSearchPlus/></button>
                <button id="pdf-btn-rotate" className="brand-toolbar-button"
                        onClick={onRotate}><FaRepeat/></button>
                <a id="pdf-btn-download" className="btn brand-toolbar-button" target="_blank" href={file} download><FaDownload/></a>
            </div>
        </header>
    )
};

export default PdfHeader;
