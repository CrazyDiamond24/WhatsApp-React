import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMsg, blockUnblockContact } from '../store/actions/user.actions'
import { Emojis } from '../cmps/Emojis'
import { ReactComponent as TextingSVG } from '../assets/imgs/texting.svg'
import { MsgOptions } from '../cmps/MsgOptions'
import { Giphy } from '../cmps/Giphy'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { socketService } from '../services/socket.service'
import { msgService } from '../services/msg.service'
import Transcript from '../cmps/Transcript'
import { ImgMsg } from '../cmps/MsgTypies/ImgMsg'
import { AudioMsg } from '../cmps/MsgTypies/AudioMsg'
import { VideoMsg } from '../cmps/MsgTypies/VideoMsg'
import { TextMsg } from '../cmps/MsgTypies/TextMsg'
import { FileMsg } from '../cmps/MsgTypies/FileMsg'

export function ChatWindow() {
  // console.log('chat window rendered now')
  const [msgContent, setMsgContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isHovered, setIsHovered] = useState(null)
  const [sentGifs, setSentGifs] = useState([])

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
    console.log('handelSendMsg called', msgContent)
    e.preventDefault()
    if (!loggedInUser || !user) return

    // Trim the content to remove leading and trailing whitespace
    const trimmedContent = msgContent.trim()

    // Only send the message if the content is not empty
    if (trimmedContent) {
      const contentToSend = {
        content: trimmedContent,
        senderId: loggedInUser._id,
        recipientId: user._id,
      }
      setMsgContent('')
      socketService.emit('chat-send-msg', contentToSend)
    }
  }

  useEffect(() => {
    if (loggedInUser && user) {
    }
  }, [loggedInUser?.msgs?.length, user])

  useEffect(() => {
    const handleReceivedMsg = (receivedMsg) => {
      console.log('Received message ', receivedMsg)

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
      console.log('Message dispatched')
    }

    // Subscribe to the event
    socketService.on('chat-add-msg', handleReceivedMsg)

    // Clean up the event listener when the component unmounts
    return () => {
      socketService.off('chat-add-msg', handleReceivedMsg)
    }
  }, [dispatch])

  function handleInputChange(e) {
    setMsgContent(e.target.value)
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
    socketService.emit('chat-send-msg', contentToSend)
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
    socketService.emit('chat-send-msg', contentToSend)
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
    socketService.emit('chat-send-msg', contentToSend)
    setMsgContent('')
    // }
  }
  function handleonFileSelect(url) {
    const contentToSend = {
      content: url,
      senderId: loggedInUser._id,
      recipientId: user._id,
      type: 'file',
    }
    socketService.emit('chat-send-msg', contentToSend)
    setMsgContent('')
    // }
  }

  const showTimestamp = (timestamp) => {
    return msgService.getTimestamp(timestamp)
  }

  const blockContact = () => {
    const action = isUserBlocked ? 'UNBLOCK_USER' : 'BLOCK_USER'
    dispatch(blockUnblockContact(action, user._id))
    console.log('block')
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
              {isUserBlocked ? 'unBlock contact' : 'Block contact'}
            </span>
          </div>
          <ul className="conversation-container flex" ref={animationParent}>
            {msgs?.map((msg, index) => (
              <li
                key={index}
                className={`chat-msg ${
                  msg.senderId === loggedInUser?._id ? 'sent' : 'received'
                }`}
                // onMouseEnter={() => handelMouseEnter(index)}
                // onMouseLeave={handelMouseLeave}
              >
                {msg.type === 'image' && <ImgMsg msg={msg} />}
                {msg.type === 'video' && <VideoMsg msg={msg} />}
                {msg.type === 'audio' && <AudioMsg msg={msg} />}
                {msg.type === 'text' && <TextMsg msg={msg} />}
                {msg.type === 'file' && <FileMsg msg={msg} />}

                <span className="timestamp">
                  {showTimestamp(msg.timestamp)}
                </span>
                {isHovered === index && (
                  <MsgOptions
                    user={user}
                    msg={msg}
                    loggedInUser={loggedInUser}
                  />
                )}
              </li>
            ))}
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
        <section className="welcome-chatroom">
          <div className="logo-without-word-container">
            <img
              src={require('../assets/imgs/Logo-without-word.png')}
              alt="logo"
              className="logo-without-word"
            ></img>
          </div>

          <div className="welcome-content">
            <h1 className="welcome">Welcome to WuZZapp</h1>
            <p className="app-gist">
              Start chatting with your friends and family, or unlock a world of
              amusement by conversing with our creative AI bots!
            </p>
            <TextingSVG className="text-welcome-svg" />
            <p className="login-or-signup">
              To get started, please{' '}
              <Link to="/login" className="login-signup-link">
                log in
              </Link>{' '}
              or{' '}
              <Link to="/login" className="login-signup-link">
                sign up
              </Link>{' '}
              if you don't have an account.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
