import React from 'react';

export function ChatWindow() {
  const messages = [
    "Hello, how are you?",
    "I'm doing well, thank you!",
    "How about you?",
    "I'm good, thanks for asking!"
  ];

  return (
    <div className='chat-window'>
      <div className='header-area'>
        <h2>Rania EC ET</h2>
      </div>
      
      <ul className='conversation-container'>
        {messages.map((message, index) => (
          <li key={index} className={`chat-message ${index % 2 === 0 ? 'received' : 'sent'}`}>
            <div className="message-container">
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

