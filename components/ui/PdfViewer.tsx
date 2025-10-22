"use client";

import React, { useState, useEffect, useMemo  } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Usa CDN com a versão correta do pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface IProps {
    url: string;
    watermarkText?: string; // texto da marca d'água dinâmica
}

const PdfViewer: React.FC<IProps> = ({ url, watermarkText }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [darkMode, setDarkMode] = useState<boolean>(false);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const goToPrevPage = () => setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
    const goToNextPage = () => setPageNumber((prev) => (prev < numPages ? prev + 1 : prev));
    const onPageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = Number(e.target.value);
        if (val > numPages) val = numPages;
        else if (val < 1) val = 1;
        setPageNumber(val);
    };

    const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
    const toggleDarkMode = () => setDarkMode((prev) => !prev);

    // Marca d'água simples com CSS
    const watermark = watermarkText ? (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(-30deg)",
                opacity: 0.1,
                fontSize: 48,
                fontWeight: "bold",
                color: darkMode ? "#fff" : "#000",
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 9999,
                whiteSpace: "nowrap",
                maxWidth: "20vw",
                textAlign: "center",
            }}
            aria-hidden="true"
        >
            {watermarkText}
        </div>
    ) : null;

      // memoize options para evitar warning
  const pdfOptions = useMemo(() => ({
    cMapUrl: "cmaps/",
    cMapPacked: true
  }), []);

    return (
        <div
            style={{
                backgroundColor: darkMode ? "#121212" : "#fff",
                color: darkMode ? "#eee" : "#000",
                minHeight: "100vh",
                padding: 16,
                position: "relative",
                userSelect: "text",
            }}
        >
            {watermark}
            <header
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                    gap: 12,
                    flexWrap: "wrap",
                }}
            >
                <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
                    {"← Anterior"}
                </button>

                <input
                    type="number"
                    min={1}
                    max={numPages}
                    value={pageNumber}
                    onChange={onPageInputChange}
                    style={{ width: 50, textAlign: "center" }}
                    aria-label="Número da página"
                />

                <span>de {numPages}</span>

                <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
                    {"Próxima →"}
                </button>

                <button onClick={zoomOut} aria-label="Diminuir zoom" disabled={scale <= 0.5}>
                    -
                </button>
                <span>{(scale * 100).toFixed(0)}%</span>
                <button onClick={zoomIn} aria-label="Aumentar zoom" disabled={scale >= 3}>
                    +
                </button>

                <button onClick={toggleDarkMode} aria-label="Alternar modo escuro">
                    {darkMode ? "Modo Claro" : "Modo Escuro"}
                </button>
            </header>

            <main
                style={{
                    display: "flex",
                    justifyContent: "center",
                    border: darkMode ? "1px solid #444" : "1px solid #ccc",
                    padding: 8,
                    borderRadius: 4,
                }}
            >
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading="Carregando PDF..."
                    options={pdfOptions}  // usa o objeto memoizado aqui
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderAnnotationLayer={false}
                        renderTextLayer={true}
                        loading="Carregando página..."
                    />
                </Document>
            </main>
        </div>
    );
};

export default PdfViewer;
