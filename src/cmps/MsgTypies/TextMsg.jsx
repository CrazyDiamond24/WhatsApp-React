import React from 'react'
import { useSelector } from 'react-redux'

export function TextMsg({ msg }) {
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)

  return (
    <span
      className={
        msg.content === 'Message deleted' ? 'msg-deleted' : 'msg-content'
      }
      style={{
        fontSize: user?.userPref?.fontSize + 'px',
        color: user?.userPref?.fontColor,
      }}
    >
      {msg?.content}
    </span>
  )
}
