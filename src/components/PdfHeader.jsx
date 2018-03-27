import React from 'react';
import FaSearchPlus from 'react-icons/lib/fa/search-plus';
import FaSearchMinus from 'react-icons/lib/fa/search-minus';
import FaRepeat from 'react-icons/lib/fa/repeat';
import FaDownload from 'react-icons/lib/fa/download';
import FaArrowLeft from 'react-icons/lib/fa/arrow-left';
import FaArrowRight from 'react-icons/lib/fa/arrow-right';

export const PdfHeader = (props) => {

    const {onZoomIn, onZoomOut, onPageBlur, onPageChange, onPageEnter, onRotate, onPrev, onNext,
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
                    <button id="pdf-btn-prev" className="pdf-toolbar-button"
                            onClick={onPrev}
                            disabled={pageTemp === 1}><FaArrowLeft/></button>
                    <button id="pdf-btn-next" className="pdf-toolbar-button"
                            onClick={onNext}
                            disabled={pageTemp === pages}><FaArrowRight/></button>
                </span>
            }
            </div>
            <div className="pdf-header-controls-right">
                <button id="pdf-btn-zoom-out" className="pdf-toolbar-button"
                        onClick={onZoomOut}
                        disabled={scale < 0.5}><FaSearchMinus/></button>
                <button id="pdf-btn-zoom-in" className="pdf-toolbar-button"
                        onClick={onZoomIn}
                        disabled={scale > 10}><FaSearchPlus/></button>
                <button id="pdf-btn-rotate" className="pdf-toolbar-button"
                        onClick={onRotate}><FaRepeat/></button>
                <a id="pdf-btn-download" className="pdf-toolbar-button"
                   target="_blank"
                   href={file} download><FaDownload/></a>
            </div>
        </header>
    )
};

export default PdfHeader;
