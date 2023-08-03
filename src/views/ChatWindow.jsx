import React from 'react'
import { useEffect, useState, useRef, useMemo } from 'react'
import { getSpotifySvg } from '../services/SVG.service'
import { useDispatch, useSelector } from 'react-redux'
import { addMsg, blockUnblockContact } from '../store/actions/user.actions'
import { Emojis } from '../cmps/Emojis'
import { Giphy } from '../cmps/Giphy'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { socketService, SOCKET_EMIT_SEND_MSG } from '../services/socket.service'
import { msgService } from '../services/msg.service'
import Transcript from '../cmps/Transcript'
import { WelcomeChatRoom } from '../cmps/WelcomeChatRoom'
import { ConverstationList } from '../cmps/ConverstationList'
import MsgModal from '../cmps/MsgModal'

export function ChatWindow() {
  // console.log('chat window rendered now')

  const [msgContent, setMsgContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [isHovered, setIsHovered] = useState(null)
  // const [sentGifs, setSentGifs] = useState([])
  const [recipientIsTyping, setUserIsTyping] = useState(false)

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
    const container = document.querySelector('.conversation-container')
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
      setMsgContent('')
      socketService.emit(SOCKET_EMIT_SEND_MSG, contentToSend)
    }
  }

  // useEffect(() => {
  //   if (loggedInUser && user) {
  //   }
  // }, [loggedInUser?.msgs?.length, user])

  useEffect(() => {
    const handleTyping = (typing) => {
      console.log('typing', typing)
      const message = typing ? 'is typing...' : ''
      const userId = loggedInUser?._id
      return { userId, message }
    }
    socketService.on('typing', handleTyping(msgContent))
    return () => {
      socketService.off('typing', handleTyping(msgContent))
    }
  }, [msgContent])

  useEffect(() => {
    const handleReceivedMsg = (receivedMsg) => {
      if (receivedMsg.content && receivedMsg.content.includes('.gif')) {
        receivedMsg.type = 'image'
      }

      dispatch(
        addMsg(
          receivedMsg.content,
          receivedMsg.recipientId,
          receivedMsg.senderId,
          receivedMsg.type || 'text'
        )
      )
    }

    // Subscribe to the event
    socketService.on('chat-add-msg', handleReceivedMsg)

    return () => {
      socketService.off('chat-add-msg', handleReceivedMsg)
    }
  }, [dispatch])

  useEffect(() => {
    const handleTyping = (typingData) => {
      const { userId, isTyping } = typingData
      if (userId !== loggedInUser?._id) {
        console.log('User is typing:', isTyping)
        setUserIsTyping(isTyping)
      }
    }
    socketService.on('user-typing', handleTyping)
    return () => {
      socketService.off('user-typing', handleTyping)
    }
  }, [user?._id])

  function handleInputChange(e) {
    setMsgContent(e.target.value)
    const trimmedContent = e.target.value.trim()
    const isTyping = trimmedContent !== ''

    // Don't set recipient's typing state here; emit your typing status instead
    socketService.emit('typing', {
      senderId: loggedInUser._id,
      recipientId: user._id,
      isTyping,
    })
  }

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
      type: 'image',
    }
    socketService.emit(SOCKET_EMIT_SEND_MSG, contentToSend)
    setMsgContent('')
    // }
  }
  function handleAudioSelect(audioUrl) {
    // if (!loggedInUser || !user) return
    // if (loggedInUser && user) {
    const contentToSend = {
      content: audioUrl,
      senderId: loggedInUser._id,
      recipientId: user._id,
      type: 'audio',
    }
    socketService.emit(SOCKET_EMIT_SEND_MSG, contentToSend)
    setMsgContent('')
    // }
  }
  function handleVideoSelect(url) {
    // if (!loggedInUser || !user) return
    // if (loggedInUser && user) {
    const contentToSend = {
      content: url,
      senderId: loggedInUser._id,
      recipientId: user._id,
      type: 'video',
    }
    socketService.emit(SOCKET_EMIT_SEND_MSG, contentToSend)
    setMsgContent('')
    // }
  }

  function handleShowModal(e) {
    e.stopPropagation()

    const rect = e.target.getBoundingClientRect()
    setModalPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    })
    setShowModal(!showModal)
  }

  function handleonFileSelect(url) {
    const contentToSend = {
      content: url,
      senderId: loggedInUser._id,
      recipientId: user._id,
      type: 'file',
    }
    socketService.emit(SOCKET_EMIT_SEND_MSG, contentToSend)
    setMsgContent('')
    // }
  }

  const blockContact = () => {
    const action = isUserBlocked ? 'UNBLOCK_USER' : 'BLOCK_USER'
    dispatch(blockUnblockContact(action, user._id))
  }

  useEffect(() => {
    console.log('Recipient is typing state:', recipientIsTyping)
  }, [recipientIsTyping])

  const [animationParent] = useAutoAnimate()
  return (
    <div className="chat-window" ref={animationParent}>
      {user ? (
        <>
          <div className="header-area">
            <img src={user?.img} alt={user?.username} />
            <h2>{user?.fullName}</h2>
            <span onClick={blockContact}>
              {isUserBlocked ? 'unBlock contact' : 'Block contact'}
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
              {/* <TakePicture onSelectSelfiePicture={handleGifSelect} /> */}
            </div>
            <input
              className="chat-msg-input"
              type="text"
              placeholder="Type a message..."
              value={msgContent}
              onChange={handleInputChange}
            />
            <input type="submit" value="Send" />
            <span
              onClick={(e) => handleShowModal(e)}
              dangerouslySetInnerHTML={{
                __html: getSpotifySvg('plusWhatsapp'),
              }}
            ></span>
          </form>
        </>
      ) : (
        <WelcomeChatRoom />
      )}
      {showModal && <MsgModal position={modalPosition} />}
    </div>
  )
}
