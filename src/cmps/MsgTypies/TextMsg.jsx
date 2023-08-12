import React from 'react'
export function TextMsg({ msg }) {
  return (
    <span
      className={
        msg.content === 'Message deleted' ? 'msg-deleted' : 'msg-content'
      }
    >
      {msg?.content}
    </span>
  )
}
