import React, { useState } from 'react' // Remember to import useState
import { convertTextToSpeech } from '../services/text-to-speech.service'

export function VoiceModal({ onSelectAudio, msg, closeModal }) {
  // Assuming onSelectAudio and msgText are props

  const [voice, setVoice] = useState('CYw3kZ02Hs0563khs1Fj')
  const voices = [
    { voice_id: 'CYw3kZ02Hs0563khs1Fj', name: 'Dave' },
    { voice_id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
    { voice_id: '2EiwWnXFnvU5JabPnv8n', name: 'Clyde' },
    { voice_id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi' },
  ]
  async function onSendAudio() {
    try {
      closeModal()
      const url = await convertTextToSpeech(msg, voice)
      console.log('url', url)
      onSelectAudio(url.file)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="voice-modal-backdrop">
      <div className="voice-modal-container">
        <button className="close-modal-btn" onClick={closeModal}>
          X
        </button>
        <h1>Choose Voice</h1>
        <select
          className="voice-selector"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
        >
          {voices.map((voice) => (
            <option key={voice.voice_id} value={voice.voice_id}>
              {voice.name}
            </option>
          ))}
        </select>
        <button className="send-msg-btn" onClick={onSendAudio}>
          send the msg
        </button>
      </div>
    </div>
  )
}
