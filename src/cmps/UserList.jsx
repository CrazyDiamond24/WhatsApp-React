import React from 'react'
import { useEffect, useState } from 'react'
import { UserPreview } from './UserPreview'
import { useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { userService } from '../services/user.service'
import { socketService } from '../services/socket.service'

export function UserList({ filterBy, onRemoveUser }) {
  // console.log('user list rendered or rererenderedered')

  const users = useSelector((storeState) => storeState.userModule.users)

  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

  const [filteredUsers, setFilteredUsers] = useState([])

  const filterUsers = (users, filterBy, loggedInUser) => {
    return userService.getFilteredUsers(users, filterBy, loggedInUser)
  }

  useEffect(() => {
    const filteredUsers = filterUsers(users, filterBy, loggedInUser)
    setFilteredUsers(filteredUsers)
  }, [filterBy, users, loggedInUser])

  const setTopic = (senderId, recipientId) => {
    if (!senderId || !recipientId) return
    const ids = [senderId, recipientId].sort()
    const topic = `${ids[0]}-${ids[1]}` // Concatenate the sorted IDs
    console.log('Setting from list topic:', topic)
    socketService.emit('chat-set-topic', topic)
  }

// useEffect(() => {
//     // Handle received message
//     const handleReceivedMsg = (receivedMsg) => {
//       console.log('Received message', receivedMsg);

//       // Find the user in filteredUsers who sent this message
//       const userWhoSentMsg = filteredUsers.find(
//         (user) => user._id === receivedMsg.senderId && receivedMsg.recipientId === loggedInUser._id
//       );

//       if (userWhoSentMsg) {
//         // Set the chat topic using the sender and recipient IDs
//         setTopic(receivedMsg.senderId, receivedMsg.recipientId);
//       }
//     };

//     socketService.on('chat-add-msg', handleReceivedMsg);

//     return () => {
//       socketService.off('chat-add-msg', handleReceivedMsg);
//     };
//   }, [filteredUsers, loggedInUser]);

  const [animationParent] = useAutoAnimate()

  return (
    <section className='user-list simple-cards-grid' ref={animationParent}>
      {filteredUsers?.map((user) => (
        <CSSTransition
          key={user._id}
          timeout={300}
          classNames='contact-preview'
        >
          <UserPreview user={user} onRemoveUser={onRemoveUser} />
        </CSSTransition>
      ))}
    </section>
  )
}
