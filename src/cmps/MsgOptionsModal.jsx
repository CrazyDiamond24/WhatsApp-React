import React, { useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { deleteMsg } from '../store/actions/user.actions'

export function MsgOptionsModal({ closeModal, user, dir, loggedInUser, msg }) {
  const msgModalRef = useRef()
  const dispatch = useDispatch()

  const deleteMsgHandler = () => {
    dispatch(deleteMsg(msg.id, loggedInUser._id, user._id))
    closeModal()
  }

  const copyToClipboard = () => {
    const el = document.createElement('textarea')
    el.value = msg.content
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    closeModal()
  }

  return (
    <>
      <div
        ref={msgModalRef}
        className="msg-options-modal"
        style={{
          top: dir === 'left' ? 10 : 0,
          left: dir === 'left' ? -100 : 100,
        }}
      >
        <ul>
          <li onClick={deleteMsgHandler}>Delete message</li>
          {msg.type === 'text' && <li onClick={copyToClipboard}>Copy</li>}
        </ul>
      </div>
    </>
  )
}
