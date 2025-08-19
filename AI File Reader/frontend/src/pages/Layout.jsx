import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { SignIn, useUser } from '@clerk/clerk-react'
import { assets } from '../assets/assets'
import Sidebar from '../components/Sidebar'

const Layout = () => {

  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const {user} = useUser()

  return user ? (
  <div className='h-screen flex flex-col overflow-hidden bg-neo text-white'>
    {/* Fixed Navbar */}
    <nav className='fixed top-0 left-0 right-0 z-30 w-full px-8 h-14 flex items-center justify-between border-b border-white/10 glass'>
      <img src={assets.image} alt="" className='w-12 sm:w-12 cursor-pointer transform scale-170' onClick={()=> navigate('/')}/>
      { sidebar ? <X onClick={()=> setSidebar(false)} className='w-6 h-6 text-gray-200 sm:hidden cursor-pointer'/> : <Menu onClick={()=> setSidebar(true)} className='w-6 h-6 text-gray-200 sm:hidden cursor-pointer'/> }
    </nav>

    {/* Main Content Area */}
    <div className='pt-14 flex h-full min-h-0 text-white'>
      <Sidebar sidebar={sidebar} setSidebar={setSidebar}/>
      <div className='flex-1 min-h-0 overflow-hidden'>
        {/* For Nested Routes */}
        <Outlet />
      </div>
    </div>
  </div>
) : (
    <div className='flex items-center justify-center h-screen'>
      <SignIn />
    </div>
  )
}

export default Layout