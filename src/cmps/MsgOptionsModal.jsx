import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { updateMsg } from '../store/actions/user.actions'

export function MsgOptionsModal({
  position,
  closeModal,
  user,
  loggedInUser,
  message,
}) {
  const msgModalRef = useRef()
  const dispatch = useDispatch()
  const deleteMsg = () => {
    dispatch(updateMsg(message, user._id, loggedInUser._id))
    closeModal()
  }

  return (
    <>
      <div
        ref={msgModalRef}
        className="msg-options-modal"
        style={{
          top: position.top + 20,
          left: position.left - 170,
        }}
      >
        <ul>
          <li onClick={deleteMsg}>Delete message</li>
        </ul>
      </div>
    </>
  )
}
