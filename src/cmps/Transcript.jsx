import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { TranscriptIcon } from './svgs/TranscriptIcon'
import { socketService } from '../services/socket.service'

function Transcript({ onSelectAudio }) {
  const [recording, setRecording] = useState(false)
  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })
  const user = useSelector((storeState) => {
    return storeState.userModule.selectedUser
  })
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  useEffect(() => {
    return () => {
      stopRecording()
      if (mediaRecorderRef.current) {
        const stream = mediaRecorderRef.current.stream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
      }
    }
  }, [])

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorderRef.current = new MediaRecorder(stream)

    mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
      audioChunksRef.current.push(event.data)
    })

    mediaRecorderRef.current.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunksRef.current)
      const audioUrl = URL.createObjectURL(audioBlob)
      console.log(audioUrl)
      onSelectAudio(audioUrl)
      audioChunksRef.current = []
    })

    mediaRecorderRef.current.start()
    setRecording(true)

    socketService.emit('recording', {
      senderId: loggedInUser._id,
      recipientId: user._id,
      isRecording: true,
    })
  }

  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }

    socketService.emit('recording', {
      senderId: loggedInUser._id,
      recipientId: user._id,
      isRecording: false,
    })
  }

  function toggleRecording() {
    recording ? stopRecording() : startRecording()
  }

  return (
    <div>
      <i title="record" onClick={toggleRecording}>
        <TranscriptIcon
          className={`transcript-icon-svg mic ${recording ? 'active' : ''}`}
        />
      </i>
    </div>
  )
}

export default Transcript
