import React, { useState, useEffect } from 'react'
import { emojisService } from '../services/emojis.service'

export function Emojis({ onSelectEmoji }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [emojisList, setEmojisList] = useState({})

  useEffect(() => {
    const loadEmojis = async () => {
      const emojis = await emojisService.fetchEmojis()
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
        title='Emo'
      >
        😀
      </div>
      {isExpanded && (
        <div className="emojis-window">
          {Object.entries(emojisList).map(([category, emojis]) => (
            <div key={category}>
              <h3>{category}</h3>
              {emojis?.map((emoji, index) => (
                <span
                  key={index}
                  className="emoji"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
