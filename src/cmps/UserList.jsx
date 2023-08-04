import React from 'react'
import { useEffect, useState } from 'react'
import { UserPreview } from './UserPreview'
import { useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { userService } from '../services/user.service'

export function UserList({ filterBy, onRemoveUser }) {
  const [filteredUsers, setFilteredUsers] = useState([])
  const [activeContactId, setActiveContactId] = useState(null)
  const [lastClickedTimestamps, setLastClickedTimestamps] = useState({})
  const [sessionStartTime] = useState(Date.now())

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

  function handleContactClick(contactId) {
    setActiveContactId(contactId)

    // Set the last clicked timestamp for this contact to now
    setLastClickedTimestamps({
      ...lastClickedTimestamps,
      [contactId]: Date.now(),
    })
  }
  return (
    <section className='user-list simple-cards-grid' ref={animationParent}>
      {filteredUsers?.map((user) => {
        // Use the last clicked timestamp or session start time for counting unread messages
        const lastClickedTimestamp =
          lastClickedTimestamps[user._id] || sessionStartTime
        const unreadCount = user.msgs?.filter(
          (msg) =>
            msg.senderId !== loggedInUser._id &&
            msg.timestamp > lastClickedTimestamp
        ).length

        return (
          <CSSTransition
            key={user?._id}
            timeout={300}
            classNames='contact-preview'
          >
            <UserPreview
              user={user}
              unreadCount={unreadCount}
              activeContactId={activeContactId}
              onContactClick={handleContactClick}
              onRemoveUser={onRemoveUser}
            />
          </CSSTransition>
        )
      })}
    </section>
  )
}
