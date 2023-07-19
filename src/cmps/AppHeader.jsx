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

  const { name } = loggedInUser
  return (
    <header className='app-header'>
      <section className='container'>
        <h1 className='logo'>Contacts</h1>

        <section className='user-header'>
          <p>Welcome, {name}</p>
        </section>
      </section>
    </header>
  )
}
