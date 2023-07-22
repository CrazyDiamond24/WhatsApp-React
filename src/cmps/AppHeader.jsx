import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'

export function AppHeader(props) {
  const navigate = useNavigate()

  const loggedInUser = useSelector((storeState) => {
    return storeState.authModule.loggedInUser
  })

  function onBack() {
    navigate(-1)
  }

  const { fullname, img, username } = loggedInUser
  return (
    <header className="app-header">
      <section className="user-header">
        <img src={img} alt={username}></img>
        <p>Welcome, {fullname}!</p>
      </section>
    </header>
  )
}
