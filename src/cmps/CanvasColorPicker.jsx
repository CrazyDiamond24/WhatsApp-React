import React, { useState } from 'react'

export function CanvasColorPicker({
  onColorSelect,
  onWidthSelect,
  show,
  important,
}) {
  const colors = [
    '#8d6e63',
    '#d500f9',
    '#00b0ff',
    '#00c853',
    '#ffbc00',
    '#ff5252',
    '#296660',
    '#4e342e',
    '#8e24aa',
    '#01579b',
    '#558b2f',
    '#ee8100',
    '#a52714',
    '#000',
    '#1de9b6',
    '#7c4dff',
    '#304ffe',
    '#aeea00',
    '#ff6e40',
    '#ff4081',
    '#90a4ae',
    '#b2dfdb',
    '#d1c4e9',
    '#9fa8da',
    '#f0f4c3',
    '#ffccbc',
    '#f8bbd0',
    '#cfd8dc',
  ]
  const [selectedColor, setSelectedColor] = useState(null)

  function handleColorClick(color) {
    setSelectedColor(color)
    if (onColorSelect) {
      onColorSelect(color)
    }
  }

  function handleWidthClick(width) {
    if (onWidthSelect) {
      onWidthSelect(width)
    }
  }
  return (
    <div
      className={`color-picker-canvas-overlay ${important ? 'important' : ''}`}
    >
      <div className='color-canvas-picker'>
        {colors.map((color, index) => (
          <div
            title={color === '#296660' ? 'Default' : undefined}
            className='color-canvas'
            key={index}
            style={{
              backgroundColor: color,
              border: color === selectedColor ? '2px solid black' : 'none',
            }}
            onClick={() => handleColorClick(color)}
          ></div>
        ))}
      </div>
      {show && (
        <>
          <div className='line'></div>
          <div className='line-size-container'>
            <div onClick={() => handleWidthClick(44)} className='one'></div>
            <div onClick={() => handleWidthClick(32)} className='two'></div>
            <div onClick={() => handleWidthClick(25)} className='three'></div>
            <div onClick={() => handleWidthClick(20)} className='four'></div>
            <div onClick={() => handleWidthClick(18)} className='five'></div>
            <div onClick={() => handleWidthClick(15)} className='six'></div>
            <div onClick={() => handleWidthClick(10)} className='seven'></div>
            <div onClick={() => handleWidthClick(5)} className='eight'></div>
          </div>
        </>
      )}
    </div>
  )
}
