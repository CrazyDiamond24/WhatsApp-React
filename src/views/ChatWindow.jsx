import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMsg } from '../store/actions/user.actions'
import { Emojis } from '../cmps/Emojis'
import { ReactComponent as TextingSVG } from '../assets/imgs/texting.svg'

export function ChatWindow() {
  const [msgContent, setMsgContent] = useState('')
  const messagesContainerRef = useRef(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

  const user = useSelector((storeState) => {
    return storeState.userModule.selectedUser
  })

  const messages = user
    ? user.msgs
        .filter(
          (msg) =>
            (msg.senderId === loggedInUser?._id &&
              msg.recipientId === user._id) ||
            (msg.senderId === user._id && msg.recipientId === loggedInUser?._id)
        )
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    : []

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  //TODO: move to service later with actual functionality
  function getAutoResponse() {
    const responses = [
      "Hello, welcome to our app! I can't say anything else.",
      'Hi there! How can I assist you today?',
      'Greetings! Feel free to ask me anything.',
      'Hey! Nice to see you here. How can I help?',
      "Welcome! I'm here to answer your questions.",
    ]

    const randomIndex = Math.floor(Math.random() * responses.length)
    return responses[randomIndex]
  }

  function handelSendMsg(e) {
    e.preventDefault()
    if (!loggedInUser) return
    setMsgContent('')
    //parameters: content, recipient, sender
    dispatch(addMsg(msgContent, user._id, loggedInUser._id))

    //hardcoded - ready for real use
    if (user.username === 'john.doe' || 'jane.smith' || 'emily.brown') {
      setTimeout(() => {
        const autoMessage = getAutoResponse()
        dispatch(addMsg(autoMessage, loggedInUser._id, user._id))
      }, 1000)
    }
  }

  function handelInputChange(e) {
    setMsgContent(e.target.value)
  }

  function handleEmojiSelect(emoji) {
    setMsgContent((prevMsg) => prevMsg + emoji)
  }

  const getTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  function onBack() {
    navigate('/')
  }
  console.log('messages', messages)

  return (
    <div className="chat-window">
      {user ? (
        <>
          <div className="header-area">
            <img src={user?.img} alt={user?.username} />
            <h2>{user?.fullName}</h2>
            <Link to="/login">Login</Link>
          </div>

          <ul className="conversation-container" ref={messagesContainerRef}>
            {messages?.map((message, index) => (
              <li
                key={index}
                className={`chat-message ${
                  message.senderId === loggedInUser?._id ? 'sent' : 'received'
                }`}
              >
                <div className="message-container">
                  <span>{message?.content}</span>
                </div>
                <span className="timestamp">
                  {getTimestamp(message.timestamp)}
                </span>
              </li>
            ))}
          </ul>

          <form className="message-input" onSubmit={(e) => handelSendMsg(e)}>
            <Emojis onSelectEmoji={handleEmojiSelect} />
            <input
              type="text"
              placeholder="Type a message..."
              value={msgContent}
              onChange={handelInputChange}
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
