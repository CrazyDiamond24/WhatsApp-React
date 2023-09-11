import React, { useRef, useEffect } from 'react'
import { getSpotifySvg } from '../services/SVG.service'
import { socketService, SOCKET_EMIT_SEND_MSG } from '../services/socket.service'
import { useSelector } from 'react-redux'
import { msgService } from '../services/msg.service'

export function TakePicture({ closeModal }) {
  const videoRef = useRef(null)

  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })
  const user = useSelector((storeState) => {
    return storeState.userModule.selectedUser
  })
  async function startVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
    } catch (err) {
      console.error('Error: ' + err)
    }
  }

  useEffect(() => {
    startVideo()
  }, [])

  function captureImage() {
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
    const url = canvas.toDataURL('image/png')
    const contentToSend = msgService.getMsgType(
      url,
      loggedInUser,
      user,
      'image'
    )
    socketService.emit(SOCKET_EMIT_SEND_MSG, contentToSend)
    closeModal()
  }

  return (
    <div className="full">
      <video ref={videoRef} autoPlay></video>
      <button className="take-picture-btn" onClick={captureImage}>
        <span
          dangerouslySetInnerHTML={{
            __html: getSpotifySvg('camera'),
          }}
        ></span>
      </button>
      <button title="Close" className="close-camera-btn" onClick={closeModal}>
        X
      </button>
    </div>
  )
}
