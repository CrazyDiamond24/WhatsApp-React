import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getSpotifySvg } from '../services/SVG.service'

function Transcript({ onSelectAudio }) {
  const [recording, setRecording] = useState(false)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorderRef.current = new MediaRecorder(stream)

    mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
      audioChunksRef.current.push(event.data)
    })

    mediaRecorderRef.current.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunksRef.current)
      const audioUrl = URL.createObjectURL(audioBlob)
      onSelectAudio(audioUrl)
      audioChunksRef.current = []
    })

    mediaRecorderRef.current.start()
    setRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

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

  const toggleRecording = () => {
    recording ? stopRecording() : startRecording()
  }

  return (
    <div>
      <i title="record" onClick={toggleRecording}>
        <span
          // className={`mic ${recording ? 'active' : ''}`}
          dangerouslySetInnerHTML={{
            __html: getSpotifySvg('mic'),
          }}
        ></span>
      </i>
    </div>
  )
}

export default Transcript
