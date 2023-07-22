import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import LogoWithoutWord from '../assets/imgs/Logo-without-word.png'

export function AppHeader(props) {
  const navigate = useNavigate()

  const user = useSelector((storeState) => storeState.userModule.loggedInUser)

  console.log('loggedinuser', user)

  function onBack() {
    navigate(-1)
  }

  return (
    <header className='app-header'>
      <section className='user-header'>
        <div className='user-info-header'>
          {user && user.img ? (
            <img src={user.img} alt={user.username} />
          ) : (
            <img
              src={LogoWithoutWord}
              alt='logo'
              className='logo-without-word'
            />
          )}
          <p>Profile | Settings </p>
        </div>
        <Link className='header-login' to='/login'>
          Login
        </Link>
      </section>
    </header>
  )
}
