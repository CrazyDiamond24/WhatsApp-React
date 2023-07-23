import { useEffect, useState } from 'react'
import { UserPreview } from './UserPreview'
import { useSelector } from 'react-redux'

export function UserList({ filterBy, onRemoveUser, onSelectContact }) {
  const users = useSelector((storeState) => storeState.userModule.users)
  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

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

  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    const filteredUsers = filterUsers(users, filterBy, loggedInUser)
    setFilteredUsers(filteredUsers)
  }, [filterBy, users, loggedInUser])

  return (
    <section className='user-list simple-cards-grid'>
      {filteredUsers?.map((user) => (
        <UserPreview
          key={user._id}
          user={user}
          onRemoveUser={onRemoveUser}
          onSelectContact={() => onSelectContact(user._id)}
        />
      ))}
    </section>
  )
}
