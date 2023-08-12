import React, { useRef, useState, useEffect } from 'react'
import { uploadImg } from '../services/upload-img.service'
import { getSpotifySvg } from '../services/SVG.service'
import { CanvasColorPicker } from './CanvasColorPicker'
import { useDispatch, useSelector } from 'react-redux'
import { addStoryToUser } from '../store/actions/user.actions'
import { FontFamily } from './FontFamily'
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
  const dispatch = useDispatch()
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (imageUrl) {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
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

  function handleShowColorModal() {
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

  return (
    <div className="create-story">
      <span
        onClick={handleShowColorModal}
        dangerouslySetInnerHTML={{
          __html: getSpotifySvg('plusWhatsapp'),
        }}
      ></span>
      <h1>Create Story</h1>
      <input
        placeholder="choose file"
        type="file"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input type="text" value={text} onChange={handleTextChange} />
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
      {showColorModal && (
        <CanvasColorPicker
          onColorSelect={handleColorSelect}
          onWidthSelect={handleWidthSelect}
          show={true}
          important={false}
        />
      )}
      <FontFamily onSelectFontFamily={handleFontFamilySelect} />
      <span
        dangerouslySetInnerHTML={{
          __html: getSpotifySvg('plusWhatsapp'),
        }}
      ></span>

      <button onClick={addToStory}>add to story</button>
    </div>
  )
}
