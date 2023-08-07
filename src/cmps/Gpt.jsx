import React, { useState } from 'react'
import { userService } from '../services/user.service'

export function Gpt() {
  const [value, setValue] = useState('')

  function handleInput(event) {
    setValue(event.target.value)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const res = userService.askChatGpt(value)
    console.log('res', res)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={value} onChange={handleInput} />
        <button type="submit">send</button>
      </form>
    </div>
  )
}
