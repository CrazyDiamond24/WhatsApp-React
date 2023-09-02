import React, { useEffect, useRef, useState } from 'react'
import { ImgMsg } from './MsgTypies/ImgMsg'
import { VideoMsg } from './MsgTypies/VideoMsg'
import { AudioMsg } from './MsgTypies/AudioMsg'
import { TextMsg } from './MsgTypies/TextMsg'
import { FileMsg } from './MsgTypies/FileMsg'
import { MsgOptions } from './MsgOptions'
import { msgService } from '../services/msg.service'

export function ConverstationList({ isUserBlocked, msgs, loggedInUser, user }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const chatMsgRefs = useRef([])

  function showTimestamp(timestamp) {
    return msgService.getTimestamp(timestamp)
  }

  function handleMouseEnter(index) {
    if (hoveredIndex) return
    setHoveredIndex(index)
  }

  function handleMouseLeave() {
    setHoveredIndex(null)
  }

  useEffect(() => {
    chatMsgRefs.current.forEach((msgRef, index) => {
      if (msgRef && msgRef.offsetWidth > 200) {
        msgRef?.classList.add('wide-msg')
      } else {
        msgRef?.classList.remove('wide-msg')
      }
    })
  }, [msgs])

  return (
    <>
      {msgs?.map((msg, index) => (
        <li
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          ref={(el) => (chatMsgRefs.current[index] = el)}
          key={index}
          className={`chat-msg ${
            msg.senderId === loggedInUser?._id ? 'sent' : 'received'
          }`}
        >
          {msg.type === 'image' && <ImgMsg msg={msg} />}
          {msg.type === 'video' && <VideoMsg msg={msg} />}
          {msg.type === 'audio' && <AudioMsg msg={msg} />}
          {msg.type === 'text' && <TextMsg msg={msg} />}
          {msg.type === 'file' && <FileMsg msg={msg} />}

          <span className="timestamp">{showTimestamp(msg.timestamp)}</span>
          {hoveredIndex === index && (
            <MsgOptions
              user={user}
              msg={msg}
              loggedInUser={loggedInUser}
              direction={msg.senderId === loggedInUser?._id ? 'left' : 'right'}
            />
          )}
        </li>
      ))}
      {isUserBlocked && (
        <li className="chat-msg system">
          This user is blocked. You cannot send or recive messages from them
        </li>
      )}
    </>
  )
}
