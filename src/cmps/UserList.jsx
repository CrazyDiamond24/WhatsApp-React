import { UserPreview } from './UserPreview'
export function UserList({ users, onRemoveUser, onSelectContact }) {
  console.log('USER LIST RENDERED')
  return (
    <section className="user-list simple-cards-grid">
      {users?.map((user) => (
        <UserPreview
          key={user?._id}
          user={user}
          onRemoveUser={onRemoveUser}
          onSelectContact={() => onSelectContact(user._id)}
        />
      ))}
    </section>
  )
}
