import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrUser } from '../store/actions/user.actions'
import { ContactOptionsModal } from './ContactOptionsModal'
import { PhotoIcon } from './svgs/PhotoIcon'
import { msgService } from '../services/msg.service'

export function UserPreview({
  user,
  activeContactId,
  onContactClick,
  unreadCount,
}) {
  const [showModal, setShowModal] = useState(false)
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const isActiveContact = user._id === activeContactId

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
    if (lastMsg?.length > 0) {
      const lastMessage = lastMsg[lastMsg.length - 1]
      if (lastMessage.type !== 'image') {
        return lastMessage.content
      } else {
        return (
          <>
            <PhotoIcon />
            Photo
          </>
        )
      }
    } else {
      return 'Start a new conversation'
    }
  }, [lastMsg])

  const isLastMsgImage = useMemo(() => {
    return lastMsg?.length > 0 && lastMsg[lastMsg.length - 1].type === 'image'
  }, [lastMsg])

  function handleClick(e) {
    if (e.button === 0) {
      dispatch(setCurrUser(user._id))
      onContactClick(user._id)
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

  function timestamp(time) {
    return msgService.getTimestamp(time)
  }

  return (
    <article
      className={`contact-preview ${isActiveContact ? 'active' : ''}`}
      onClick={handleClick}
      onContextMenu={showContactModal}
    >
      <img
        className="contact-preview-image"
        src={user.img}
        alt={user.fullName}
      />
      <div className="mini-contant">
        <div className="contact-preview-info">
          <h2>{user.fullName}</h2>
          <h3
            className={`last-msg-content ${
              isLastMsgImage
                ? 'last-msg-content-image'
                : 'last-msg-content-text'
            }`}
          >
            {lastMsgContent}
          </h3>
        </div>
        {/* add the timestamp of the last message here */}
        {user.isOnline ? (
          <h1>onLine</h1>
        ) : (
          <div>Last Seen: {timestamp(user.lastSeen)}</div>
        )}
        {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
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
