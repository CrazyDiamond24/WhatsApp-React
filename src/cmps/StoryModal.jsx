import React from 'react'

export function StoryModal({ user }) {
  return (
    <div className="story-modal">
      {user?.story?.map((storyItem, index) => (
        <div key={index}>
          <img src={storyItem.url} />
        </div>
      ))}
    </div>
  )
}
