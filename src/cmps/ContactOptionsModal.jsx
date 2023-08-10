import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeContactFromUser , blockUnblockContact} from '../store/actions/user.actions'

export function ContactOptionsModal({
  position,
  closeOptionsModal,
  user,
  loggedInUser,
}) {
  const modalRef = useRef()
  const dispatch = useDispatch()
  const isUserBlocked = loggedInUser?.blockedContcats?.includes(user?._id)
  const [isBlocked , setIsBlocked] = useState(isUserBlocked)
// to do use state block/unblock and send the action type to the block function and it works.
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
  function blockContact() { 
    setIsBlocked(isUserBlocked)
    const actionType = isUserBlocked ? "UNBLOCK_USER" : "BLOCK_USER"
    dispatch(blockUnblockContact(actionType , user._id))
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
            <button>Delete contact</button>
          </li>
          <li onClick={blockContact}>
            <button>{isBlocked ? 'Unblock contact' : 'Block contact'}</button>
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
