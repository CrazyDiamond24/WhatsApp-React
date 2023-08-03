import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { removeContactFromUser } from '../store/actions/user.actions'

export function ContactOptionsModal({
  position,
  closeOptionsModal,
  user,
  loggedInUser,
}) {
  const modalRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeOptionsModal()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalRef, closeOptionsModal])

  function DeleteContact() {
    dispatch(removeContactFromUser(loggedInUser._id, user._id))
    closeOptionsModal()
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
            <button>Block contact</button>
          </li>
          <li>
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
