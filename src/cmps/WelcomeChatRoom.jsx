import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReactComponent as TextingSVG } from '../assets/imgs/texting.svg'
import { Link } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { doLogin } from '../store/actions/user.actions'
export function WelcomeChatRoom() {
  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

  const dispatch = useDispatch()

  function continueAsGuest() {
    dispatch(
      doLogin({
        username: 'guest',
        password: '3256dsaht8eh4e433$%4#$3$',
        fullName: 'guest',
        img: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg',
        status: 'guest mode',
        story: [],
        groups: [],
        contacts: [],
        msgs: [],
        userPref: {
          fontSize: 16,
          fontColor: '#000000',
          headerBgColor: '#ffffff',
          fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
          backgroundImage: '',
        },
      })
    )
  }

  return (
    <section className='welcome-chatroom'>
      <div className='logo-without-word-container'>
        <img
          src='https://res.cloudinary.com/dmox9pnnx/image/upload/v1691422190/Logo-without-word_hoknvz.png'
          alt='logo'
          className='logo-without-word'
        ></img>
      </div>

      <div className='welcome-content'>
        <h1 className='welcome'>Welcome to WuZZapp</h1>
        <p className='app-gist'>
          Start chatting with your friends and family, or unlock a world of
          amusement by conversing with our creative AI bots!
        </p>
        <TextingSVG className='text-welcome-svg' />
        {loggedInUser ? (
          <p>Welcome back!</p>
        ) : (
          <p className='login-or-signup'>
            To get started, please{' '}
            <Link to='/login' className='login-signup-link'>
              log in
            </Link>{' '}
            or{' '}
            <Link to='/login' className='login-signup-link'>
              sign up
            </Link>
            . If you don't have an account, you can{' '}
            <a className='guest-link' onClick={continueAsGuest}>
              continue as a guest
            </a>
            .
          </p>
        )}
      </div>
    </section>
  )
}
