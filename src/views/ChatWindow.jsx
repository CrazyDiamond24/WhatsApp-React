import React from "react"
import { useEffect, useState, useRef, useMemo } from "react"
import { getSpotifySvg } from "../services/SVG.service"
import { useDispatch, useSelector } from "react-redux"
import { addMsg, blockUnblockContact } from "../store/actions/user.actions"
import { Emojis } from "../cmps/Emojis"
import { Giphy } from "../cmps/Giphy"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { socketService, SOCKET_EMIT_SEND_MSG } from "../services/socket.service"
import { msgService } from "../services/msg.service"
import Transcript from "../cmps/Transcript"
import { WelcomeChatRoom } from "../cmps/WelcomeChatRoom"
import { ConverstationList } from "../cmps/ConverstationList"
import MsgModal from "../cmps/MsgModal"
import { ReactComponent as PlusWhatsapp } from "../assets/imgs/plusWhatsapp.svg"

export function ChatWindow() {
  const [msgContent, setMsgContent] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [isHovered, setIsHovered] = useState(null)
  const [recipientIsRecording, setUserIsRecording] = useState(false)
  const [recipientIsTyping, setUserIsTyping] = useState(false)
  const [lastSeen, setLastSeen] = useState("")
  const [onlineStatus, setOnlineStatus] = useState("")
  const [isIconRotated, setIsIconRotated] = useState(false)
  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })
  const user = useSelector((storeState) => {
    return storeState.userModule.selectedUser
  })
  const allMsgs = useSelector(
    (storeState) => storeState.userModule.loggedInUser?.msgs
  )
  const dispatch = useDispatch()
  const [animationParent] = useAutoAnimate()

  const isUserBlocked = loggedInUser?.blockedContcats?.includes(user?._id)
  const msgs =
    loggedInUser && user
      ? msgService.filterMsgs(user, loggedInUser, allMsgs)
      : null

  useEffect(() => {
    const container = document.querySelector(".conversation-container")
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [msgs])

  useEffect(() => {
    const handleTyping = (typing) => {
      const message = typing ? "is typing..." : ""
      const userId = loggedInUser?._id
      return { userId, message }
    }
    socketService.on("typing", handleTyping(msgContent))
    return () => {
      socketService.off("typing", handleTyping(msgContent))
    }
  }, [msgContent])

  useEffect(() => {
    const handleReceivedMsg = (receivedMsg) => {
      if (receivedMsg.content && receivedMsg.content.includes(".gif"))
        receivedMsg.type = "image"
      dispatch(
        addMsg(
          receivedMsg.content,
          receivedMsg.recipientId,
          receivedMsg.senderId,
          receivedMsg.type || "text"
        )
      )
    }
    socketService.on("chat-add-msg", handleReceivedMsg)
    return () => {
      socketService.off("chat-add-msg", handleReceivedMsg)
    }
  }, [dispatch])

  // need to make a function at the socket.service
  useEffect(() => {
    socketService.on("online-users", (userStatus) => {
      // const userStatus = onlineUsersData.find((user) => user.id === user._id)
      console.log("userStatus", userStatus)
      if (userStatus) {
        console.log("there is userStatus")
        setOnlineStatus(userStatus[0].isOnline ? "Online" : "")
        setLastSeen(userStatus[0].lastSeen)
      }
    })
    return () => {
      socketService.off("online-users")
    }
  }, [user?._id])
  console.log('loggedInUser', loggedInUser)
  useEffect(() => {
    let typingTimeout
    const handleTyping = (typingData) => {
      const { userId, isTyping } = typingData
      if (userId !== loggedInUser?._id) {
        setUserIsTyping(isTyping)
        clearTimeout(typingTimeout)
        if (isTyping) {
          typingTimeout = setTimeout(() => {
            setUserIsTyping(false)
          }, 1000)
        }
      }
    }
    socketService.on("user-typing", handleTyping)
    return () => {
      socketService.off("user-typing", handleTyping)
    }
  }, [user?._id])

  useEffect(() => {
    const handleRecording = (recordingData) => {
      const { userId, isRecording } = recordingData
      console.log(isRecording)
      if (userId !== loggedInUser?._id) {
        setUserIsRecording(isRecording)
      }
    }
    socketService.on("user-recording", handleRecording)
    return () => {
      socketService.off("user-recording", handleRecording)
    }
  }, [user?._id])

  function handelSendMsg(e) {
    e.preventDefault()
    if (!loggedInUser || !user || !msgContent.length) return

    const trimmedContent = msgContent.trim()

    if (trimmedContent) {
      const contentToSend = {
        content: trimmedContent,
        senderId: loggedInUser._id,
        recipientId: user._id,
      }
      setMsgContent("")
      socketService.emit(SOCKET_EMIT_SEND_MSG, contentToSend)
    }
  }

  function handleInputChange(e) {
    setMsgContent(e.target.value)
    const trimmedContent = e.target.value.trim()
    const isTyping = trimmedContent !== ""

    // Don't set recipient's typing state here emit your typing status instead
    socketService.emit("typing", {
      senderId: loggedInUser._id,
      recipientId: user._id,
      isTyping,
    })
  }

  function handleEmojiSelect(emoji) {
    setMsgContent((prevMsg) => prevMsg + emoji)
  }

  function handlefilesSelect(url, type) {
    const contentToSend = msgService.getMsgType(url, loggedInUser, user, type)
    socketService.emit(SOCKET_EMIT_SEND_MSG, contentToSend)
    setMsgContent("")
  }

  function handleShowModal(e) {
    e.stopPropagation()

    const rect = e.target.getBoundingClientRect()
    setModalPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    })
    setShowModal(!showModal)
    setIsIconRotated(!isIconRotated)
  }
  const timestamp = (time) => {
    return msgService.getTimestamp(time)
  }
  function blockContact() {
    const action = isUserBlocked ? "UNBLOCK_USER" : "BLOCK_USER"
    dispatch(blockUnblockContact(action, user._id))
  }
  console.log('user.lastSeen', user)
  return (
    <div className="chat-window" ref={animationParent}>
      {user ? (
        <>
          <div className="header-area">
            <img src={user?.img} alt={user?.username} />
            <h2>{user?.fullName}</h2>
            {/* <span onClick={blockContact}>
              {isUserBlocked ? "unBlock contact" : "Block contact"}
            </span> */}
            {onlineStatus === "Online" ? (
              <div>Online</div>
            ) : (
             <div>Last Seen: {timestamp(user.lastSeen)}</div>
            )}
            {recipientIsTyping && <div> is typing...</div>}
            {recipientIsRecording && <div> is recording...</div>}
          </div>
          <ul className="conversation-container flex" ref={animationParent}>
            <ConverstationList
              msgs={msgs}
              loggedInUser={loggedInUser}
              isHovered={isHovered}
              user={user}
            />
          </ul>
          <form className="msg-input" onSubmit={(e) => handelSendMsg(e)}>
            <div className="multimedia-container">
              <Giphy
                onSelectGif={(gifImgUrl) =>
                  handlefilesSelect(gifImgUrl, "image")
                }
              />
              <Emojis
                onSelectEmoji={handleEmojiSelect}
                onSelectImage={(gifImgUrl) =>
                  handlefilesSelect(gifImgUrl, "image")
                }
                onSelectVideo={(url) => handlefilesSelect(url, "video")}
                onSelectFile={(url) => handlefilesSelect(url, "file")}
              />

              {/* <TakePicture onSelectSelfiePicture={handleGifSelect} /> */}
            </div>
            <div className="chat-input-container">
              {showModal && <MsgModal position={modalPosition} />}
              <PlusWhatsapp
                title="Attach"
                className={`plus-icon-svg ${isIconRotated ? "rotate" : ""}`}
                onClick={(e) => handleShowModal(e)}
              />

              <input
                className="chat-msg-input"
                type="text"
                placeholder="Type a message..."
                value={msgContent}
                onChange={handleInputChange}
              />

              <Transcript
                title="Record"
                onSelectAudio={(audioUrl) =>
                  handlefilesSelect(audioUrl, "audio")
                }
                className="transcript-container"
              />
            </div>
          </form>
        </>
      ) : (
        <WelcomeChatRoom />
      )}
    </div>
  )
}
