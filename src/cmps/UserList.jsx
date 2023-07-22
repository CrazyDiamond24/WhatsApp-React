<<<<<<< HEAD
import { UserPreview } from './UserPreview'
export function UserList({ users, onRemoveUser, onSelectContact }) {  
=======
import { useEffect, useState } from "react"
import { UserPreview } from "./UserPreview"
import { useSelector } from "react-redux"

export function UserList({ filterBy, onRemoveUser, onSelectContact }) {
  const [filteredUsers, setFilteredUsers] = useState([])
  const users = useSelector((storeState) => storeState.userModule.users)

  useEffect(() => {
    const filteredUsers = filterUsers(users, filterBy)
    setFilteredUsers(filteredUsers)
  }, [filterBy, users])

  const filterUsers = (users, filterBy) => {
    const regexPattern = new RegExp(filterBy, "i")
    return users?.filter((user) => {
      return (
        regexPattern.test(user.fullName) ||
        user.msgs.some((msg) => regexPattern.test(msg.content))
      )
    })
  }
>>>>>>> cda4b3f548106ad1ee6fd0ad2e3a586c6a673201
  return (
    <section className="user-list simple-cards-grid">
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
