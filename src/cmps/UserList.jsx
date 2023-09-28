import React, { useEffect, useState } from 'react'
import { UserPreview } from './UserPreview'
import { useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { userService } from '../services/user.service'
import { storageService } from '../services/storage.service'

const getInitialState = () => ({
  lastClickedTimestamps: storageService.load('lastClickedTimestamps') || {},
  unreadCounts: storageService.load('unreadCounts') || {},
  sessionStartTime: storageService.load('sessionStartTime') || Date.now(),
})

export function UserList({ filterBy, onRemoveUser, openUserChat, toggleDisplay }) {
  const [filteredUsers, setFilteredUsers] = useState([])
  const [activeContactId, setActiveContactId] = useState(null)
  const [state, setState] = useState(getInitialState)

  const users = useSelector((storeState) => storeState.userModule.users)
  const loggedInUser = useSelector(
    (storeState) => storeState.userModule.loggedInUser
  )
  const [animationParent] = useAutoAnimate()
  const { unreadCounts, sessionStartTime } = state

  useEffect(() => {
    storageService.store('sessionStartTime', sessionStartTime)
  }, [sessionStartTime])

  useEffect(() => {
    const newState = computeNewState(users, filterBy, loggedInUser, state)
    setState(newState)
  }, [filterBy, users, loggedInUser])

  function computeNewState(users, filterBy, loggedInUser, state) {
    const filteredUsers = filterUsers(users, filterBy, loggedInUser)
    setFilteredUsers(filteredUsers)

    const newUnreadCounts = { ...unreadCounts }

    filteredUsers?.forEach((user) => {
      const lastClickedTimestamp =
        state.lastClickedTimestamps[user._id] || state.sessionStartTime

      let unreadCount = user.msgs?.filter(
        (msg) =>
          msg.senderId !== loggedInUser._id &&
          msg.timestamp > lastClickedTimestamp
      ).length

      newUnreadCounts[user._id] = unreadCount
    })

    storageService.store('unreadCounts', newUnreadCounts)

    return {
      ...state,
      lastClickedTimestamps: state.lastClickedTimestamps,
      unreadCounts: newUnreadCounts,
    }
  }

  function handleContactClick(contactId) {
    const updatedState = {
      ...state,
      lastClickedTimestamps: {
        ...state.lastClickedTimestamps,
        [contactId]: Date.now(),
      },
      unreadCounts: {
        ...state.unreadCounts,
        [contactId]: 0,
      },
      
    }

    storageService.store(
      'lastClickedTimestamps',
      updatedState.lastClickedTimestamps
    )
    setState(updatedState)
    setActiveContactId(contactId)
    openUserChat(contactId)
    toggleDisplay()
  }

  function filterUsers(users, filterBy, loggedInUser) {
    return userService.getFilteredUsers(users, filterBy, loggedInUser)
  }
  
  return (
    <section className="user-list" ref={animationParent}>
      {filteredUsers?.map((user) => {
        const unreadCount = unreadCounts[user._id] || 0

        return (
          <CSSTransition
            key={user?._id}
            timeout={300}
            classNames="contact-preview"
            
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
