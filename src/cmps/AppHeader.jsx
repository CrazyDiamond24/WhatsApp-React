import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ColorPick } from './svgs/ColorPick'
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
    <header className='app-header'>
      <section className='user-header'>
        {user ? (
          <div className='user-info-header'>
            {user.img && (
              <div className='user-actions-header'>
                <div className='img-and-picker-container'>
                  <img
                    onClick={showProfile}
                    src={user.img}
                    alt={user.username}
                    title='Profile'
                  />
                  <ColorPick
                    className='color-pick-header'
                    onClick={showPrefsModal}
                  />
                </div>

                <div className='logo-and-btn-container'>
                <button title='Logout' onClick={handelLogout}>
                    Logout
                  </button>
                  <img
                    onClick={openWelcomeChat}
                    src='https://res.cloudinary.com/dmox9pnnx/image/upload/v1691422190/Logo-without-word_hoknvz.png'
                    alt='logo'
                    className='logo-without-word'
                    title='Main Page'
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <img
              onClick={openWelcomeChat}
              src='https://res.cloudinary.com/dmox9pnnx/image/upload/v1691422190/Logo-without-word_hoknvz.png'
              alt='logo'
              className='logo-without-word'
            />
            <Link className='header-login' to='/login'>
              Login
            </Link>

            {/* <Link className="header-login" to="/speech">
              voice
            </Link> */}
          </>
        )}
      </section>
      {showModal && <UserPref closePrefModal={hancleClosePrefModal} />}
    </header>
  )
}
