import React, { useState,useContext } from 'react'
import {Link} from 'react-router-dom'
import { UserDataContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const UserLogin=  ()=> {
  const [email,setEmail]=useState('');
  const [Password,setPassword]=useState('');
  const [userdata,setUserdata]=useState('');
  const { user, setUser } = useContext(UserDataContext)
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate()

  const handleSubmit= async(e)=>{
    e.preventDefault();
    const userData={
      email:email,
      password:Password
    }
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, userData);
    if (response.status === 200) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('userToken', data.token)
      navigate('/user/home')
    }
    if (response.status === 401) {
      setErrorMessage('Invalid credentials. Please check your username or password.');
    } else if (!response.ok) {
      setErrorMessage('An error occurred. Please try again later.');
    } else {
     
      setErrorMessage(''); 
      console.log('Login successful!');
    }
    setPassword('');
    setEmail('');
    setErrorMessage('');

    
  }
  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
      <div className='text-[20px] font-semibold w-16 ml-6 m-2 text-black '>EasyDrive</div>
      <form onSubmit={(e)=>{
        
        handleSubmit(e);
      }}>
      <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder='Email-id'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <input
            required
           value={Password}
           onChange={(e)=>setPassword(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="pasword"
            placeholder='Password'
          />
         <button
            className='bg-[#111] text-white font-semibold mb-3 rounded-full px-4 py-2  w-full text-lg placeholder:text-base'
          >Login</button>
          
      </form>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <p className='text-center'>New here? <Link to='/user/signup' className='text-blue-600'>Create new Account</Link></p>
     
      </div>
      <div>
        <Link
          to='/captain/login'
          className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-full px-4 py-2  text-lg placeholder:text-base'
        >Sign in as Captain</Link>
      </div>
    </div>
  )
}

export default UserLogin
