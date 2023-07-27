import React, { useState, useEffect } from 'react'
import { emojisService } from '../services/emojis.service'

export function Giphy({ onSelectGif }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchedGifs, setSearchedGifs] = useState([])

  const handleSearchInputChange = (e) => {
    const { value } = e.target
    setSearchQuery(value)
  }

  const handleCloseExpanded = () => {
    setIsExpanded(false)
    setSearchQuery('')
  }

  const isQueryNotEmpty = searchQuery.trim() !== ''

  useEffect(() => {
    let debounceTimeout

    const fetchGifs = async (value) => {
      if (value.trim() !== '') {
        const gifs = await emojisService.fetchGiphy(value)
        setSearchedGifs(gifs)
      } else {
        setSearchedGifs([])
      }
    }

    if (isQueryNotEmpty) {
    
      debounceTimeout = setTimeout(() => {
        fetchGifs(searchQuery)
      }, 500)
    } else {
      setSearchedGifs([])
    }

    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
    }
  }, [searchQuery, isQueryNotEmpty])

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
            className='giphy-search-input'
            placeholder='Search for GIFs...'
          />
          {isQueryNotEmpty && searchedGifs.length > 0 && (
            <div className='giphy-grid'>
              {searchedGifs.map((gif) => (
                <img
                  key={gif.id}
                  src={gif.images.fixed_height.url}
                  alt={gif.title}
                  onClick={() => {
                    onSelectGif(gif.images.downsized.url)
                    handleCloseExpanded()
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


