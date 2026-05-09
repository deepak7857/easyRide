import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';

const CaptainProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("captainToken") || localStorage.getItem("token");
  console.log("Token in CaptainProtectWrapper:", token);
  const {captain, setCaptain} = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/captain/login');
      return; // stop further execution
    }

    axios.get(`${import.meta.env.VITE_API_URL}/captain/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log("Auth response:", res);
      setCaptain(res.data.captain);
      setIsLoading(false);
    })
    .catch((err) => {
      console.error("Auth error:", err);
      setIsLoading(false);
      localStorage.removeItem("captainToken");
      localStorage.removeItem("token");
      navigate('/captain/login');
    });
  }, [token, navigate, setCaptain]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
};

export default CaptainProtectWrapper;
