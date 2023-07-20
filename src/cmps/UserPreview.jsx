import React from 'react'

export function UserPreview({ user, onRemoveUser, onSelectContact }) {
  const handleClick = () => {
    onSelectContact()
  }

  return (
    <article className='contact-preview' onClick={handleClick}>
      <img
        className='contact-preview-image'
        src={user.img}
        alt={user.fullName}
      />
      <h2>{user.fullName}</h2>
    </article>
  )
}

/* <section className='actions'>
<button onClick={() => onRemoveUser(user._id)}>X</button>
<Link to={`/user/edit/${user._id}`}>Edit</Link>
</section> */
