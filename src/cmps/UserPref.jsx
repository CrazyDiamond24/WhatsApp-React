import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUserPref } from '../store/actions/user.actions'
import { CanvasColorPicker } from './CanvasColorPicker'
import { FontFamily } from './FontFamily'
import { ImagePicker } from './ImagePicker'

export function UserPref({ closePrefModal }) {
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)
  const [editedUser, setEditedUser] = useState({ ...user })
  const [showFontColorPicker, setShowFontColorPicker] = useState(false)
  const [showBannerColorPicker, setShowBannerColorPicker] = useState(false)

  const fontColorPickerRef = useRef(null)
  const bannerColorPickerRef = useRef(null)
  const dispatch = useDispatch()

  function handleClickOutside(event) {
    if (
      fontColorPickerRef.current &&
      !fontColorPickerRef.current.contains(event.target)
    ) {
      setShowFontColorPicker(false)
    }
    if (
      bannerColorPickerRef.current &&
      !bannerColorPickerRef.current.contains(event.target)
    ) {
      setShowBannerColorPicker(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // function handleColorSelect(color, colorType) {
  //   if (colorType === "fontColor") {
  //     setEditedUser({
  //       ...editedUser,
  //       userPref: {
  //         ...editedUser.userPref,
  //         fontColor: color,
  //       },
  //     })
  //   } else if (colorType === "headerBgColor") {
  //     setEditedUser({
  //       ...editedUser,
  //       userPref: {
  //         ...editedUser.userPref,
  //         headerBgColor: color,
  //       },
  //     })
  //   }
  // }
  function handleColorSelect(color, colorType) {
    const type = {
      fontColor: 'fontColor',
      headerBgColor: 'headerBgColor',
    }

    if (type[colorType]) {
      setEditedUser({
        ...editedUser,
        userPref: {
          ...editedUser.userPref,
          [type[colorType]]: color,
        },
      })
    }
  }

  // function handleWidthSelect(width) {
  //   setEditedUser({
  //     ...editedUser,
  //     userPref: {
  //       ...editedUser.userPref,
  //       fontSize: width,
  //     },
  //   })
  // }

  // function handleFontFamilySelect(fontFamily) {
  //   setEditedUser({
  //     ...editedUser,
  //     userPref: {
  //       ...editedUser.userPref,
  //       fontFamily: fontFamily,
  //     },
  //   })
  // }

  // function handleImageSelect(image) {
  //   setEditedUser({
  //     ...editedUser,
  //     userPref: {
  //       ...editedUser.userPref,
  //       backgroundImage: image,
  //     },
  //   })
  // }

  function handleSelect(property, value) {
    setEditedUser({
      ...editedUser,
      userPref: {
        ...editedUser.userPref,
        [property]: value,
      },
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    dispatch(updateUserPref(editedUser))
    closePrefModal()
  }

  return (
    <section className="user-pref">
      <button title="Close" className="close-button" onClick={closePrefModal}>
        X
      </button>
      <form onSubmit={handleSubmit}>
        <div ref={fontColorPickerRef}>
          {showFontColorPicker && (
            <CanvasColorPicker
              onColorSelect={(color) => handleColorSelect(color, 'fontColor')}
              onWidthSelect={(width) => handleSelect('fontSize', width)}
              show={true}
              important={false}
            />
          )}
        </div>

        <FontFamily
          className="font-family-pick"
          onSelectFontFamily={(fontFamily) =>
            handleSelect('fontFamily', fontFamily)
          }
          initialShowDropdown={true}
        />

        <ImagePicker
          onSelectImage={(image) => handleSelect('backgroundImage', image)}
        />

        <label className="selected-font">
          Select Font Size & Color:
          <span
            title="Change font color"
            onClick={() => setShowFontColorPicker(!showFontColorPicker)}
            style={{
              backgroundColor: editedUser.userPref?.fontColor,
              display: 'inline-block',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
          ></span>
          <span
            onClick={() => setShowFontColorPicker(!showFontColorPicker)}
            title="Change font size"
            className="font-size-num"
          >
            {editedUser.userPref?.fontSize}
          </span>
        </label>

        <label className="banner-color">
          Banner Color:
          <div ref={bannerColorPickerRef}>
            {showBannerColorPicker && (
              <CanvasColorPicker
                className="color-picker-userpref"
                onColorSelect={(color) =>
                  handleColorSelect(color, 'headerBgColor')
                }
                important={true}
              />
            )}
          </div>
          <span
            title="Change banner color"
            onClick={() => setShowBannerColorPicker(!showBannerColorPicker)}
            style={{
              backgroundColor: editedUser.userPref?.headerBgColor,
              display: 'inline-block',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              cursor: 'pointer',
              marginLeft: '87.6px',
            }}
          ></span>
        </label>

        <button type="submit">Apply</button>
      </form>
    </section>
  )
}
