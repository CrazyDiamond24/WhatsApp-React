import React, { useState } from 'react'
import { MsgOptionsModal } from './MsgOptionsModal'
import { MsgOptionsIcon } from './svgs/MsgOptionsIcon'

export function MsgOptions({ msg, loggedInUser, user, direction }) {
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [showModal, setShowOptionsModal] = useState(false)

  function showSongOptionsModal(e) {
    const rect = e.target.getBoundingClientRect()
    setModalPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    })
    setShowOptionsModal((prevState) => !prevState)
  }
  return (
    <>
      <div className="hover-icon" onClick={(e) => showSongOptionsModal(e)}>
        {' '}
        <MsgOptionsIcon />{' '}
      </div>
      {showModal && (
        <MsgOptionsModal
          user={user}
          msg={msg}
          loggedInUser={loggedInUser}
          position={modalPosition}
          dir={direction}
          closeModal={() => setShowOptionsModal(false)}
        />
      )}
    </>
  )
}
