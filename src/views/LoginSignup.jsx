import React, { useState } from 'react'


export function LoginSignup()  {
  const [hasAccount, setHasAccount] = useState(true)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleToggle = () => {
    setHasAccount((prevHasAccount) => !prevHasAccount)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (hasAccount) {
      // Handle login logic here
      console.log('Logging in...')
    } else {
      // Handle signup logic here
      console.log('Signing up...')
    }
  }

  return (
    <div className='login-signup-container'>
      <div className='form-container'>
        <h2>{hasAccount ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!hasAccount && (
            <div className='form-group'>
              <input
                type='text'
                placeholder='Full Name'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}
          <div className='form-group'>
            <input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <button type='submit'>{hasAccount ? 'Login' : 'Sign Up'}</button>
          </div>
        </form>
        <p onClick={handleToggle}>
          {hasAccount
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  )
}

