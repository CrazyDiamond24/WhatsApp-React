import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { doSignup } from '../store/actions/auth.actions'
export function LoginSignup() {
  const [hasAccount, setHasAccount] = useState(true)
  const [signupCred, setSignupCred] = useState({
    username: '',
    password: '',
    fullname: '',
    imgUrl:
      'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg',
    msgs: [1],
    contacts: [],
    status: '',
    groups: [],
    story: [],
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleToggle = () => {
    setHasAccount((prevHasAccount) => !prevHasAccount)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (hasAccount) {
      console.log('Logging in...', signupCred)
    } else {
      if (!signupCred.fullname || !signupCred.password || !signupCred.username)
        return
      dispatch(doSignup(signupCred))
      navigate('/')

      console.log('Signing up...', signupCred)
    }
  }

  return (
    <div className="login-signup-container">
      <div className="form-container">
        <h2>{hasAccount ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!hasAccount && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={signupCred.fullname}
                onChange={(e) =>
                  setSignupCred({ ...signupCred, fullname: e.target.value })
                }
                required
              />
            </div>
          )}
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={signupCred.username}
              onChange={(e) =>
                setSignupCred({ ...signupCred, username: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={signupCred.password}
              onChange={(e) =>
                setSignupCred({ ...signupCred, password: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <button type="submit">{hasAccount ? 'Login' : 'Sign Up'}</button>
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
