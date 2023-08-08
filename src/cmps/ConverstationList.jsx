import React, { useEffect, useRef } from 'react'
import { ImgMsg } from './MsgTypies/ImgMsg'
import { VideoMsg } from './MsgTypies/VideoMsg'
import { AudioMsg } from './MsgTypies/AudioMsg'
import { TextMsg } from './MsgTypies/TextMsg'
import { FileMsg } from './MsgTypies/FileMsg'
import { MsgOptions } from './MsgOptions'
import { msgService } from '../services/msg.service'

export function ConverstationList({ msgs, loggedInUser, isHovered, user }) {
  const chatMsgRefs = useRef([])

  function showTimestamp(timestamp) {
    return msgService.getTimestamp(timestamp)
  }

  useEffect(() => {
    chatMsgRefs.current.forEach((msgRef, index) => {
      if (msgRef && msgRef.offsetWidth > 200) {
        msgRef.classList.add('wide-msg')
      } else {
        msgRef.classList.remove('wide-msg')
      }
    })
  }, [msgs])

  return (
    <>
      {msgs?.map((msg, index) => (
        <li
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

          <span className='timestamp'>{showTimestamp(msg.timestamp)}</span>
          {isHovered === index && (
            <MsgOptions user={user} msg={msg} loggedInUser={loggedInUser} />
          )}
        </li>
      ))}
    </>
  )
}
