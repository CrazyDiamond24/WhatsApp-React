import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { robotService } from '../services/robot.service'
import { useSelector } from 'react-redux'

export function ChatWindow({ robotId }) {
  const [robot, setRobot] = useState(null)
  const navigate = useNavigate()

  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

  useEffect(() => {
    loadRobot(robotId)
  }, [robotId])

  async function loadRobot(robotId) {
    try {
      const robot = await robotService.getById(robotId)
      setRobot(robot)
    } catch (error) {
      console.log('error:', error)
    }
  }

  function onBack() {
    navigate('/')
  }

  const allMessages = robot
    ? [...loggedInUser.msgs, ...robot.msgs]
    : loggedInUser.msgs


  //TODO: Move the filtering and sorting to the backend later
  const messages = allMessages
    .filter(
      (msg) =>
        (msg.senderId === loggedInUser._id && msg.recipientId === robotId) ||
        (msg.senderId === robotId && msg.recipientId === loggedInUser._id)
    )
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  return (
    <div className='chat-window'>
      <div className='header-area'>
        {robot && (
          <>
            <img src={robot.img} alt={robot.username} />
            <h2>{robot.fullName}</h2>
          </>
        )}
        {!robot && <h2>Loading robot...</h2>}
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
