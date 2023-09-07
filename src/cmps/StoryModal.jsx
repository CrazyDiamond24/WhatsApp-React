import React, { useState, useEffect } from 'react'

export function StoryModal({ user, closeStoryModal }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [progressInterval, setProgressInterval] = useState(null)

  useEffect(() => {
    startProgress()

    return () => clearInterval(progressInterval)
  }, [])

  useEffect(() => {
    setProgress(0)
    startProgress()
  }, [currentStoryIndex])

  function startProgress() {
    setProgressInterval((prevInterval) => {
      clearInterval(prevInterval)
      return setInterval(() => {
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
    })
  }

  function handleMouseDown() {
    clearInterval(progressInterval)
  }

  function handleMouseUp() {
    startProgress()
  }
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
    <div
      className="story-modal"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
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
