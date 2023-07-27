import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import LogoWithoutWord from '../assets/imgs/Logo-without-word.png'

export function AppHeader({ showProfile }) {
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)

  return (
    <header className="app-header">
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
    </header>
  )
}
