import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import Pdf from './pages/Pdf'
import {Toaster} from 'react-hot-toast'

const App = () => {

  return (
    <div className='min-h-screen bg-neo text-white'>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/ai' element={<Layout />}>
          {/* Nested Routes */}
          <Route index element={<Dashboard />}/>
          <Route path='pdf' element={<Pdf />}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
