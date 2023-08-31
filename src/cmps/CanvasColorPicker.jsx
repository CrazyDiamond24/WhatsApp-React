import React, { useState } from "react"

export function CanvasColorPicker({
  onColorSelect,
  onWidthSelect,
  show,
  important,
}) {
  const [selectedColor, setSelectedColor] = useState(null)
  const colors = [
    "#8d6e63",
    "#d500f9",
    "#00b0ff",
    "#00c853",
    "#ffbc00",
    "#ff5252",
    "#296660",
    "#4e342e",
    "#8e24aa",
    "#01579b",
    "#558b2f",
    "#ee8100",
    "#a52714",
    "#000",
    "#1de9b6",
    "#7c4dff",
    "#304ffe",
    "#aeea00",
    "#ff6e40",
    "#ff4081",
    "#90a4ae",
    "#b2dfdb",
    "#d1c4e9",
    "#9fa8da",
    "#f0f4c3",
    "#ffccbc",
    "#f8bbd0",
    "#cfd8dc",
  ]
  const widths = [44, 32, 25, 20, 18, 15, 10, 5]
  const classNames = ["one", "two", "three", "four", "five", "six", "seven", "eight"]

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
      className={`color-picker-canvas-overlay ${important ? "important" : ""}`}
    >
      <div className="color-canvas-picker">
        {colors.map((color, index) => (
          <div
            title={color === "#296660" ? "Default" : undefined}
            className="color-canvas"
            key={index}
            style={{
              backgroundColor: color,
              border: color === selectedColor ? "2px solid black" : "none",
            }}
            onClick={() => handleColorClick(color)}
          ></div>
        ))}
      </div>
      {show && (
        <>
          <div className="line">Font size</div>
          <span></span>
          <div className="line-size-container">
            {widths.map((width, index) => (
              <div
                key={index}
                onClick={() => handleWidthClick(width)}
                className={classNames[index]}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
