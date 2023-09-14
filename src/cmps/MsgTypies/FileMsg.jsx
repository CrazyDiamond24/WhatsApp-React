import React, { useEffect } from 'react';
import pdfjsLib from 'pdfjs-dist/webpack';

export function FileMsg({ msg }) {
  const isPdf = msg?.content?.endsWith('.pdf');

  useEffect(() => {
    if (isPdf) {
      const loadingTask = pdfjsLib.getDocument(msg?.content);

      loadingTask.promise.then(function(pdf) {
        pdf.getPage(1).then(function(page) {
          const scale = 1.0;
          const viewport = page.getViewport({ scale: scale });

          const canvas = document.getElementById('pdf-canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          page.render(renderContext);
        });
      });
    }
  }, [msg, isPdf]);

  return (
    <div className="file-msg-type">
      {isPdf ? (
        <canvas id="pdf-canvas" style={{ maxWidth: '400px', maxHeight: '250px' }}></canvas>
      ) : (
        <iframe
          src={`https://view.officeapps.live.com/op/view.aspx?src=${msg?.content}`}
          style={{ width: '300px', height: '250px' }}
          frameBorder="0"
        ></iframe>
      )}
            <a href={msg?.content} target="_blank" rel="noopener noreferrer">
        Download File
      </a>
    </div>
  );
}
