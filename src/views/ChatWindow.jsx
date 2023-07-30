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
import { socketService } from '../services/socket.service'
import { msgService } from "../services/msg.service"

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

  const isUserBlocked = loggedInUser?.blockedContcats?.includes(user?._id)

  const msgs =
    user && !isUserBlocked
      ? msgService.filterMsgs(user,loggedInUser)
      : []

  useEffect(() => {
    const container = document.querySelector(".conversation-container")
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

  useEffect(() => {
    // Register the listener when the component mounts
    socketService.on('chat-add-msg', (msgContent) => {
      console.log(msgContent, 'this is msg data from cmp')
      // Dispatch the action to add the new message to your Redux store
      dispatch(
        addMsg(msgContent, loggedInUser?._id, user?._id)
      )
    })

    // Clean up the listener when the component unmounts
    return () => {
      socketService.off('chat-add-msg')
    }
  }, [dispatch])

  function handelSendMsg(e) {
    e.preventDefault()
    if (!loggedInUser) return
    setMsgContent('')
    
    socketService.emit('chat-set-topic', 'myChatRoom')
    //parameters: content, recipient, sender
    dispatch(addMsg(msgContent, user._id, loggedInUser._id))
    socketService.emit('chat-send-msg', msgContent)

    //hardcoded - ready for real use
    // if (user.username) {
    //   setTimeout(() => {
    //     const autoMsg = getAutoResponse()
    //     dispatch(addMsg(autoMsg, loggedInUser._id, user._id))
    //   }, 1000)
    // }
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

  const showTimestamp = (timestamp) => {
   return msgService.getTimestamp(timestamp)
  }

  const blockContact = () => {
    const action = isUserBlocked ? "UNBLOCK_USER" : "BLOCK_USER"
    dispatch(blockUnblockContact(action, user._id))
    console.log("block")
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
          </div>
          <ul className="conversation-container flex" ref={animationParent}>
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
                    <span
                      className={
                        msg.content === "Message deleted"
                          ? "msg-deleted"
                          : "msg-content"
                      }
                    >
                      {msg?.content}
                    </span>
                  </div>
                )}
                <span className="timestamp">{showTimestamp(msg.timestamp)}</span>
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
              <Emojis onSelectEmoji={handleEmojiSelect} />
              <Giphy onSelectGif={handleGifSelect} />
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
