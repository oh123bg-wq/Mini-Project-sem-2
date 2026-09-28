import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Register from './pages/RegisterPage'
import Login from './pages/LoginPage'
import Home from './pages/HomePage'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
