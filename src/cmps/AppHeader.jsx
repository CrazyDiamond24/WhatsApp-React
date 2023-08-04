import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import LogoWithoutWord from '../assets/imgs/Logo-without-word.png'
import { getSpotifySvg } from '../services/SVG.service'
import { useState } from 'react'
import { UserPref } from './UserPref'
export function AppHeader({ showProfile }) {
  const [showModal, setShowModal] = useState(false)
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)

  function showPrefsModal() {
    setShowModal(!showModal)
  }

  return (
    <header className="app-header">
      <span
        onClick={showPrefsModal}
        dangerouslySetInnerHTML={{
          __html: getSpotifySvg('plusWhatsapp'),
        }}
      ></span>
      <section className="user-header">
        <div className="user-info-header">
          {user && user.img ? (
            <img src={user.img} alt={user.username} />
          ) : (
            <img
              src={LogoWithoutWord}
              alt="logo"
              className="logo-without-word"
            />
          )}
          <p onClick={showProfile}>Profile | Settings </p>
        </div>
        <Link className="header-login" to="/login">
          Login
        </Link>
      </section>
      {showModal && <UserPref />}
    </header>
  )
}
