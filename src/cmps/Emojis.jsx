import React, { useState, useEffect } from 'react'
import { emojisService } from '../services/emojis.service'
import { uploadImg } from '../services/upload-img.service'
import { uploadVideo } from '../services/upload-video.service'
import { uploadFile } from '../services/upload-file.service'
import { setServerUrl } from '@giphy/js-fetch-api'
import { TakePicture } from './TakePicture'
export function Emojis({
  onSelectEmoji,
  onSelectImage,
  onSelectVideo,
  onSelectFile,
}) {
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

  function handleEmojiClick(emoji) {
    onSelectEmoji(emoji)
  }

  function handleCategoryClick(category) {
    setSelectedCategory(category)
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

  async function handleImg(ev) {
    const file =
      ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
    try {
      const { url } = await uploadImg(file)
      onSelectImage(url)
    } catch (err) {
      console.log('err', err)
    }
  }
  async function handleVideoFile(ev) {
    const file =
      ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
    try {
      const { url } = await uploadVideo(file)
      onSelectVideo(url)
    } catch (err) {
      console.log('err', err)
    }
  }
  async function handleFile(ev) {
    const file =
      ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
    try {
      const { url } = await uploadFile(file)
      onSelectFile(url)
    } catch (err) {
      console.log('err', err)
    }
  }

  return (
    <div className="emojis-container">
      {/* <TakePicture /> */}
      {/* <div className="second-section">
        <label
          onDrop={(e) => {
            e.preventDefault()
            handleImg(e)
          }}
          onDragOver={(e) => {
            e.preventDefault()
          }}
          className="cover-img"
        >
          <input type="file" onChange={handleImg} className="hidden" />
        </label>
        📷
      </div> */}
      {/* <div className="second-section">
        <label
          onDrop={(e) => {
            e.preventDefault()
            handleFile(e)
          }}
          onDragOver={(e) => {
            e.preventDefault()
          }}
          className="cover-img"
        >
          <input
            type="file"
            onChange={handleFile}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
            className="hidden"
          />
        </label>
        📃
      </div> */}
      {/* <div className="second-section">
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
      </div> */}
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
