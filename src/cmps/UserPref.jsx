import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUserPref } from '../store/actions/user.actions'
import { CanvasColorPicker } from './CanvasColorPicker'
import { FontFamily } from './FontFamily'
import { ImagePicker } from './ImagePicker'

export function UserPref({ closePrefModal }) {
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)
  const [editedUser, setEditedUser] = useState({ ...user })
  const dispatch = useDispatch()

  function handleColorSelect(color, colorType) {
    if (colorType === 'fontColor') {
      setEditedUser({
        ...editedUser,
        userPref: {
          ...editedUser.userPref,
          fontColor: color,
        },
      })
    } else if (colorType === 'headerBgColor') {
      setEditedUser({
        ...editedUser,
        userPref: {
          ...editedUser.userPref,
          headerBgColor: color,
        },
      })
    }
  }

  function handleWidthSelect(width) {
    setEditedUser({
      ...editedUser,
      userPref: {
        ...editedUser.userPref,
        fontSize: width,
      },
    })
  }

  function handleFontFamilySelect(fontFamily) {
    setEditedUser({
      ...editedUser,
      userPref: {
        ...editedUser.userPref,
        fontFamily: fontFamily,
      },
    })
  }

  function handleImageSelect(image) {
    setEditedUser({
      ...editedUser,
      userPref: {
        ...editedUser.userPref,
        backgroundImage: image,
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
      <form onSubmit={handleSubmit}>
        <CanvasColorPicker
          onColorSelect={(color) => handleColorSelect(color, 'fontColor')}
          onWidthSelect={handleWidthSelect}
          show={true}
          important={false}
        />
        <FontFamily onSelectFontFamily={handleFontFamilySelect} />
        <ImagePicker onSelectImage={handleImageSelect} />
        <label>Current Font Size: {editedUser.userPref.fontSize}</label>
        <label>
          Current Font Color:
          <span
            style={{
              backgroundColor: editedUser.userPref.fontColor,
              display: 'inline-block',
              width: '20px',
              height: '20px',
            }}
          ></span>
        </label>
        <label>
          Header Background Color:
          {/* <CanvasColorPicker
            onColorSelect={(color) => handleColorSelect(color, 'headerBgColor')}
            show={false}
            important={true}
          /> */}
        </label>
        <button type="submit">Apply</button>
      </form>
    </section>
  )
}
