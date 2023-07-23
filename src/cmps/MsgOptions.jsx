import React, { useState } from "react"
import { MsgOptionsModal } from "./MsgOptionsModal"

export function MsgOptions({ message }) {
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [showModal, setShowOptionsModal] = useState(false)

  const showSongOptionsModal = (e) => {
    const rect = e.target.getBoundingClientRect()
    setModalPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    })
    setShowOptionsModal((prevState) => !prevState)
  }
  return (
  <>
      <div onClick={(e) => showSongOptionsModal(e)}>🔽</div>
      {showModal && (
        <MsgOptionsModal
          position={modalPosition}
          closeModal={() => setShowOptionsModal(false)}
        />
      )}  
  </>
  )
}
