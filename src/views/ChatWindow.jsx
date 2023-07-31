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

export function ChatWindow() {
  // console.log('chat window rendered now')
  const [msgContent, setMsgContent] = useState('')
  const [isHovered, setIsHovered] = useState(null)
  const [sentGifs, setSentGifs] = useState([])

  const dispatch = useDispatch()

  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

  const user = useSelector((storeState) => {
    return storeState.userModule.selectedUser
  })

  const setTopic = (senderId, recipientId) => {
    console.log('setting the topic in chat')
    if (!senderId || !recipientId) return
    const ids = [senderId, recipientId].sort()
    const topic = `${ids[0]}-${ids[1]}` // Concatenate the sorted IDs
    console.log('Setting chat topic:', topic)
    socketService.emit('chat-set-topic', topic)
  }

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

  function handelSendMsg(e) {
    e.preventDefault()
    if (!loggedInUser || !user) return

    const contentToSend = {
      content: msgContent,
      senderId: loggedInUser._id,
      recipientId: user._id,
    }
    setMsgContent('')
    socketService.emit('chat-send-msg', contentToSend)
  }

  useEffect(() => {
    if (loggedInUser && user) {
    }
  }, [loggedInUser?.msgs?.length, user])

  useEffect(() => {
    const handleReceivedMsg = (receivedMsg) => {
      console.log('Received message', receivedMsg)

      if (receivedMsg.content && receivedMsg.content.includes('.gif')) {
        receivedMsg.type = 'image'
      }

      dispatch(
        addMsg(
          receivedMsg.content,
          receivedMsg.recipientId,
          receivedMsg.senderId,
          receivedMsg.type
        )
      )
      console.log('Message dispatched')
    }

    // setTopic(loggedInUser?._id, user?._id)
    socketService.on('chat-add-msg', handleReceivedMsg)
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
    const contentToSend = {
      content: gifImgUrl,
      senderId: loggedInUser._id,
      recipientId: user._id,
      type: 'image',
    }
    socketService.emit('chat-send-msg', contentToSend)
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
    <div className='chat-window' ref={animationParent}>
      {user ? (
        <>
          <div className='header-area'>
            <img src={user?.img} alt={user?.username} />
            <h2>{user?.fullName}</h2>
            <span onClick={blockContact}>
              {isUserBlocked ? 'unBlock contact' : 'Block contact'}
            </span>
          </div>
          <ul className='conversation-container flex' ref={animationParent}>
            {msgs?.map((msg, index) => (
              <li
                key={index}
                className={`chat-msg ${
                  msg.senderId === loggedInUser?._id ? 'sent' : 'received'
                }`}
                // onMouseEnter={() => handelMouseEnter(index)}
                // onMouseLeave={handelMouseLeave}
              >
                {msg.type === 'image' ? (
                  <div className='msg-container'>
                    <img className='gif-msg' src={msg?.content} alt='GIF' />
                  </div>
                ) : (
                  <div className='msg-container'>
                    <span
                      className={
                        msg.content === 'Message deleted'
                          ? 'msg-deleted'
                          : 'msg-content'
                      }
                    >
                      {msg?.content}
                    </span>
                  </div>
                )}
                <span className='timestamp'>
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
          <form className='msg-input' onSubmit={(e) => handelSendMsg(e)}>
            <div className='multimedia-container'>
              <Emojis onSelectEmoji={handleEmojiSelect} />
              <Giphy onSelectGif={handleGifSelect} />
            </div>
            <input
              className='chat-msg-input'
              type='text'
              placeholder='Type a message...'
              value={msgContent}
              onChange={handleInputChange}
            />
            <input type='submit' value='Send' />
          </form>
        </>
      ) : (
        <section className='welcome-chatroom'>
          <div className='logo-without-word-container'>
            <img
              src={require('../assets/imgs/Logo-without-word.png')}
              alt='logo'
              className='logo-without-word'
            ></img>
          </div>

          <div className='welcome-content'>
            <h1 className='welcome'>Welcome to WuZZapp</h1>
            <p className='app-gist'>
              Start chatting with your friends and family, or unlock a world of
              amusement by conversing with our creative AI bots!
            </p>
            <TextingSVG className='text-welcome-svg' />
            <p className='login-or-signup'>
              To get started, please{' '}
              <Link to='/login' className='login-signup-link'>
                log in
              </Link>{' '}
              or{' '}
              <Link to='/login' className='login-signup-link'>
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
