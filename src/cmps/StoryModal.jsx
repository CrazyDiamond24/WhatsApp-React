import React from 'react'

export function StoryModal({ user }) {
  return (
    // sould be user.story and map to display a list
    <div className='story-modal'>{user.story[0]}</div>
  )
}
