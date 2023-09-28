import React, { useState, useEffect, useRef } from 'react';
import { StoryNextArrow } from './svgs/StoryNextArrow';

export function StoryModal({ user, closeStoryModal }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('flip-in');
    const timer = setTimeout(() => setAnimationClass(''), 1000);
    return () => clearTimeout(timer);
  }, [currentStoryIndex]);

  useEffect(() => {
    startProgress();
    return () => clearInterval(progressInterval.current);
  }, []);

  useEffect(() => {
    setProgress(0);
    startProgress();
  }, [currentStoryIndex]);

  function startProgress() {
    clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          if (currentStoryIndex < user?.story?.length - 1) {
            setCurrentStoryIndex((prevIndex) => prevIndex + 1);
            return 0;
          }
          clearInterval(progressInterval.current);
          closeStoryModal();
          return prevProgress;
        }
        return prevProgress + 1;
      });
    }, 75);
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

  const handleMouseMove = (event) => {
    const rect = event.target.getBoundingClientRect()
    const x = event.clientX - rect.left //x position within the element.
    const width = rect.right - rect.left
    const half = width / 2

    if (x > half) {
      // Cursor is on the right side
      event.target.style.transform = 'perspective(500px) rotateY(20deg)'
    } else {
      // Cursor is on the left side
      event.target.style.transform = 'perspective(500px) rotateY(-20deg)'
    }
  }

  const skewImage = (direction) => {
    const imgElement = document.querySelector('.story-img')
    if (direction === 'right') {
      imgElement.style.transform = 'perspective(500px) rotateY(20deg)'
    } else if (direction === 'left') {
      imgElement.style.transform = 'perspective(500px) rotateY(-20deg)'
    }
  }

  const resetImage = () => {
    const imgElement = document.querySelector('.story-img')
    imgElement.style.transform = 'none'
  }

  return (
    <div
      className='story-modal'
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className='progress-bar' style={{ width: `${progress}%` }}></div>
      <button
        onClick={prevStory}
        className='arrow-button left'
        title='Previous'
        onMouseEnter={() => skewImage('left')}
        onMouseLeave={resetImage}
      >
        <StoryNextArrow />
      </button>
      <button title='Close' onClick={closeStoryModal} className='close-button'>
        x
      </button>
      <img
        className={`story-img ${animationClass}`}
        src={user?.story?.[currentStoryIndex]?.url}
      />
      <button
        onClick={nextStory}
        className='arrow-button right'
        title='Next'
        onMouseEnter={() => skewImage('right')}
        onMouseLeave={resetImage}
      >
        <StoryNextArrow />
      </button>
    </div>
  )
}
