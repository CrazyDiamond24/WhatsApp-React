import React from "react"
import { useEffect, useState, useRef, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addMsg, blockUnblockContact } from "../store/actions/user.actions"
import { Emojis } from "../cmps/Emojis"
import { Giphy } from "../cmps/Giphy"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { socketService } from "../services/socket.service"
import { msgService } from "../services/msg.service"
import Transcript from "../cmps/Transcript"
import { WelcomeChatRoom } from "../cmps/WelcomeChatRoom"
import { ConverstationList } from "../cmps/ConverstationList"

export function ChatWindow() {
  // console.log('chat window rendered now')
  const [msgContent, setMsgContent] = useState("")
  // const [imageUrl, setImageUrl] = useState("")
  const [isHovered, setIsHovered] = useState(null)
  // const [sentGifs, setSentGifs] = useState([])
  const [recipientIsTyping, setRecipientIsTyping] = useState(false)

  const dispatch = useDispatch()

  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

  const user = useSelector((storeState) => {
    return storeState.userModule.selectedUser
  })

  const allMsgs = useSelector(
    (storeState) => storeState.userModule.loggedInUser?.msgs
  )

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

  // useEffect(() => {
  //   const contentToSend = {
  //     content: imageUrl,
  //     senderId: loggedInUser._id,
  //     recipientId: user._id,
  //     type: 'image',
  //   }
  //   socketService.emit('chat-send-msg', contentToSend)
  // }, [imageUrl])

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
      socketService.emit("chat-send-msg", contentToSend)
    }
  }

  // useEffect(() => {
  //   if (loggedInUser && user) {
  //   }
  // }, [loggedInUser?.msgs?.length, user])

  useEffect(() => {
    const handleTyping = (typingData) => {
      console.log("typing", typingData)
      const { userId, isTyping } = typingData
      if (userId === user._id) {
        console.log('isTyping', isTyping)
        setRecipientIsTyping(isTyping)
      }
    }
    socketService.on("user-typing", handleTyping)
    return () => {
      socketService.off("user-typing", handleTyping)
    }
  }, [user?._id])

  useEffect(() => {
    const handleReceivedMsg = (receivedMsg) => {
      if (receivedMsg.content && receivedMsg.content.includes(".gif")) {
        receivedMsg.type = "image"
      }

      dispatch(
        addMsg(
          receivedMsg.content,
          receivedMsg.recipientId,
          receivedMsg.senderId,
          receivedMsg.type || "text"
        )
      )
    }

    // Subscribe to the event
    socketService.on("chat-add-msg", handleReceivedMsg)

    // Clean up the event listener when the component unmounts
    return () => {
      socketService.off("chat-add-msg", handleReceivedMsg)
    }
  }, [dispatch])

  function handleInputChange(e) {
    setMsgContent(e.target.value)
    const trimmedContent = e.target.value.trim()
    const isTyping = trimmedContent !== ''

    setRecipientIsTyping(isTyping)
    socketService.emit("typing", { senderId: loggedInUser._id, recipientId: user._id, isTyping })  }

  function handelMouseEnter(index) {
    setIsHovered(index)
  }

  function handelMouseLeave() {
    setIsHovered(null)
  }

  function handleEmojiSelect(emoji) {
    setMsgContent((prevMsg) => prevMsg + emoji)
  }

  function handleGifSelect(gifImgUrl) {
    // if (!loggedInUser || !user) return
    // if (loggedInUser && user) {
    const contentToSend = {
      content: gifImgUrl,
      senderId: loggedInUser._id,
      recipientId: user._id,
      type: "image",
    }
    socketService.emit("chat-send-msg", contentToSend)
    setMsgContent("")
    // }
  }
  function handleAudioSelect(audioUrl) {
    // if (!loggedInUser || !user) return
    // if (loggedInUser && user) {
    const contentToSend = {
      content: audioUrl,
      senderId: loggedInUser._id,
      recipientId: user._id,
      type: "audio",
    }
    socketService.emit("chat-send-msg", contentToSend)
    setMsgContent("")
    // }
  }
  function handleVideoSelect(url) {
    // if (!loggedInUser || !user) return
    // if (loggedInUser && user) {
    const contentToSend = {
      content: url,
      senderId: loggedInUser._id,
      recipientId: user._id,
      type: "video",
    }
    socketService.emit("chat-send-msg", contentToSend)
    setMsgContent("")
    // }
  }
  function handleonFileSelect(url) {
    const contentToSend = {
      content: url,
      senderId: loggedInUser._id,
      recipientId: user._id,
      type: "file",
    }
    socketService.emit("chat-send-msg", contentToSend)
    setMsgContent("")
    // }
  }

  const blockContact = () => {
    const action = isUserBlocked ? "UNBLOCK_USER" : "BLOCK_USER"
    dispatch(blockUnblockContact(action, user._id))
  }

  const [animationParent] = useAutoAnimate()
  return (
    <div className="chat-window" ref={animationParent}>
      {user ? (
        <>
          <div className="header-area">
            <img src={user?.img} alt={user?.username} />
            <h2>{user?.fullName}</h2>
            <span onClick={blockContact}>
              {isUserBlocked ? "unBlock contact" : "Block contact"}
            </span>
            {recipientIsTyping && <div> is typing...</div>}
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
              <Emojis
                onSelectEmoji={handleEmojiSelect}
                onSelectImage={handleGifSelect}
                onSelectVideo={handleVideoSelect}
                onSelectFile={handleonFileSelect}
              />
              <Giphy onSelectGif={handleGifSelect} />
              <Transcript onSelectAudio={handleAudioSelect} />
            </div>
            <input
              className="chat-msg-input"
              type="text"
              placeholder="Type a message..."
              value={msgContent}
              onChange={handleInputChange}
            />
            <input type="submit" value="Send" />
          </form>
        </>
      ) : (
        <WelcomeChatRoom />
      )}
    </div>
  )
}
