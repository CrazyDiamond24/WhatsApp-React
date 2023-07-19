import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'

export function AppHeader(props) {
  const navigate = useNavigate()

  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

  function onBack() {
    navigate(-1)
  }

  const { fullName, img ,username } = loggedInUser
  return (
    <header className='app-header'>
  <section className='user-header'>
          <img src={img} alt={username}></img>
          <p>Welcome, {fullName}!</p>
        </section>
    </header>
  )
}
