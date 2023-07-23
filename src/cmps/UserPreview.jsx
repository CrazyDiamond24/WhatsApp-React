
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrUser } from '../store/actions/user.actions'

export function UserPreview({ user }) {
  const dispatch = useDispatch()

  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

  const lastMsg = user.msgs.filter(
    (msg) =>
      msg.senderId === loggedInUser._id || msg.recipientId === loggedInUser._id
  )

  const lastMsgContent =
    lastMsg.length > 0
      ? lastMsg[lastMsg.length - 1].type !== 'image'
        ? lastMsg[lastMsg.length - 1].content
        : '🖼️ Shared an Image'
      : 'Start a new conversation'

  function handleClick() {
    console.log('hi')
    console.log('user._id', user._id)
    dispatch(setCurrUser(user._id))
  }

  return (
    <article className='contact-preview' onClick={handleClick}>
      <img
        className='contact-preview-image'
        src={user.img}
        alt={user.fullName}
      />
      <div className='contact-preview-info'>
        <h2>{user.fullName}</h2>
        <h3 style={{ fontStyle: lastMsgContent === '🖼️ Shared an Image' ? 'italic' : 'normal' }}>
          {lastMsgContent}
        </h3>
      </div>
    </article>
  )
}


/* <section className='actions'>
<button onClick={() => onRemoveUser(user._id)}>X</button>
<Link to={`/user/edit/${user._id}`}>Edit</Link>
</section> */
