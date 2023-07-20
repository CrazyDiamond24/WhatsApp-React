import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { userService } from '../services/user.service'
import { useSelector } from 'react-redux'

export function ChatWindow({ userId }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

  useEffect(() => {
    loadUser(userId)
  }, [userId])

  async function loadUser(userId) {
    try {
      const user = await userService.getById(userId)
      setUser(user)
    } catch (error) {
      console.log('error:', error)
    }
  }

  function onBack() {
    navigate('/')
  }

  const allMessages = user
    ? [...loggedInUser.msgs, ...user.msgs]
    : loggedInUser.msgs


  //TODO: Move the filtering and sorting to the backend later
  const messages = allMessages
    .filter(
      (msg) =>
        (msg.senderId === loggedInUser._id && msg.recipientId === userId) ||
        (msg.senderId === userId && msg.recipientId === loggedInUser._id)
    )
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  return (
    <div className='chat-window'>
      <div className='header-area'>
        {user && (
          <>
            <img src={user.img} alt={user.username} />
            <h2>{user.fullName}</h2>
          </>
        )}
        {!user && <h2>Loading user...</h2>}
      </div>

      <ul className='conversation-container'>
        {messages.map((message, index) => (
          <li
            key={index}
            className={`chat-message ${
              message.senderId === loggedInUser._id ? 'sent' : 'received'
            }`}
          >
            <div className='message-container'>
              <span>{message.content}</span>
            </div>
          </li>
        ))}
      </ul>

      <form className='message-input'>
        <input type='text' placeholder='Type a message...' />
        <input type='submit' value='Send' />
      </form>
    </div>
  )
}
