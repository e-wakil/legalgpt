import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
//PDF
import PDF from '../../assets/nepal-constitution.pdf'

//Worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function PDFSection() {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(2);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }
    return (
        <>
            <div>
                <Document file={PDF} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber}
                        renderTextLayer={false}
                        renderAnnotationLayer={false} 
                        // canvasBackground='#99a1af'
                        height={600}
                        />
                </Document>
            </div>
        </>
    )
}