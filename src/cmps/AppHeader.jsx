import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import LogoWithoutWord from '../assets/imgs/Logo-without-word.png'
import { getSpotifySvg } from '../services/SVG.service'
import { useEffect, useState } from 'react'
import { UserPref } from './UserPref'
import { doLogout, updateLastSeen } from '../store/actions/user.actions'

export function AppHeader({ showProfile }) {
  const [showModal, setShowModal] = useState(false)
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)
  const [editedUser, setEditedUser] = useState(user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function showPrefsModal() {
    setShowModal(!showModal)
  }

  useEffect(() => {
    if (editedUser) {
      dispatch(updateLastSeen(editedUser))
    }
  }, [editedUser, dispatch])

  function handelLogout() {
    setEditedUser((prevUser) => ({
      ...prevUser,
      lastSeen: Date.now(),
    }))
    navigate("/")
  }

  return (
    <header className="app-header">
      <button onClick={handelLogout}>Logout</button>
      <span
        onClick={showPrefsModal}
        dangerouslySetInnerHTML={{
          __html: getSpotifySvg('plusWhatsapp'),
        }}
      ></span>
      <section className="user-header">
        {user ? (
          <div className="user-info-header">
            {user.img ? (
              <>
                <img
                  onClick={showProfile}
                  src={user.img}
                  alt={user.username}
                  title="Profile"
                />
                <img
                  src={LogoWithoutWord}
                  alt="logo"
                  className="logo-without-word"
                />
              </>
            ) : (
              <img
                src={LogoWithoutWord}
                alt="logo"
                className="logo-without-word"
              />
            )}
          </div>
        ) : (
          <>
            <img
              src={LogoWithoutWord}
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
