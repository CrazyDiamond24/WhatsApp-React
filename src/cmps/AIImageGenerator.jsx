import React, { useState } from 'react'
import { generateImageFromText } from '../services/ai-image.service'
import { useDispatch } from 'react-redux'
import { getSpotifySvg } from '../services/SVG.service'

export default function AIImageGenerator({ closeAiModal, onImageGenerated }) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      console.log('hi')
      const url = await generateImageFromText(prompt)
      console.log('url', url)
      onImageGenerated(url)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      closeAiModal()
    }
  }

  return (
    <div className="ai-modal-back-drop">
      <div className="ai-modal">
        <button className="close-ai-modal">
          {' '}
          <span
            onClick={closeAiModal}
            dangerouslySetInnerHTML={{
              __html: getSpotifySvg('x'),
            }}
          ></span>
        </button>
        <form onSubmit={handleSubmit}>
          <h1 className="openai">Generate AI Image</h1>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter description..."
          />
          <button className="btn-generate" type="submit">
            <span>Generate image</span>
          </button>
        </form>
        {loading && <span className="ai-loader"></span>}
      </div>
    </div>
  )
}
