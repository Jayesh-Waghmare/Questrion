import { useClerk, useUser } from '@clerk/clerk-react'
import { FileText, House, LogOut } from 'lucide-react'
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/pdf', label: 'Chat with PDF', Icon: FileText },
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()
  const navigate = useNavigate()

  const handleNav = (to) => (e) => {
    e.preventDefault()
    navigate(to)
    setSidebar(false)
  }

  return (
    <>
      {/* Drawer */}
      <div className={`w-64 border-r border-white/10 flex flex-col justify-between items-center h-full
        sm:static sm:translate-x-0
        max-sm:fixed max-sm:left-0 max-sm:right-auto max-sm:top-14 max-sm:bottom-0
        ${sidebar ? 'max-sm:translate-x-0' : 'max-sm:-translate-x-full'}
        transition-transform duration-300 ease-in-out z-40
        bg-gradient-to-b from-teal-950 via-cyan-950 to-sky-900  text-white`}>
        <div className='my-7 w-full'>
          <img src={user.imageUrl} alt="User avatar" className='w-12 rounded-full mx-auto'/>
          <h1 className='mt-1 text-center'>{user.fullName}</h1>
          <div className='px-6 mt-5 text-sm text-gray-300/80 font-medium'>
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/ai'}
                onClick={handleNav(to)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 flex items-center gap-3 rounded ${isActive ? 'bg-gradient-to-bl from-blue-900 to-emerald-700      text-white' : 'hover:bg-white/5'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/80'}`} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        <div className='w-full border-t border-white/10 p-4 px-7 flex items-center justify-between'>
          <div onClick={openUserProfile} className='flex gap-2 items-center cursor-pointer'>
            <img src={user.imageUrl} className='w-8 rounded-full' alt=""/>
            <div><h1 className='text-sm font-medium'>{user.fullName}</h1></div>
          </div>
          <LogOut onClick={signOut} className='w-5 text-white/80 hover:text-white transition cursor-pointer'/>
        </div>
      </div>

      {/*Navbar for mobile */}
      {sidebar && (
        <div
          className='fixed left-0 right-0 bottom-0 top-14 bg-black/40 z-30'
          onClick={() => setSidebar(false)}
        />
      )}
    </>
  )
}

export default Sidebar