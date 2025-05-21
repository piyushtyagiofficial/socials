import React from 'react'
import Logo from "../images/logo.jpg";
import { UilSearch } from '@iconscout/react-unicons'

const LogoSearch = () => {
  return (
    <div className='flex gap-3 items-center'>
      <img src={Logo} alt='logo' className='w-10 h-10' />
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <input
          type="text"
          placeholder="#Explore"
          className="bg-transparent border-none outline-none px-2 text-sm w-full"
        />
        <div className="flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-600 rounded-md p-2 text-white hover:cursor-pointer">
          <UilSearch />
        </div>
      </div>
    </div>
  )
}

export default LogoSearch
