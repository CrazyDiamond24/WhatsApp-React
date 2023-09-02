import React, { useState } from 'react'
import axios from 'axios'

export function BackGround() {
  const [imageUrl, setImageUrl] = useState('')
  const [resultUrl, setResultUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleRemoveBackground = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(
        'https://api.deepai.org/api/deepmask',
        {
          image: imageUrl,
        },
        {
          headers: {
            'Api-Key': 'fa889d0d-13eb-4c5b-a103-ba51ecfe1f85', // replace with your API key
          },
        }
      )

      if (response.data && response.data.output_url) {
        setResultUrl(response.data.output_url)
      } else {
        setError('Failed to get the processed image.')
      }
    } catch (err) {
      setError(err.message || 'An error occurred.')
    }
    setLoading(false)
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button onClick={handleRemoveBackground}>Remove Background</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {resultUrl && (
        <div>
          <h3>Result</h3>
          <img src={resultUrl} alt="Processed" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  )
}

// export default BackgroundRemover;
