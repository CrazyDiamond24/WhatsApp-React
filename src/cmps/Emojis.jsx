import React, { useState, useEffect } from 'react'
import { emojisService } from '../services/emojis.service'

export function Emojis({ onSelectEmoji }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [emojisList, setEmojisList] = useState([])

  useEffect(() => {
    const loadEmojis = async () => {
      const emojis = await emojisService.fetchEmojis()
      console.log('emojis', emojis)
      setEmojisList(emojis)
    }
    loadEmojis()
  }, [])

  const handleEmojiClick = (emoji) => {
    onSelectEmoji(emoji)
  }

  return (
    <div className="emojis-container">
      <div
        className={`smiley ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded((prevState) => !prevState)}
      >
        😀
      </div>
      {isExpanded && (
        <div className="emojis-window">
          {emojisList?.map((emoji, index) => (
            <span
              key={index}
              className="emoji"
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
