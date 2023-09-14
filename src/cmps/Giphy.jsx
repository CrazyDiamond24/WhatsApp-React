import React, { useState, useEffect } from 'react'
import { emojisService } from '../services/emojis.service'
import { ReactComponent as GifIcon } from '../assets/imgs/gifIcon.svg'

export function Giphy({ onSelectGif }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchedGifs, setSearchedGifs] = useState([])
  const [trendingGifs, setTrendingGifs] = useState([])

  const isQueryNotEmpty = searchQuery.trim() !== ''

  const loadTrendingGifs = async () => {
    const gifs = await emojisService.fetchTrendingGiphy()

    const uniqueGifs = gifs.reduce((acc, current) => {
      const x = acc.find((item) => item.id === current.id)
      if (!x) {
        return acc.concat([current])
      } else {
        return acc
      }
    }, [])

    setTrendingGifs(uniqueGifs)
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

        const uniqueGifs = gifs.reduce((acc, current) => {
          const x = acc.find((item) => item.id === current.id)
          if (!x) {
            return acc.concat([current])
          } else {
            return acc
          }
        }, [])

        setSearchedGifs(uniqueGifs)
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

  return (
    <div className='giphy-container'>
      <div
        className={`giphy-icon ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded((prevState) => !prevState)}
      >
        <GifIcon className='gif-icon-svg' title='GIF' />
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
          {!isQueryNotEmpty && trendingGifs.length > 0 && (
            <div className='giphy-grid'>
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
