import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import './assets/scss/global.scss'
import { UserIndex } from './views/UserIndex'
import { About } from './views/About'
import { UserDetails } from './views/UserDetails'
import { UserEdit } from './views/UserEdit'
import { ChatWindow } from './views/ChatWindow'

function App() {
  return (
    <Router>
      <section className='main-app'>
        <main className='container'>
          <Routes>
            <Route path='/' element={<UserIndex isDark={true} />} />
            <Route path='/user/edit/:id?' element={<UserEdit />} />
            <Route path='/about' element={<About />} />
          </Routes>
        </main>
      </section>
    </Router>
  )
}

export default App
