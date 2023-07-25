import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMsg } from '../store/actions/user.actions'
import { Emojis } from '../cmps/Emojis'
import { ReactComponent as TextingSVG } from '../assets/imgs/texting.svg'
import { MsgOptions } from '../cmps/MsgOptions'
import { Giphy } from '../cmps/Giphy'
import { useAutoAnimate } from '@formkit/auto-animate/react'

export function ChatWindow() {
  const [msgContent, setMsgContent] = useState("")
  const [isHovered, setIsHovered] = useState(null)
  const [sentGifs, setSentGifs] = useState([])

  const dispatch = useDispatch()

  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

  const user = useSelector((storeState) => {
    return storeState.userModule.selectedUser
  })

  const msgs = user
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
    const container = document.querySelector('.conversation-container')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [msgs])

  //TODO: move to service later with actual functionality
  function getAutoResponse() {
    const responses = [
      "Hello, welcome to our app! I can't say anything else.",
      "Hi there! How can I assist you today?",
      "Greetings! Feel free to ask me anything.",
      "Hey! Nice to see you here. How can I help?",
      "Welcome! I'm here to answer your questions.",
    ]

    const randomIndex = Math.floor(Math.random() * responses.length)
    return responses[randomIndex]
  }

  function handelSendMsg(e) {
    console.log(loggedInUser , 'after everything')
    e.preventDefault()
    if (!loggedInUser) return
    setMsgContent("")
    //parameters: content, recipient, sender
    dispatch(addMsg(msgContent, user._id, loggedInUser._id))

    //hardcoded - ready for real use
    if (user.username) {
      setTimeout(() => {
        const autoMsg = getAutoResponse()
        dispatch(addMsg(autoMsg, loggedInUser._id, user._id))
      }, 1000)
    }
  }

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
    const newGif = gifImgUrl
    
    setSentGifs((prevSentGifs) => [...prevSentGifs, newGif])
    dispatch(addMsg(newGif, user._id, loggedInUser._id, "image"))
  }

  const getTimestamp = (timestamp) => {
  
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  const [animationParent] = useAutoAnimate()
  return (
    <div className='chat-window' ref={animationParent}>
      {user ? (
        <>
          <div className="header-area">
            <img src={user?.img} alt={user?.username} />
            <h2>{user?.fullName}</h2>
          </div>
          <ul className='conversation-container flex' ref={animationParent}>
            {msgs?.map((msg, index) => (
              <li
                key={index}
                className={`chat-msg ${
                  msg.senderId === loggedInUser?._id ? "sent" : "received"
                }`}
                onMouseEnter={() => handelMouseEnter(index)}
                onMouseLeave={handelMouseLeave}
              >
                {msg.type === "image" ? (
                  <div className="msg-container">
                    <img className="gif-msg" src={msg?.content} alt="GIF" />
                  </div>
                ) : (
                  <div className="msg-container">
                    <span>{msg?.content}</span>
                  </div>
                )}
                <span className="timestamp">
                  {getTimestamp(msg.timestamp)}
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
            <div className='multimedia-container'>
            <Emojis onSelectEmoji={handleEmojiSelect} />
            <Giphy onSelectGif={handleGifSelect} />
            </div>
            <input
            className='chat-msg-input'
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
              src={require("../assets/imgs/Logo-without-word.png")}
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
              To get started, please{" "}
              <Link to="/login" className="login-signup-link">
                log in
              </Link>{" "}
              or{" "}
              <Link to="/login" className="login-signup-link">
                sign up
              </Link>{" "}
              if you don't have an account.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
