import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/userContext';



const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);





  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setIsLoading(true); 

    const newUserData = {
      fullName: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
      email: email.trim(),
      password: password.trim(),
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, newUserData);

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('userToken', data.token)
        navigate('/user/home');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state
      setEmail('');
      setFirstName('');
      setLastName('');
      setPassword('');
    }
  };

  return (
    <div>
      <div className="p-7 h-screen flex flex-col justify-between">
        <div>
        <div className='text-[20px] font-semibold w-16 ml-6 m-2 text-black '>EasyDrive</div>

          <form onSubmit={handleSubmit}>
            <h3 className="text-lg w-1/2 font-medium mb-2">What's your name</h3>
            <div className="flex gap-4 mb-7">
              <input
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <h3 className="text-lg font-medium mb-2">What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              type="email"
              placeholder="email@example.com"
            />

            <h3 className="text-lg font-medium mb-2">Enter Password</h3>
            <input
              className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder="password"
            />

            {error && <p className="text-red-500 mb-3">{error}</p>}

            <button
              disabled={isLoading}
              className={`bg-[#111] text-white font-semibold mb-3 rounded-full px-4 py-2 w-full text-lg placeholder:text-base ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="text-center">
            Already have an account? <Link to="/user/login" className="text-blue-600">Login here</Link>
          </p>
        </div>
        <div>
          <p className="text-[10px] leading-tight">
            This site is protected by reCAPTCHA and the <span className="underline">Google Privacy
              Policy</span> and <span className="underline">Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
