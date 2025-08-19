import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { assets } from '../assets/assets'
import {useClerk, UserButton, useUser} from '@clerk/clerk-react'

const Navbar = () => {

    const navigate = useNavigate()
    const {user} = useUser()
    const {openSignIn} = useClerk()

  return (
    <div className='fixed z-20 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-10 xl:px-32'>
      <img src={assets.image} alt='logonew' className='w-6 sm:w-12 cursor-pointer transform scale-180' onClick={()=> navigate('/')}/>
      
      {
        user ? <UserButton /> 
        : 
        (
            <button onClick={openSignIn} className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-[#4285c3] hover:bg-[#1e5497] text-white px-10 py-2.5'>Login <ArrowRight className='w-4 h-4'/></button>
        )
      }

      </div>
  )
}

export default Navbar
