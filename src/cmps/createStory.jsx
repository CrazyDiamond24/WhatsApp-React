import React, { useRef, useState, useEffect } from 'react'
import { uploadImg } from '../services/upload-img.service'
import { getSpotifySvg } from '../services/SVG.service'
import { CanvasColorPicker } from './CanvasColorPicker'
import { useDispatch, useSelector } from 'react-redux'
import { addStoryToUser } from '../store/actions/user.actions'
import { FontFamily } from './FontFamily'
import { ColorPick } from './svgs/ColorPick'
import placeholderImg from '../assets/imgs/story-placeholder.png'
import {StoryLoader} from '../cmps/StoryLoader'

export function CreateStory(props) {
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
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    let img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvasAspectRatio = canvas.width / canvas.height;
      const imageAspectRatio = img.width / img.height;
  
      let newWidth, newHeight;
  
      if (canvasAspectRatio > imageAspectRatio) {
        newWidth = canvas.width;
        newHeight = newWidth / imageAspectRatio;
      } else {
        newHeight = canvas.height;
        newWidth = newHeight * imageAspectRatio;
      }
  
      let xOffset = (canvas.width - newWidth) / 2;
      let yOffset = (canvas.height - newHeight) / 2;
  
      ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);
      ctx.font = `${textWidth}px ${textFontFamily}`;
      ctx.fillStyle = textColor;
      ctx.fillText(text, textPos.x, textPos.y);
    };
  
    if (imageUrl) {
      img.src = imageUrl;
    } else {
      img.src = placeholderImg;
      ctx.font = `${textWidth}px ${textFontFamily}`;
      ctx.fillStyle = textColor;
      ctx.fillText(text, textPos.x, textPos.y);
    }
  }, [imageUrl, text, textPos, textColor, textWidth, textFontFamily]);
  

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
    setIsLoading(true) // Start loading
    const file =
      ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
    try {
      const { url } = await uploadImg(file)
      setImageUrl(url)
    } catch (err) {
      console.log('err', err)
    }
    setIsLoading(false) // End loading
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
    console.log("addToStory called - Start");
    console.log("imageUrl:", imageUrl);
    console.log("text:", text);
  
    if (!imageUrl && !text) {
      console.log("addToStory - No Image or Text");
      return;
    }
    const canvasUrl = canvasRef.current.toDataURL('image/png');
    console.log("addToStory - Canvas URL:", canvasUrl);
    dispatch(addStoryToUser(canvasUrl));
    console.log("addToStory - Dispatched action");
    handleClose(); // Call the handleClose function here
    console.log("addToStory - End");
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
    console.log("handleClose called - Start");
    console.log("props.onClose:", props.onClose);
    props.onClose();
    console.log("handleClose called - End");
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
          value={text}
          onChange={handleTextChange}
        />

<div className='edit-controls-container' style={{ pointerEvents: imageUrl ? 'auto' : 'none' }}>
  <span
    onClick={imageUrl ? handleShowColorModal : null}
    role='img'
    aria-label='color-picker'
  >
    <ColorPick className='color-pick-icon' />
  </span>
  <FontFamily onSelectFontFamily={imageUrl ? handleFontFamilySelect : null} />
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
