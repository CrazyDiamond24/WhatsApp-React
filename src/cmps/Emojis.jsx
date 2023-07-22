import React, { useState } from 'react' 

const emojisList = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '😂',
  '🤣',
  '😊',
  '😇',
  '😍',
  '🥰',
  '😋',
  '😛',
  '😎',
  '😜',
  '🤗',
]

export function Emojis({onSelectEmoji}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleEmojiClick = (emoji) => {
    onSelectEmoji(emoji)
  }

  return (
    <div className='emojis-container'>
      <div
        className={`smiley ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded((prevState) => !prevState)}
      >
        😀
      </div>
      {isExpanded && (
        <div className='emojis-window'>
          {emojisList.map((emoji, index) => (
            <span
              key={index}
              className='emoji'
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

