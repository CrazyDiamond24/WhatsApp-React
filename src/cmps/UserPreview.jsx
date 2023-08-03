import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrUser } from '../store/actions/user.actions'
import { ContactOptionsModal } from './ContactOptionsModal'

export function UserPreview({ user }) {
  const [showModal, setShowModal] = useState(false)
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })

  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

  const dispatch = useDispatch()

  const lastMsg = useMemo(() => {
    return user?.msgs?.filter(
      (msg) =>
        msg.senderId === loggedInUser?._id ||
        msg.recipientId === loggedInUser?._id
    )
  }, [user, loggedInUser])

  const lastMsgContent = useMemo(() => {
    return lastMsg?.length > 0
      ? lastMsg[lastMsg.length - 1].type !== 'image'
        ? lastMsg[lastMsg.length - 1].content
        : '🖼️ Shared an Image'
      : 'Start a new conversation'
  }, [lastMsg])

  function handleClick(e) {
    if (e.button === 0) {
      dispatch(setCurrUser(user._id))
    }
  }

  function showContactModal(e) {
    e.preventDefault()
    if (e.button === 2) {
      dispatch(setCurrUser(user._id))
      const rect = e.target.getBoundingClientRect()
      setModalPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      })
      setShowModal(true)
    }
  }

  function handleCloseOptionModal() {
    setShowModal(false)
  }

  return (
    <article
      className="contact-preview"
      onClick={handleClick}
      onContextMenu={showContactModal}
    >
      <img
        className="contact-preview-image"
        src={user.img}
        alt={user.fullName}
      />
      <div className="contact-preview-info">
        <h2>{user.fullName}</h2>
        <h3
          style={{
            fontStyle:
              lastMsgContent === '🖼️ Shared an Image' ? 'italic' : 'normal',
          }}
        >
          {lastMsgContent}
        </h3>
      </div>
      {showModal && (
        <ContactOptionsModal
          position={modalPosition}
          closeOptionsModal={handleCloseOptionModal}
          user={user}
          loggedInUser={loggedInUser}
          // openRecommindationModal={handleShowRecommindationModal}
          // onShowDeleteModal={handleShowDeleteModal}
        />
      )}
    </article>
  )
}
