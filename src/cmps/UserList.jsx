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

  function filterUsers(users, filterBy, loggedInUser) {
    return userService.getFilteredUsers(users, filterBy, loggedInUser)
  }

  useEffect(() => {
    const filteredUsers = filterUsers(users, filterBy, loggedInUser)
    setFilteredUsers(filteredUsers)
  }, [filterBy, users, loggedInUser])

  const [animationParent] = useAutoAnimate()

  return (
    <section className="user-list simple-cards-grid" ref={animationParent}>
      {filteredUsers?.map((user) => (
        <CSSTransition
          key={user?._id}
          timeout={300}
          classNames="contact-preview"
        >
          <UserPreview user={user} onRemoveUser={onRemoveUser} />
        </CSSTransition>
      ))}
    </section>
  )
}
