import React, { useRef } from 'react'

export function TakePicture({ onSelectSelfiePicture }) {
  const videoRef = useRef(null)

  async function startVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
    } catch (err) {
      console.error('Error: ' + err)
    }
  }

  function captureImage() {
    const video = videoRef.current

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

    onSelectSelfiePicture(canvas.toDataURL('image/png'))
  }

  return (
    <div onClick={startVideo}>
      a<video ref={videoRef} autoPlay onClick={captureImage}></video>
    </div>
  )
}
