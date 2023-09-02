import React, { useState, useEffect, useRef } from 'react'
import { emojisService } from '../services/emojis.service'
import { ReactComponent as EmojiIcon } from '../assets/imgs/emojiIcon.svg'

export function Emojis({ onSelectEmoji }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [emojisList, setEmojisList] = useState({})
  const [selectedCategory, setSelectedCategory] = useState('Smileys & Emotion')

  const excludedCategories = ['Component', 'Flags']

  const emojisContainerRef = useRef(null)

  const brokenEmojis = [
    '🫨',
    '🩷',
    '🩶',
    '🩵',
    '🪮',
    '🪭',
    '🫸',
    '🫷',
    '🪻',
    '🪼',
    '🪽',
    '🪿',
    '🫎',
    '🫏',
    '🫛',
    '🫚',
    '🪯',
    '🛜',
    '☺️',
    '❤️‍🩹',
  ]

  useEffect(() => {
    const loadEmojis = async () => {
      const emojis = await emojisService.fetchEmojis()
      setEmojisList(emojis)
    }
    loadEmojis()
  }, [])

  function handleEmojiClick(emoji) {
    onSelectEmoji(emoji)
  }

  function handleCategoryClick(category) {
    setSelectedCategory(category)
  }

  function getCategoryEmoji(categoryName) {
    switch (categoryName) {
      case 'Animals & Nature':
        return '🌷'
      case 'People & Body':
        return '🤵‍♀️'
      case 'Smileys & Emotion':
        return '🙂'
      case 'Objects':
        return '💡'
      case 'Food & Drink':
        return '🍔'
      case 'Travel & Places':
        return '🚗'
      case 'Activities':
        return '🏀'
      case 'Symbols':
        return '🔠'

      default:
        return '📁'
    }
  }

  return (
    <div className="emojis-container">
      <div
        className={`smiley ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded((prevState) => !prevState)}
        title="Emojis"
      >
        <EmojiIcon className="emoji-icon-svg" />
      </div>
      {isExpanded && (
        <div className="emojis-window" ref={emojisContainerRef}>
          {Object.entries(emojisList).map(([category, emojis]) => {
            if (excludedCategories.includes(category)) {
              return null
            }

            const filteredEmojis = emojis
              .filter((emoji) => !brokenEmojis.includes(emoji))
              .reverse()

            const gridClass =
              category === 'Animals & Nature' || category === 'People & Body'
                ? 'emoji-grid six-columns'
                : 'emoji-grid seven-columns'

            return (
              <div className="category-wrapper" title={category} key={category}>
                <div
                  className={`emoji-category ${
                    category === selectedCategory ? 'selected' : ''
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {getCategoryEmoji(category)}
                </div>

                <div
                  className={`emoji-grid ${
                    category === selectedCategory ? 'visible' : ''
                  } ${gridClass}`}
                >
                  {filteredEmojis.map((emoji, index) => (
                    <span
                      key={index}
                      className="emoji"
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
