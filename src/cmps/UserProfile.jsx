import React, { useEffect, useState, useRef } from 'react'

import emptyImg from '../../src/assets/imgs/empty-img.png'
import { uploadImg } from '../services/upload-img.service'
import { useDispatch, useSelector } from 'react-redux'
import { editUserProfile } from '../store/actions/user.actions'
import { CreateStory } from './createStory'
import { StoryIcon } from './svgs/StoryIcon'
import { ImageBorder } from './svgs/ImageBorder'
import { EditPenIcon } from './svgs/EditPenIcon'
import { TickIcon } from './svgs/TickIcon'

export function UserProfile({ show, closeUserProfile }) {
  const [isUploading, setIsUploading] = useState(false)
  const [fileChanged, setFileChanged] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)
  const [editedUser, setEditedUser] = useState({ ...user })
  const [isNameEditable, setIsNameEditable] = useState(false)
  const [isStatusEditable, setIsStatusEditable] = useState(false)
  const nameRef = useRef(null)
  const statusRef = useRef(null)
  const nameTempRef = useRef(null)
  const statusTempRef = useRef(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (fileChanged) {
      dispatch(editUserProfile(editedUser))
      setFileChanged(false)
    }
  }, [editedUser, fileChanged, dispatch])

  function handleSaveFullName() {
    if (nameTempRef.current !== null) {
      setEditedUser((prevUser) => ({
        ...prevUser,
        fullName: nameTempRef.current,
      }))
      dispatch(
        editUserProfile({
          ...editedUser,
          fullName: nameTempRef.current,
        })
      )
    }
  }

  function handleSaveUserStatus() {
    if (statusTempRef.current !== null) {
      setEditedUser((prevUser) => ({
        ...prevUser,
        status: statusTempRef.current,
      }))
      dispatch(
        editUserProfile({
          ...editedUser,
          status: statusTempRef.current,
        })
      )
    }
  }

  function handleShowModal(e) {
    e.stopPropagation()
    setShowModal(!showModal)
  }
  function handleCloseModal() {
    setShowModal(false);
  }

  async function handelFile(ev) {
    const file =
      ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
    try {
      setIsUploading(true)
      const { url } = await uploadImg(file)
      setEditedUser({ ...editedUser, img: url })
      setFileChanged(true)
    } catch (err) {
      console.log('err', err)
    } finally {
      setIsUploading(false)
    }
  }

  function toggleNameEdit() {
    setIsNameEditable((prev) => !prev)
    if (!isNameEditable) {
      setTimeout(() => {
        setCursorToEnd(nameRef.current)
      })
    }
  }

  function toggleStatusEdit() {
    setIsStatusEditable((prev) => !prev)
    if (!isStatusEditable) {
      setTimeout(() => {
        setCursorToEnd(statusRef.current)
      })
    }
  }

  function handleNameChange(e) {
    nameTempRef.current = e.target.innerText
  }

  function handleStatusChange(e) {
    statusTempRef.current = e.target.innerText
  }

  function setCursorToEnd(contentEditableElement) {
    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(contentEditableElement)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  return (
    <section className={`user-profile-page ${show ? 'open' : ''}`}>
      <div className="first-section">
        <span>{/* <LeftArrow /> */}</span>
        <h1 onClick={closeUserProfile}>Profile</h1>
      </div>
      <div className="second-section">
        <div className="image-container">
          <label
            onDrop={(e) => {
              e.preventDefault()
              handelFile(e)
            }}
            onDragOver={(e) => {
              e.preventDefault()
            }}
            className="cover-img"
          >
            {isUploading ? (
              <span className="loader"></span>
            ) : (
              <>
                <ImageBorder />
                <img
                  className="img-edit"
                  src={editedUser.img ? editedUser.img : emptyImg}
                  alt="user station img"
                  title="Upload Porofile Photo"
                />
              </>
            )}
            <input type="file" onChange={handelFile} className="upload-ninja" />
          </label>
          <StoryIcon className="story-icon-svg" onClick={handleShowModal} />
        </div>
      </div>

      <div className="third-section">
        <div>
          <span className="name-profile">Your name</span>
        </div>
        <div>
          <div className={`details-edit ${isNameEditable ? 'editing' : ''}`}>
            {isNameEditable ? (
              <div
                ref={nameRef}
                contentEditable
                onBlur={toggleNameEdit}
                onInput={handleNameChange}
                suppressContentEditableWarning={true}
              >
                {editedUser.fullName}
              </div>
            ) : (
              <span className="name-to-change">{editedUser.fullName}</span>
            )}
            <div className="icons-container">
              <TickIcon
                className={isNameEditable ? 'confirm-name' : 'hide-confirm'}
                onClick={handleSaveFullName}
              />
              <EditPenIcon
                className={isNameEditable ? 'is-editing-name' : ''}
                onClick={toggleNameEdit}
              />
            </div>
          </div>
          <p className="name-description">
            This is not your username or pin. This name will be visible to your
            WhatsApp contacts.
          </p>
        </div>
      </div>

      <div className="fourth-section">
        <div>
          <span className="about-profile">About</span>
        </div>
        <div>
          <div className={`details-edit ${isStatusEditable ? 'editing' : ''}`}>
            {isStatusEditable ? (
              <div
                ref={statusRef}
                contentEditable
                onBlur={toggleStatusEdit}
                onInput={handleStatusChange}
                suppressContentEditableWarning={true}
              >
                {editedUser.status}
              </div>
            ) : (
              <span>{editedUser.status}</span>
            )}
            <div className="icons-container">
              <TickIcon
                className={isStatusEditable ? 'confirm-status' : 'hide-confirm'}
                onClick={handleSaveUserStatus}
              />

              <EditPenIcon
                className={isStatusEditable ? 'is-editing-status' : ''}
                onClick={toggleStatusEdit}
              />
            </div>
          </div>
        </div>
      </div>

      {showModal && <CreateStory onClose={handleCloseModal} />}

    </section>
  )
}
