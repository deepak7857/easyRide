import React from 'react'
import { Link } from 'react-router-dom'

import HomeB from '../assets/Home_page.avif';
function Start() {
  return (
    <div>
      <div className=' bg-cover bg-center h-screen pt-8 flex justify-between flex-col w-full ' style={{ backgroundImage: `url(${HomeB})` }} >
        
        <div className='text-[20px] font-semibold w-16 ml-6 m-2 text-black '>EasyDrive</div>
       

      <div className='bg-white pb-8 py-4 px-4'>

      <h2 className='text-[30px] font-semibold'>Get Start With EasyDrive</h2>
      <Link to="/user/login"className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5'>Continue</Link>
      </div>
      </div>
    </div>
  )
}

export default Start
