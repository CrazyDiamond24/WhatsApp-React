import React, { useState } from 'react'

export function FontFamily({ onSelectFontFamily }) {
  const [fontFamily, setFontFamily] = useState(
    'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif'
  )

  function handleChange(e) {
    setFontFamily(e.target.value)
    onSelectFontFamily(e.target.value)
  }

  return (
    <div>
      <label htmlFor="fontFamily">Font Family: </label>
      <select id="fontFamily" value={fontFamily} onChange={handleChange}>
        <option value="fantasy">Fantasy</option>
        <option value="Verdana, Geneva, Tahoma, sans-serif">Verdana</option>
        <option value="Cambria, Cochin, Georgia, Times, 'Times New Roman', serif">
          Cambria
        </option>
        <option value="Arial, Helvetica, sans-serif">Arial</option>
        <option value="Georgia, Times New Roman, Times, serif">Georgia</option>
      </select>
    </div>
  )
}
