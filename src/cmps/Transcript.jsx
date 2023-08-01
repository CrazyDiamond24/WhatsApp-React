import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getSpotifySvg } from '../services/SVG.service'
// import { addAudioNote } from '../store/actions/note.actions'

function Transcript() {
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const dispatch = useDispatch()

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorderRef.current = new MediaRecorder(stream)

    mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
      audioChunksRef.current.push(event.data)
    })

    mediaRecorderRef.current.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunksRef.current)
      const audioUrl = URL.createObjectURL(audioBlob)
      setAudioUrl(audioUrl)
      console.log('audioUrl', audioUrl)
      // dispatch(addAudioNote(audioUrl))
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
