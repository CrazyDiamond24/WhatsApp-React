import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  removeContactFromUser,
  blockUnblockContact,
  clearChat,
} from '../store/actions/user.actions'
import { socketService } from '../services/socket.service'

export function ContactOptionsModal({
  position,
  closeOptionsModal,
  user,
  loggedInUser,
}) {
  const modalRef = useRef()
  const dispatch = useDispatch()
  const isUserBlocked = loggedInUser?.blockedContcats?.includes(user?._id)
  const [isBlocked, setIsBlocked] = useState(isUserBlocked)

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeOptionsModal()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [modalRef, closeOptionsModal])

  function DeleteContact() {
    dispatch(removeContactFromUser(loggedInUser._id, user._id))
    closeOptionsModal()
  }

  async function blockContact() {
    setIsBlocked(isUserBlocked)
    const action = isUserBlocked ? "UNBLOCK_USER" : "BLOCK_USER"
   await dispatch(blockUnblockContact(action, user._id, loggedInUser._id))
    closeOptionsModal()
    socketService.emit("user-block-status-updated", {
      blockedUserId: user._id,
      action,
    })
    socketService.emit("user-block-status-updated", {
      blockedUserId: loggedInUser._id,
      action,
    })
  }
  function onClearChat() {
    dispatch(clearChat(user._id, loggedInUser._id))
  }

  return (
    <>
      <section
        ref={modalRef}
        className="station-options-modal"
        style={{
          top: position.top + 40,
          left: position.left,
        }}
      >
        <ul>
          <li onClick={DeleteContact}>
            <button>Delete contact</button>
          </li>
          <li onClick={blockContact}>
            <button>{isBlocked ? "Unblock contact" : "Block contact"}</button>
          </li>
          <li onClick={onClearChat}>
            <button>clear chat</button>
          </li>
          <li>
            <button>Add to haialem shel rania</button>
          </li>
        </ul>
      </section>
    </>
  )
}
