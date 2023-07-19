import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import './assets/scss/global.scss'
import { RobotIndex } from './views/RobotIndex'
import { About } from './views/About'
import { RobotDetails } from './views/RobotDetails'
import { RobotEdit } from './views/RobotEdit'
import { ChatWindow } from './views/ChatWindow'

function App() {
  return (
    <Router>
      <section className='main-app'>
        <main className='container'>
          <Routes>
            <Route path='/' element={<RobotIndex isDark={true} />} />
            <Route path='/robot/edit/:id?' element={<RobotEdit />} />
            <Route path='/about' element={<About />} />
          </Routes>
        </main>
      </section>
    </Router>
  )
}

export default App
