import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMsg } from '../store/actions/user.actions'
import {Emojis} from '../cmps/Emojis'

export function ChatWindow() {
  const [msgContent, setMsgContent] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

  const user = useSelector((storeState) => {
    return storeState.userModule.selectedUser
  })

  function handelSendMsg(e) {
    e.preventDefault()
    dispatch(addMsg(msgContent, user._id))
    setMsgContent('')
  }

  function handelInputChange(e) {
    setMsgContent(e.target.value)
  }

  function handleEmojiSelect(emoji){
    setMsgContent(prevMsg => prevMsg + emoji)
  }

  function onBack() {
    navigate('/')
  }

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

  if (!user) return <h2>Select a user to chat</h2>

  return (
    <div className='chat-window'>
      <div className='header-area'>
        <img src={user?.img} alt={user?.username} />
        <h2>{user?.fullName}</h2>
        <Link to='/login'>Login</Link>
      </div>

      <ul className='conversation-container'>
        {messages?.map((message, index) => (
          <li
            key={index}
            className={`chat-message ${
              message.senderId === loggedInUser?._id ? 'sent' : 'received'
            }`}
          >
            <div className='message-container'>
              <span>{message?.content}</span>
            </div>
          </li>
        ))}
      </ul>

      <form className='message-input' onSubmit={(e) => handelSendMsg(e)}>
      <Emojis onSelectEmoji={handleEmojiSelect}/> 
        <input
          type='text'
          placeholder='Type a message...'
          value={msgContent}
          onChange={handelInputChange}
        />
        <input type='submit' value='Send' />
      </form>
    </div>
  )
}
