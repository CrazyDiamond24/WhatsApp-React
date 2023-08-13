import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { useEffect, useState } from 'react'
import { UserPref } from './UserPref'
import { doLogout, updateLastSeen } from '../store/actions/user.actions'

export function AppHeader({ showProfile, openWelcomeChat }) {
  const [showModal, setShowModal] = useState(false)
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  function showPrefsModal() {
    setShowModal(!showModal)
  }

  function handelLogout() {
    dispatch(doLogout(user._id))
  }

  return (
    <header className="app-header">
      {/* <span
        onClick={showPrefsModal}
        dangerouslySetInnerHTML={{
          __html: getSpotifySvg('plusWhatsapp'),
        }}
      ></span> */}
      <section className="user-header">
        {user ? (
          <div className="user-info-header">
            {user.img ? (
              <>
              <div className='user-actions-header'>
                <img
                  onClick={showProfile}
                  src={user.img}
                  alt={user.username}
                  title="Profile"
                />
                <button onClick={handelLogout}>Logout</button>
                </div>
                <img
                  onClick={openWelcomeChat}
                  src="https://res.cloudinary.com/dmox9pnnx/image/upload/v1691422190/Logo-without-word_hoknvz.png"
                  alt="logo"
                  className="logo-without-word"
                />
                
              </>
            ) : (
              <img
                src="https://res.cloudinary.com/dmox9pnnx/image/upload/v1691422190/Logo-without-word_hoknvz.png"
                alt="logo"
                className="logo-without-word"
              />
            )}
          </div>
        ) : (
          <>
            <img
              src="https://res.cloudinary.com/dmox9pnnx/image/upload/v1691422190/Logo-without-word_hoknvz.png"
              alt="logo"
              className="logo-without-word"
            />
            
            <Link className="header-login" to="/login">
              Login
            </Link>
          </>
        )}
      </section>
      {showModal && <UserPref />} 
    </header>
  )
}
