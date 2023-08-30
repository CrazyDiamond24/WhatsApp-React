import React, { useRef, useState, useEffect } from 'react'
import { uploadImg } from '../services/upload-img.service'
import { CanvasColorPicker } from './CanvasColorPicker'
import { useDispatch } from 'react-redux'
import { addStoryToUser } from '../store/actions/user.actions'
import { FontFamily } from './FontFamily'
import { ColorPick } from './svgs/ColorPick'
import placeholderImg from '../assets/imgs/story-placeholder.png'
import { StoryLoader } from '../cmps/StoryLoader'

export function CreateStory(props) {
  const [text, setText] = useState('')
  const [textWidth, setTextWidth] = useState('20')
  const [textColor, setTextColor] = useState('black')
  const [textFontFamily, setTextFontFamily] = useState('Arial')
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0)
  const [imageUrl, setImageUrl] = useState(null)
  const [showColorModal, setShowColorModal] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sentences, setSentences] = useState([
    {
      text: '',
      color: 'black',
      pos: { x: 50, y: 50 },
      width: '20',
      fontFamily: 'Arial',
    },
  ])

  const dispatch = useDispatch()
  const canvasRef = useRef(null)
  const colorModalRef = useRef(null)
  const textPos = { x: 50, y: 50 }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvasAspectRatio = canvas.width / canvas.height
      const imageAspectRatio = img.width / img.height

      let newWidth, newHeight

      if (canvasAspectRatio > imageAspectRatio) {
        newWidth = canvas.width
        newHeight = newWidth / imageAspectRatio
      } else {
        newHeight = canvas.height
        newWidth = newHeight * imageAspectRatio
      }

      let xOffset = (canvas.width - newWidth) / 2
      let yOffset = (canvas.height - newHeight) / 2

      ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight)
      ctx.font = `${textWidth}px ${textFontFamily}`
      ctx.fillStyle = textColor
      ctx.fillText(text, textPos.x, textPos.y)
    }

    if (imageUrl) {
      img.src = imageUrl
    } else {
      img.src = placeholderImg
      ctx.font = `${textWidth}px ${textFontFamily}`
      ctx.fillStyle = textColor
      ctx.fillText(text, textPos.x, textPos.y)
    }
  }, [imageUrl, text, textPos, textColor, textWidth, textFontFamily])
  
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (imageUrl) {
      let img = new Image()
      img.crossOrigin = 'Anonymous'

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        sentences.forEach((sentence) => {
          ctx.font = `${sentence.width}px ${sentence.fontFamily}`
          ctx.fillStyle = sentence.color
          ctx.fillText(sentence.text, sentence.pos.x, sentence.pos.y)
        })
      }

      img.src = imageUrl
    } else {
      sentences.forEach((sentence) => {
        ctx.font = `${sentence.width}px ${sentence.fontFamily}`
        ctx.fillStyle = sentence.color
        ctx.fillText(sentence.text, sentence.pos.x, sentence.pos.y)
      })
    }
  }, [imageUrl, sentences])

  function handleMouseDown(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i]
      const textWidth = canvasRef.current
        .getContext('2d')
        .measureText(sentence.text).width
      if (
        y >= sentence.pos.y - parseInt(sentence.width, 10) &&
        y <= sentence.pos.y &&
        x >= sentence.pos.x &&
        x <= sentence.pos.x + textWidth
      ) {
        setDragging(true)
        setCurrentSentenceIdx(i)
        return
      }
    }
  }
  function handleMouseUp() {
    setDragging(false)
  }

  function handleMouseMove(e) {
    if (dragging) {
      const rect = canvasRef.current.getBoundingClientRect()
      const newX = e.clientX - rect.left
      const newY = e.clientY - rect.top + 20
      const updatedSentences = [...sentences]
      updatedSentences[currentSentenceIdx].pos = { x: newX, y: newY }
      setSentences(updatedSentences)
    }
  }

  async function handleImageUpload(ev) {
    setIsLoading(true)
    const file =
      ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
    try {
      const { url } = await uploadImg(file)
      setImageUrl(url)
    } catch (err) {
      console.log('err', err)
    }
    setIsLoading(false)
  }

  function handleTextChange(e) {
    setText(e.target.value)
  }

  function handleShowColorModal(e) {
    setShowColorModal(!showColorModal)
  }

  function handleColorSelect(color) {
    setTextColor(color)
  }

  function handleWidthSelect(width) {
    setTextWidth(width)
  }

  function handleFontFamilySelect(font) {
    setTextFontFamily(font)
  }

  function addToStory() {
    if (!imageUrl && !text) {
      return
    }
    const canvasUrl = canvasRef.current.toDataURL('image/png')

    dispatch(addStoryToUser(canvasUrl))

    handleClose()
  }

  function handleSwitchSentence() {
    if (currentSentenceIdx + 1 < sentences.length) {
      setCurrentSentenceIdx(currentSentenceIdx + 1)
    } else {
      setCurrentSentenceIdx(0)
    }
  }

  function handleAddSentence() {
    if (sentences.length < 4) {
      setSentences([
        ...sentences,
        {
          text: '',
          color: 'black',
          pos: { x: 50, y: 50 + sentences.length * 50 },
          width: '20',
          fontFamily: 'Arial',
        },
      ])
      setCurrentSentenceIdx(sentences.length)
      setText('')
    }
  }

  function handleTextChange(e) {
    const updatedSentences = [...sentences]
    updatedSentences[currentSentenceIdx].text = e.target.value
    setSentences(updatedSentences)
  }

  function handleColorSelect(color) {
    const updatedSentences = [...sentences]
    updatedSentences[currentSentenceIdx].color = color
    setSentences(updatedSentences)
  }

  function handleWidthSelect(width) {
    const updatedSentences = [...sentences]
    updatedSentences[currentSentenceIdx].width = width
    setSentences(updatedSentences)
  }

  function handleFontFamilySelect(font) {
    const updatedSentences = [...sentences]
    updatedSentences[currentSentenceIdx].fontFamily = font
    setSentences(updatedSentences)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        colorModalRef.current &&
        !colorModalRef.current.contains(event.target)
      ) {
        setShowColorModal(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  function handleClose() {
    props.onClose()
  }

  return (
    <>
      <div className='overlay'></div>

      <div className='create-story'>
        {isLoading && <StoryLoader />}
        <button title='Close' className='close-button' onClick={handleClose}>
          X
        </button>
        <input
          placeholder='choose file'
          type='file'
          title='Upload image'
          onChange={handleImageUpload}
          className={imageUrl ? 'hidden' : 'story-file-upload'}
        />

        <input
          placeholder='Add text'
          type='text'
          value={sentences[currentSentenceIdx]?.text || ''}
          onChange={handleTextChange}
        />

        <div
          className='edit-controls-container'
          style={{
            pointerEvents: imageUrl ? 'auto' : 'none',
            cursor: imageUrl ? 'auto' : 'not-allowed',
          }}
        >
          <span
            onClick={imageUrl ? handleShowColorModal : null}
            role='img'
            aria-label='color-picker'
          >
            <ColorPick className='color-pick-icon' />
          </span>
          <FontFamily
            onSelectFontFamily={imageUrl ? handleFontFamilySelect : null}
          />
          <button onClick={handleAddSentence}>+</button>
          <button onClick={handleSwitchSentence}>
            ↓↑ {currentSentenceIdx + 1}
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={270}
          height={480}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
        {showColorModal && (
          <div ref={colorModalRef}>
            <CanvasColorPicker
              onColorSelect={handleColorSelect}
              onWidthSelect={handleWidthSelect}
              show={true}
              important={false}
            />
          </div>
        )}

        <button className='add-story-button' onClick={addToStory}>
          Add to Story
        </button>
      </div>
    </>
  )
}
