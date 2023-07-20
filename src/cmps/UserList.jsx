import { memo } from 'react'
import { UserPreview } from './UserPreview'
function _UserList({ users, onRemoveUser, onSelectContact }) {
  console.log('USER LIST RENDERED')
  return (
    <section className='user-list simple-cards-grid'>
      {users.map((user) => (
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

export const UserList = memo(_UserList)
