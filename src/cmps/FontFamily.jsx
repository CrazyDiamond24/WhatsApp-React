import React, { useState, useEffect } from 'react'
import { FontPick } from './svgs/FontPick'

export function FontFamily({ onSelectFontFamily }) {
  const [fontFamily, setFontFamily] = useState(
    'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif'
  )
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = React.useRef(null)

  function handleChange(e) {
    setFontFamily(e.target.value)
    onSelectFontFamily(e.target.value)
  }

  function toggleDropdown() {
    setShowDropdown(!showDropdown)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={dropdownRef}>
      <label htmlFor="fontFamily" onClick={toggleDropdown}>
        <FontPick className='font-pick-icon' />
      </label>
      {showDropdown && (
        <select className='font-select-dropdown' id="fontFamily" value={fontFamily} onChange={handleChange}>
          <option value="fantasy">Fantasy</option>
          <option value="Verdana, Geneva, Tahoma, sans-serif">Verdana</option>
          <option value="Cambria, Cochin, Georgia, Times, 'Times New Roman', serif">
            Cambria
          </option>
          <option value="Arial, Helvetica, sans-serif">Arial</option>
          <option value="Georgia, Times New Roman, Times, serif">Georgia</option>
        </select>
      )}
    </div>
  )
}
