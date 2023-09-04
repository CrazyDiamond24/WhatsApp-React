import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { deleteMsg } from '../store/actions/user.actions'

export function MsgOptionsModal({
  position,
  closeModal,
  user,
  dir,
  loggedInUser,
  msg,
}) {
  console.log('dir', dir)
  const msgModalRef = useRef()
  const dispatch = useDispatch()

  function deleteMsgHandler() {
    dispatch(deleteMsg(msg.id, loggedInUser._id, user._id))
    closeModal()
  }

  return (
    <>
      <div
        ref={msgModalRef}
        className="msg-options-modal"
        style={{
          top: dir === 'left' ? -43 : -55,
          left: dir === 'left' ? -120 : 220,
        }}
      >
        <ul>
          <li onClick={deleteMsgHandler}>Delete message</li>
        </ul>
      </div>
    </>
  )
}
