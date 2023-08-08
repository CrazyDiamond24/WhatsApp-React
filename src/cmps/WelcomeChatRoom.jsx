import React from 'react'
import { useSelector } from 'react-redux'
import { ReactComponent as TextingSVG } from '../assets/imgs/texting.svg'
import { Link } from 'react-router-dom'

export function WelcomeChatRoom() {
  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })
  return (
    <section className="welcome-chatroom">
      <div className="logo-without-word-container">
        <img
          src="https://res.cloudinary.com/dmox9pnnx/image/upload/v1691422190/Logo-without-word_hoknvz.png"
          alt="logo"
          className="logo-without-word"
        ></img>
      </div>

      <div className="welcome-content">
        <h1 className="welcome">Welcome to WuZZapp</h1>
        <p className="app-gist">
          Start chatting with your friends and family, or unlock a world of
          amusement by conversing with our creative AI bots!
        </p>
        <TextingSVG className="text-welcome-svg" />
        {loggedInUser ? (
          <p>Welcome back!</p>
        ) : (
          <p className="login-or-signup">
            To get started, please{' '}
            <Link to="/login" className="login-signup-link">
              log in
            </Link>{' '}
            or{' '}
            <Link to="/signup" className="login-signup-link">
              sign up
            </Link>{' '}
            if you don't have an account.
          </p>
        )}
      </div>
    </section>
  )
}
