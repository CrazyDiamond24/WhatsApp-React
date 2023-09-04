import React from 'react'

export function FileMsg({ msg }) {
  const googleDocsViewer = `https://docs.google.com/gview?url=${msg?.content}&embedded=true`
  return (
    <div>
      <a href={msg?.content} target="_blank" rel="noopener noreferrer">
        Download File
      </a>
      <iframe
        src={googleDocsViewer}
        style={{ width: '400px', height: '250px' }}
        frameBorder="0"
      ></iframe>
    </div>
  )
}
