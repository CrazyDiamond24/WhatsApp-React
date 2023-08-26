import React, { useState } from 'react'
import { getSpotifySvg } from '../services/SVG.service'


export function ImagePicker({ onSelectImage }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const images = [
    'https://www.gstatic.com/keep/backgrounds/celebration_light_thumb_0715.svg',
    'https://www.gstatic.com/keep/backgrounds/video_light_thumb_0615.svg',
    'https://www.gstatic.com/keep/backgrounds/travel_light_thumb_0615.svg',
    'https://www.gstatic.com/keep/backgrounds/places_light_thumb_0615.svg',
    'https://www.gstatic.com/keep/backgrounds/notes_light_thumb_0615.svg',
    'https://www.gstatic.com/keep/backgrounds/recipe_light_thumb_0615.svg',
    'https://www.gstatic.com/keep/backgrounds/music_light_thumb_0615.svg',
    'https://www.gstatic.com/keep/backgrounds/food_light_thumb_0615.svg',
    'https://www.gstatic.com/keep/backgrounds/grocery_light_thumb_0615.svg',
  ]

  const handleImageClick = (image) => {
    setSelectedImage(image);
    onSelectImage(image);
  }

  return (
    <div className="image-picker-overlay">
      <h3>Pick a Background Theme:</h3>
      <div className="image-picker">
        {images.map((image, index) => (
          <img
            className={`image ${selectedImage === image ? 'selected' : ''}`}
            key={index}
            src={image}
            onClick={() => handleImageClick(image)}
          />
        ))}
        <div title="Default" onClick={() => handleImageClick(null)} className="no-img-icon">
          <span
            dangerouslySetInnerHTML={{
              __html: getSpotifySvg('noImg'),
            }}
          ></span>
        </div>
      </div>
    </div>
  )
}
