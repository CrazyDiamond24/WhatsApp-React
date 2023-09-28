import React, { useState, useEffect } from 'react'
import { FontPick } from './svgs/FontPick'

export function FontFamily({ onSelectFontFamily, initialShowDropdown = false }) {
  const [fontFamily, setFontFamily] = useState(
    'Verdana, Geneva, Tahoma, sans-serif'
  )
  const [showDropdown, setShowDropdown] = useState(initialShowDropdown)
  const dropdownRef = React.useRef(null)

  useEffect(() => {
    setShowDropdown(initialShowDropdown)
  }, [initialShowDropdown])

  function handleChange(e) {
    setFontFamily(e.target.value)
    onSelectFontFamily(e.target.value)
  }

  function toggleDropdown() {
    if (!initialShowDropdown) {
      setShowDropdown(!showDropdown)
    }
  }

  useEffect(() => {
    if (!initialShowDropdown) {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowDropdown(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [initialShowDropdown])

  return (
    <div className='font-container' ref={dropdownRef}>
      <label htmlFor='fontFamily' onClick={toggleDropdown}>
        <FontPick className='font-pick-icon' />
      </label>
      {showDropdown && (
        <select
          className='font-select-dropdown'
          id='fontFamily'
          value={fontFamily}
          onChange={handleChange}
        >
          <option value='marrieweather'>Marrieweather</option>
          <option value='gloria-hallelujah'>Gloria Hallelujah</option>
          <option value='caveat'>Caveat</option>
          <option value='tangerine'>Tangerine</option>
          <option value='Verdana, Geneva, Tahoma, sans-serif'>Verdana</option>
        </select>
      )}
    </div>
  )
}
