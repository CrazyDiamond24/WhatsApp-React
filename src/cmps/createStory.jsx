import React, { useRef, useState, useEffect } from 'react'
import { uploadImg } from '../services/upload-img.service'
import { getSpotifySvg } from '../services/SVG.service'
import { CanvasColorPicker } from './CanvasColorPicker'
import { useDispatch, useSelector } from 'react-redux'
import { addStoryToUser } from '../store/actions/user.actions'
import { FontFamily } from './FontFamily'
import { ColorPick } from './svgs/ColorPick'

export function CreateStory() {
  const [imageUrl, setImageUrl] = useState(null)
  const [text, setText] = useState('')
  const [textColor, setTextColor] = useState('black')
  const [textWidth, setTextWidth] = useState('20')
  const [textFontFamily, setTextFontFamily] = useState('Arial')

  const [textPos, setTextPos] = useState({ x: 50, y: 50 })
  const [showColorModal, setShowColorModal] = useState(false)
  const [dragging, setDragging] = useState(false)
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)
  const canvasRef = useRef(null)
  const colorModalRef = useRef(null)

  const dispatch = useDispatch()
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (imageUrl) {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        let aspectRatio = img.width / img.height
        let newWidth = canvas.width
        let newHeight = newWidth / aspectRatio
    
        if (newHeight > canvas.height) {
          newHeight = canvas.height
          newWidth = newHeight * aspectRatio
        }
    
        let xOffset = (canvas.width - newWidth) / 2
        let yOffset = (canvas.height - newHeight) / 2
    
        ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight)
        ctx.font = `${textWidth}px ${textFontFamily}`
        ctx.fillStyle = textColor
        ctx.fillText(text, textPos.x, textPos.y)
      }
      img.src = imageUrl
    
    } else {
      ctx.font = `${textWidth}px ${textFontFamily}`
      ctx.fillStyle = textColor
      ctx.fillText(text, textPos.x, textPos.y)
    }
  }, [imageUrl, text, textPos, textColor, textWidth, textFontFamily])

  function handleMouseDown(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const textWidth = canvasRef.current.getContext('2d').measureText(text).width
    if (
      y >= textPos.y - 20 &&
      y <= textPos.y &&
      x >= textPos.x &&
      x <= textPos.x + textWidth
    ) {
      setDragging(true)
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
      setTextPos({ x: newX, y: newY })
    }
  }

  async function handleImageUpload(ev) {
    const file =
      ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
    try {
      const { url } = await uploadImg(file)
      setImageUrl(url)
    } catch (err) {
      console.log('err', err)
    }
  }

  function handleTextChange(e) {
    setText(e.target.value)
  }

  function handleShowColorModal(e) {
    console.log('handleShowColorModal called', showColorModal) // Add this line
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
    if (!imageUrl || !text) {
      return
    }
    const canvasUrl = canvasRef.current.toDataURL('image/png')
    dispatch(addStoryToUser(canvasUrl))
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

  return (
    <div className='create-story'>
      <h1>Create Story</h1>
      <input
        placeholder='choose file'
        type='file'
        onChange={handleImageUpload}
        className='hidden'
      />
      <input type='text' value={text} onChange={handleTextChange} />
      <div className='edit-controls-container'>
        <span
          onClick={handleShowColorModal}
          role='img'
          aria-label='color-picker'
        >
          <ColorPick className='color-pick-icon' />
        </span>
        <FontFamily onSelectFontFamily={handleFontFamilySelect} />
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

      <button onClick={addToStory}>Add to Story</button>
    </div>
  )
}
