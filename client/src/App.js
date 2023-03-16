import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'

const App = () => (
  <Routes>
    <Route exact path='/login' element={<Login />} />
    <Route exact path='/signup' element={<Signup />} />
    <Route exact path='/' element={<Home />} />
  </Routes>
)

export default App
