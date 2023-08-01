import React from "react"
import { ImgMsg } from "./MsgTypies/ImgMsg"
import { VideoMsg } from "./MsgTypies/VideoMsg"
import { AudioMsg } from "./MsgTypies/AudioMsg"
import { TextMsg } from "./MsgTypies/TextMsg"
import { FileMsg } from "./MsgTypies/FileMsg"
import { MsgOptions } from "./MsgOptions"
import { msgService } from "../services/msg.service"

export function ConverstationList({msgs,loggedInUser,isHovered,user}) {
    const showTimestamp = (timestamp) => {
    return msgService.getTimestamp(timestamp)
  }

  return (
    <>
      {msgs?.map((msg, index) => (
        <li
          key={index}
          className={`chat-msg ${
            msg.senderId === loggedInUser?._id ? "sent" : "received"
          }`}
          // onMouseEnter={() => handelMouseEnter(index)}
          // onMouseLeave={handelMouseLeave}
        >
          {msg.type === "image" && <ImgMsg msg={msg} />}
          {msg.type === "video" && <VideoMsg msg={msg} />}
          {msg.type === "audio" && <AudioMsg msg={msg} />}
          {msg.type === "text" && <TextMsg msg={msg} />}
          {msg.type === "file" && <FileMsg msg={msg} />}

          <span className="timestamp">{showTimestamp(msg.timestamp)}</span>
          {isHovered === index && (
            <MsgOptions user={user} msg={msg} loggedInUser={loggedInUser} />
          )}
        </li>
      ))}
    </>
  )
}
