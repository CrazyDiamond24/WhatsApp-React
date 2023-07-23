import React, { useState } from 'react'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Grid } from '@giphy/react-components'

const giphyFetch = new GiphyFetch('KRJj7rArYYq9avub9yRoWar6P2SvYhje')

export function GIPHY({ onSelectGif }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchedGifs, setSearchedGifs] = useState([])

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value)
    if (e.target.value.trim() !== '') {
      // Fetch gifs based on the search query
      giphyFetch
        .search(e.target.value, { limit: 5 })
        .then((gifs) => setSearchedGifs(gifs.data))
        .catch((error) => console.error('Error searching GIFs:', error))
    } else {
      setSearchedGifs([])
    }
  }

  return (
    <div className='giphy-container'>
      <div
        className={`giphy-icon ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded((prevState) => !prevState)}
      >
        🎬
      </div>
      {isExpanded && (
        <div className='giphy-search-container'>
          <input
            type='text'
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder='Search for GIFs...'
          />
          <div className='giphy-grid'>
            {searchedGifs.map((gif) => (
              <img
                key={gif.id}
                src={gif.images.fixed_height.url}
                alt={gif.title}
                onClick={() => {
                  onSelectGif(gif , gif.images.downsized.url)
                  setIsExpanded(false)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
