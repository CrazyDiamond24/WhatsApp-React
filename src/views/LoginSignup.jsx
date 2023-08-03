import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { doSignup, doLogin } from '../store/actions/user.actions'
export function LoginSignup() {
  const [hasAccount, setHasAccount] = useState(true)
  const [signupCred, setSignupCred] = useState({
    username: '',
    password: '',
    fullName: '',
    img: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg',
    msgs: [],
    contacts: [],
    status: '',
    groups: [],
    story: [],
  })

  const loginError = useSelector(
    (storeState) => storeState.userModule.loginError
  )

  const navigate = useNavigate()
  const dispatch = useDispatch()

  function handleToggle() {
    setHasAccount((prevHasAccount) => !prevHasAccount)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (hasAccount) {
      dispatch(doLogin(signupCred))
      navigate('/')
    } else {
      if (!signupCred.fullName || !signupCred.password || !signupCred.username)
        return
      dispatch(doSignup(signupCred))
      navigate('/')
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
                value={signupCred.fullName}
                onChange={(e) =>
                  setSignupCred({ ...signupCred, fullName: e.target.value })
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
          {loginError && hasAccount && (
            <div className="error-msg">{loginError}</div>
          )}
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
