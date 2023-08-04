import React, { useState } from 'react'
import { CanvasColorPicker } from './CanvasColorPicker'
import { FontFamily } from './FontFamily'
import { ImagePicker } from './ImagePicker'
import { useDispatch } from 'react-redux'
import { updateUserPref } from '../store/actions/user.actions'
export function UserPref() {
  const [userPrefs, setUserPrefs] = useState({
    fontSize: 16,
    fontColor: '#000000',
    headerBgColor: '#ffffff',
    fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
    backgroundImage: null,
  })
  const dispatch = useDispatch()
  function handleColorSelect(color, colorType) {
    if (colorType === 'fontColor') {
      setUserPrefs({
        ...userPrefs,
        fontColor: color,
      })
    } else if (colorType === 'headerBgColor') {
      setUserPrefs({
        ...userPrefs,
        headerBgColor: color,
      })
    }
  }

  function handleWidthSelect(width) {
    setUserPrefs({
      ...userPrefs,
      fontSize: width,
    })
  }

  function handleFontFamilySelect(fontFamily) {
    setUserPrefs({
      ...userPrefs,
      fontFamily: fontFamily,
    })
  }

  function handleImageSelect(image) {
    setUserPrefs({
      ...userPrefs,
      backgroundImage: image,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    dispatch(updateUserPref(userPrefs))
    console.log(userPrefs)
  }

  return (
    <section className="user-pref">
      <form onSubmit={handleSubmit}>
        <CanvasColorPicker
          onColorSelect={(color) => handleColorSelect(color, 'fontColor')}
          onWidthSelect={handleWidthSelect}
          show={true}
          important={false}
        />
        <FontFamily onSelectFontFamily={handleFontFamilySelect} />
        <ImagePicker onSelectImage={handleImageSelect} />
        <label>Current Font Size: {userPrefs.fontSize}</label>
        <label>
          Current Font Color:
          <span
            style={{
              backgroundColor: userPrefs.fontColor,
              display: 'inline-block',
              width: '20px',
              height: '20px',
            }}
          ></span>
        </label>
        <label>
          Header Background Color:
          <CanvasColorPicker
            onColorSelect={(color) => handleColorSelect(color, 'headerBgColor')}
            show={false}
            important={true}
          />
        </label>
        <button type="submit">Apply</button>
      </form>
    </section>
  )
}
