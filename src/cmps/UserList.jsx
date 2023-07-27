import React from 'react'
import { useEffect, useState } from 'react'
import { UserPreview } from './UserPreview'
import { useSelector } from 'react-redux'
import { CSSTransition} from 'react-transition-group'
import { useAutoAnimate } from '@formkit/auto-animate/react'


export function UserList({ filterBy, onRemoveUser, onSelectContact }) {
  const users = useSelector((storeState) => storeState.userModule.users)

  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

  const [filteredUsers, setFilteredUsers] = useState([])


  const filterUsers = (users, filterBy, loggedInUser) => {
    const regexPattern = new RegExp(filterBy, 'i')
    return users?.filter((user) => {
      const isUserInContacts =
        loggedInUser?.contacts &&
        loggedInUser.contacts.some((contact) => contact._id === user._id)
  
      return (
        loggedInUser &&
        isUserInContacts &&
        user._id !== loggedInUser._id &&
        (regexPattern.test(user.fullName) ||
          user.msgs.some((msg) => regexPattern.test(msg.content)))
      )
    })
  }

  useEffect(() => {
    const filteredUsers = filterUsers(users, filterBy, loggedInUser)

    filteredUsers?.sort((a, b) => {
      const aMsgs = a.msgs
      const bMsgs = b.msgs

      const aLastMsgTimestamp = aMsgs?.[aMsgs.length - 1]?.timestamp
      const bLastMsgTimestamp = bMsgs?.[bMsgs.length - 1]?.timestamp

      return bLastMsgTimestamp - aLastMsgTimestamp
    })

    setFilteredUsers(filteredUsers)
  }, [filterBy, users, loggedInUser])

  const [animationParent] = useAutoAnimate()

  return (
    <section className='user-list simple-cards-grid' ref={animationParent}>
      {filteredUsers?.map((user) => (
        <CSSTransition
          key={user._id}
          timeout={300}
          classNames='contact-preview'
        >
          <UserPreview
            user={user}
            onRemoveUser={onRemoveUser}
            onSelectContact={() => onSelectContact(user._id)}
          />
        </CSSTransition>
      ))}
    </section>
  )
}
