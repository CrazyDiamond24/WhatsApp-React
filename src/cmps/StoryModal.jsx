import React, { useState, useEffect } from 'react'

export function StoryModal({ user, closeStoryModal }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          if (currentStoryIndex < user?.story?.length - 1) {
            setCurrentStoryIndex((prevIndex) => prevIndex + 1)
            return 0
          }
          clearInterval(progressInterval)
          closeStoryModal()
          return prevProgress
        }
        return prevProgress + 1
      })
    }, 70)

    return () => clearInterval(progressInterval)
  }, [currentStoryIndex])

  function nextStory() {
    if (currentStoryIndex < user?.story?.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
      setProgress(0)
    } else {
      closeStoryModal()
    }
  }

  function prevStory() {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
      setProgress(0)
    }
  }

  return (
    <div className="story-modal">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      <button onClick={prevStory} className="arrow-button left">
        ←
      </button>
      <button onClick={closeStoryModal} className="close-button">
        x
      </button>
      <img className="story-img" src={user?.story?.[currentStoryIndex]?.url} />
      <button onClick={nextStory} className="arrow-button right">
        →
      </button>
    </div>
  )
}
