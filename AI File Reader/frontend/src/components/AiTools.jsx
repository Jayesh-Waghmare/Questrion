import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'

const AiTools = () => {

    const navigate = useNavigate()
    const {user} = useUser()
    const {openSignIn} = useClerk()
 
  return (
    <div className='px-4 sm:px-20 xl:px-32 my-24'>
      <div className='text-center'>
        <h2 className='text-3xl sm:text-5xl md:text-4xl 2xl:text-7xl mx-auto leading-[1.2] text-white font-semibold p-3'>How Questrion Works for You</h2>
        <p className='text-gray-400 max-w-lg mx-auto text-md'>Upload any PDF like technical docs, manuals, contracts, or notes and get instant, accurate answers powered by AI. 
    No more endless scrolling. Just ask, and Questrion finds the answer for you.</p>
      </div>

      <div className='flex flex-wrap mt-10 justify-center'>
        {AiToolsData.map((tool, index)=>(
            <div key={index} className='p-8 m-4 max-w-xs rounded-lg bg-white shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer'
            onClick={() => user ? navigate(tool.path) : openSignIn()}>
                <tool.Icon className='w-12 h-12 p-3 text-white rounded-xl' style={{background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`}}/>
                <h3 className='mt-6 mb-3 text-lg text-black font-semibold'>{tool.title}</h3>
                <p className='text-black text-sm max-w-[95%]'>{tool.description}</p>
            </div>
        ))}
      </div>
    </div>
  )
}

export default AiTools
