import React, { useState,useContext } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import {CaptainDataContext} from '../context/CaptainContext'


const CaptainLogin=()=> {

    const [email,setEmail]=useState('');
    const [Password,setPassword]=useState('');
      const { captain,setCaptain } = React.useContext(CaptainDataContext)
      const navigate = useNavigate()
      const [errorMessage, setErrorMessage] = useState('');
    const handleSubmit= async(e)=>{
      e.preventDefault();
      const captain={
        email:email,
        password:Password
      }
        const response= await axios.post(`${import.meta.env.VITE_API_URL}/captain/login`,captain);
       console.log(response);
        if(response.status===200){
          const data=response.data
          setCaptain(data.captain);

          localStorage.setItem('captainToken',data.token)
          const token = localStorage.getItem("captainToken");
          console.log(captain,"captain data after login",token);
          navigate('/captain/home')
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
      
    }
  return( 
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
  <p className='text-center'>Join a fleet? <Link to='/captain/signup' className='text-blue-600'>Register as a Captain</Link></p>
 
  </div>
  <div>
    <Link
      to='/user/login'
      className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-full px-4 py-2  text-lg placeholder:text-base'
    >Sign in as user</Link>
  </div>
</div>
  )
}

export default CaptainLogin
