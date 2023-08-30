import React, { useState, useEffect, useRef } from 'react'
import { emojisService } from '../services/emojis.service'
import { ReactComponent as GifIcon } from '../assets/imgs/gifIcon.svg'

export function Giphy({ onSelectGif }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchedGifs, setSearchedGifs] = useState([])
  const [trendingGifs, setTrendingGifs] = useState([])

  const gifsContainerRef = useRef(null)

  const isQueryNotEmpty = searchQuery.trim() !== ''

  const loadTrendingGifs = async () => {
    const gifs = await emojisService.fetchTrendingGiphy()
    setTrendingGifs(gifs)
  }

  useEffect(() => {
    if (isExpanded) {
      loadTrendingGifs()
    }
  }, [isExpanded])

  useEffect(() => {
    let debounceTimeout

    async function fetchGifs(value) {
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

  function handleSearchInputChange(e) {
    const { value } = e.target
    setSearchQuery(value)
  }

  function handleCloseExpanded() {
    setIsExpanded(false)
    setSearchQuery('')
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isExpanded &&
        gifsContainerRef.current &&
        !gifsContainerRef.current.contains(event.target)
      ) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Remove the event listener when the component is unmounted
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

  return (
    <div className="giphy-container">
      <div
        className={`giphy-icon ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded((prevState) => !prevState)}
      >
        <GifIcon className="gif-icon-svg" title="GIF" />
      </div>
      {isExpanded && (
        <div className="giphy-search-container" ref={gifsContainerRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="giphy-search-input"
            placeholder="Search for GIFs..."
          />
          {!isQueryNotEmpty && trendingGifs.length > 0 && (
            <div className="giphy-grid">
              {trendingGifs.map((gif) => (
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
          {isQueryNotEmpty && searchedGifs.length > 0 && (
            <div className="giphy-grid">
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
