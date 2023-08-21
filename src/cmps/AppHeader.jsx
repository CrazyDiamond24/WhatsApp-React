import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { useState } from 'react'
import { UserPref } from './UserPref'
import { doLogout } from '../store/actions/user.actions'

export function AppHeader({ showProfile, openWelcomeChat }) {
  const [showModal, setShowModal] = useState(false)
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)
  console.log('user', user)
  const dispatch = useDispatch()

  console.log('app header com,ponent renderred')

  function showPrefsModal() {
    setShowModal(!showModal)
  }
  function hancleClosePrefModal() {
    setShowModal(false)
  }

  function handelLogout() {
    dispatch(doLogout(user._id))
  }

  return (
    <header
      className="app-header"
      style={{ backgroundColor: user?.userPref?.headerBgColor }}
    >
      {/* <span
        onClick={showPrefsModal}
        dangerouslySetInnerHTML={{
          __html: getSpotifySvg('plusWhatsapp'),
        }}
      ></span> */}
      <button onClick={showPrefsModal}>customize</button>
      <section className="user-header">
        {user ? (
          <div className="user-info-header">
            {user.img ? (
              <>
                <div className="user-actions-header">
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
      {showModal && <UserPref closePrefModal={hancleClosePrefModal} />} 
    </header>
  )
}
