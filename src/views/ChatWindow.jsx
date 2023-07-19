import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { robotService } from '../services/robot.service'

export function ChatWindow({ robotId }) {
  const [robot, setRobot] = useState(null)
  const navigate = useNavigate()

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

  const messages = [
    'Hello, how are you?',
    "I'm doing well, thank you!",
    'How about you?',
    "I'm good, thanks for asking!",
  ]

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
            className={`chat-message ${index % 2 === 0 ? 'received' : 'sent'}`}
          >
            <div className='message-container'>
              <span>{message}</span>
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
