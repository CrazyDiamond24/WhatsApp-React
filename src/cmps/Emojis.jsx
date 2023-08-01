import React, { useState, useEffect } from 'react'
import { emojisService } from '../services/emojis.service'
import { uploadImg } from '../services/upload-img.service'
import { uploadVideo } from '../services/upload-video.service'
export function Emojis({ onSelectEmoji }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [emojisList, setEmojisList] = useState({})
  const [selectedCategory, setSelectedCategory] = useState('Smileys & Emotion')

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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
  }

  async function handelImg(ev) {
    console.log('hi')
    const file =
      ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
    try {
      // setIsUploading(true)
      const { url } = await uploadImg(file)
      console.log('url', url)
      // setEditedUser({ ...editedUser, img: url })
      // setFileChanged(true)
    } catch (err) {
      console.log('err', err)
    } finally {
      // setIsUploading(false)
    }
  }
  async function handleVideoFile(ev) {
    console.log('hi')
    const file =
      ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
    try {
      // setIsUploading(true)
      const { url } = await uploadVideo(file)
      console.log('url', url)
      // setEditedUser({ ...editedUser, video: url })
      // setFileChanged(true)
    } catch (err) {
      console.log('err', err)
    } finally {
      // setIsUploading(false)
    }
  }

  const excludedCategories = ['Component', 'Flags']

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

  // Function to map category names to their corresponding emojis
  const getCategoryEmoji = (categoryName) => {
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
      <div className="second-section">
        <label
          onDrop={(e) => {
            e.preventDefault()
            handelImg(e)
          }}
          onDragOver={(e) => {
            e.preventDefault()
          }}
          className="cover-img"
        >
          <input type="file" onChange={handelImg} className="hidden" />
        </label>
        📷
      </div>
      <div className="second-section">
        <label
          onDrop={(e) => {
            e.preventDefault()
            handleVideoFile(e)
          }}
          onDragOver={(e) => {
            e.preventDefault()
          }}
          className="cover-video"
        >
          <input type="file" onChange={handleVideoFile} className="hidden" />
        </label>
        🤖
      </div>
      <div
        className={`smiley ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded((prevState) => !prevState)}
        title="Emo"
      >
        😀
      </div>
      {isExpanded && (
        <div className="emojis-window">
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
