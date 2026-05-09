import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProtectWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [captain, setCaptain] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/user/login');
      return;
    }

    // API request for profile information
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCaptain(response.data.user);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching user profile', err);
        localStorage.removeItem('token');
        navigate('/user/login');
      });
  }, [token, navigate]); // Added `navigate` to dependencies

  // Optionally return a loading spinner or something similar if still loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
