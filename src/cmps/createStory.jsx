import React, { useRef, useState, useEffect } from 'react'
import { uploadImg } from '../services/upload-img.service'
import { CanvasColorPicker } from './CanvasColorPicker'
import { useDispatch } from 'react-redux'
import { addStoryToUser } from '../store/actions/user.actions'
import { FontFamily } from './FontFamily'
import { ColorPick } from './svgs/ColorPick'
import placeholderImg from '../assets/imgs/story-placeholder.png'
import { StoryLoader } from '../cmps/StoryLoader'
import { SelectArrows } from './svgs/SelectArrows'

export function CreateStory(props) {
  const [text, setText] = useState('')
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
  const textWidth = '20'
  const textColor = 'black'
  const textFontFamily = 'Arial'

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

    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = () => resolve(img)
        img.src = src
      })
    }

    const drawRoundedRect = (ctx, x, y, width, height, radius) => {
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      )
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
      ctx.stroke()
    }

    const drawEverything = async () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const img = await loadImage(imageUrl || placeholderImg)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      sentences.forEach((sentence, idx) => {
        ctx.font = `${sentence.width}px ${sentence.fontFamily}`
        ctx.fillStyle = sentence.color
        ctx.fillText(sentence.text, sentence.pos.x, sentence.pos.y)

        if (
          sentences.length > 0 &&
          idx === currentSentenceIdx &&
          sentence.text !== '' &&
          currentSentenceIdx !== -1
        ) {
          // console.log(sentences.length, 'the lengthhhhh')

          console.log(
            'Attempting to draw rectangle around text:',
            sentence.text
          )
          console.log(
            'Current Sentence Index from use effect:',
            currentSentenceIdx
          )
          // console.log('Sentences:', sentences)

          const textWidth = ctx.measureText(sentence.text).width
          const textHeight = parseInt(sentence.width, 10)
          ctx.strokeStyle = '#25D366'

          const padding = 10
          const roundedX = sentence.pos.x - padding
          const roundedY = sentence.pos.y - textHeight - padding
          const roundedWidth = textWidth + padding * 2
          const roundedHeight = textHeight + padding * 2

          // Radius for rounded corners
          const radius = 8
          ctx.lineWidth = 2

          drawRoundedRect(
            ctx,
            roundedX,
            roundedY,
            roundedWidth,
            roundedHeight,
            radius
          )
        }
      })
    }

    drawEverything()
  }, [
    imageUrl,
    sentences,
    currentSentenceIdx,
    textPos,
    textColor,
    textWidth,
    textFontFamily,
  ])

  function handleMouseDown(e) {
    if (sentences.length === 0 || sentences[currentSentenceIdx]?.text === '')
      return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let found = false;
    for (let i = 0; i < sentences.length; i++) {
      if (sentences[i]) {
        const sentence = sentences[i];
      
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
        found = true;
        return
      }
    }
    if (!found) {
      setCurrentSentenceIdx(-1);
    }
    console.log('Mouse down at position', { x, y })
    console.log("Debug: sentences array", sentences);
console.log("Debug: currentSentenceIdx", currentSentenceIdx);

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

  function handleShowColorModal(e) {
    setShowColorModal(!showColorModal)
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
    if (sentences.length === 0 && currentSentenceIdx !== -1) return
    setCurrentSentenceIdx((prevIdx) => {
      // console.log('Previous Index:', prevIdx, 'Array Length:', sentences.length);
      if (prevIdx + 1 < sentences.length) {
        // console.log('Current index after switching:', prevIdx + 1);
        return prevIdx + 1
      } else {
        // console.log('Current index after switching back to zero:', 0);
        return 0
      }
    })
  }

  //for debugging, remove later
  useEffect(() => {
    console.log('Updated currentSentenceIdx:', currentSentenceIdx)
  }, [currentSentenceIdx])

  function handleAddSentence() {
    if (sentences.length < 4) {
      console.log(sentences.length, 'from add sentence lenthgth')
      setSentences((prevSentences) => [
        ...prevSentences,
        {
          text: '',
          color: 'black',
          pos: { x: 50, y: 50 + prevSentences.length * 50 },
          width: '20',
          fontFamily: 'Arial',
        },
      ])

      setCurrentSentenceIdx((prevIdx) => prevIdx + 1)
      setText('')
    }
  }

  function handleTextChange(e) {
    if (currentSentenceIdx < 0 || !sentences[currentSentenceIdx]) return
    const updatedSentences = [...sentences]
    updatedSentences[currentSentenceIdx].text = e.target.value
    setSentences(updatedSentences)
  }

  function handlePropertySelect(property, value) {
    const updatedSentences = [...sentences]
    updatedSentences[currentSentenceIdx][property] = value
    setSentences(updatedSentences)
  }

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
            onSelectFontFamily={
              imageUrl
                ? (selectedFont) =>
                    handlePropertySelect('fontFamily', selectedFont)
                : null
            }
          />
          <button
            title='Add a new text'
            className='add-txt'
            onClick={handleAddSentence}
          >
            +
          </button>
          {/* <button
            title='Select text'
            className='select-txt'
            onClick={handleSwitchSentence}
          >
            <SelectArrows />
          </button>
          <p className='currTxt'>Text {currentSentenceIdx + 1}</p> */}
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
              onColorSelect={(selectedColor) =>
                handlePropertySelect('color', selectedColor)
              }
              onWidthSelect={(selectedWidth) =>
                handlePropertySelect('width', selectedWidth)
              }
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
