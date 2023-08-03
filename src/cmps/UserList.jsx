import React from 'react'
import { useEffect, useState } from 'react'
import { UserPreview } from './UserPreview'
import { useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { userService } from '../services/user.service'

export function UserList({ filterBy, onRemoveUser }) {
  const [filteredUsers, setFilteredUsers] = useState([])

  const users = useSelector((storeState) => storeState.userModule.users)
  const loggedInUser = useSelector(
    (storeState) => storeState.userModule.loggedInUser
  )

  const [animationParent] = useAutoAnimate()

  useEffect(() => {
    const filteredUsers = filterUsers(users, filterBy, loggedInUser)
    setFilteredUsers(filteredUsers)
  }, [filterBy, users, loggedInUser])

  function filterUsers(users, filterBy, loggedInUser) {
    return userService.getFilteredUsers(users, filterBy, loggedInUser)
  }

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
