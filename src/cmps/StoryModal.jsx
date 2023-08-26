import React from 'react'

export function StoryModal({ user }) {
  return (
    // sould be user.story and map to fisplay a list
    <div className='story-modal'>{user.username}</div>
  )
}
