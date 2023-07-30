import React, { useEffect, useState } from 'react'
import { LeftArrow } from './svgs/LeftArrow'
import { EditIcon } from './svgs/EditIcon'
import emptyImg from '../../src/assets/imgs/empty-img.png'
import { uploadImg } from '../services/upload.service'
import { useDispatch, useSelector } from 'react-redux'
import { editUserProfile } from '../store/actions/user.actions'
export function UserProfile({ show, closeUserProfile }) {
  const [isUploading, setIsUploading] = useState(false)
  const [fileChanged, setFileChanged] = useState(false)
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)
  const [editedUser, setEditedUser] = useState({ ...user })
  function onChangeUserStatus(e) {
    setEditedUser({ ...editedUser, status: e.target.value })
  }
  const dispatch = useDispatch()
  function onChangeUserName(e) {
    setEditedUser({ ...editedUser, username: e.target.value })
  }

  function handleSaveUserStatus() {
    dispatch(editUserProfile(editedUser))
  }

  function handleSaveUserName() {
    console.log('hi')
    dispatch(editUserProfile(editedUser))
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

  useEffect(() => {
    if (fileChanged) {
      console.log('hi')
      dispatch(editUserProfile(editedUser))
      setFileChanged(false)
    }
  }, [editedUser, fileChanged, dispatch])
  return (
    <section className={`user-profile-page ${show ? 'open' : ''}`}>
      <div className="first-section">
        <span>{/* <LeftArrow /> */}</span>
        <h1 onClick={closeUserProfile}>Profile</h1>
      </div>
      <div className="second-section">
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
            <img
              className="img-edit"
              src={editedUser.img ? editedUser.img : emptyImg}
              alt="user station img"
            />
          )}
          <input type="file" onChange={handelFile} className="hidden" />
        </label>
      </div>
      <div className="thered-section">
        <div>
          <span>Your name</span>
          <input
            type="text"
            placeholder="Add a name"
            onChange={(e) => onChangeUserName(e)}
          />
          <button onClick={handleSaveUserName}>Save</button>
        </div>
        <div>
          <span>{/* <EditIcon /> */}</span>
          <div>
            <span>{user?.username}</span>
          </div>
        </div>
      </div>
      <div className="four-section">
        <div>
          <span>Your status</span>
        </div>
        <div>
          <span>{/* <EditIcon /> */}</span>
          <div>
            <span>{user?.status}</span>
            <input
              type="text"
              placeholder="Add a status"
              onChange={(e) => onChangeUserStatus(e)}
            />
            <button onClick={handleSaveUserStatus}>Save</button>
          </div>
        </div>
      </div>
    </section>
  )
}
