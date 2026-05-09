import React, { useState, useRef, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../Components/CaptainDetails'
import RidePopUp from '../Components/RidePopUp' 
import ConfirmRidePopUp from '../Components/ConfirmRidePopUp'
import { CaptainDataContext } from '../context/CaptainContext'
import { SocketContext } from '../context/SocketContext'
import axios from 'axios'
import { useGSAP } from "@gsap/react"
import gsap from 'gsap'

function CaptainHome() {
  const [ride, setRide] = useState(null)
  const [ridePopupPanel, setRidePopupPanel] = useState(false)
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

  const ridePopupPanelRef = useRef(null)
  const confirmRidePopupPanelRef = useRef(null)
  const { captain } = useContext(CaptainDataContext)
  const { socket } = useContext(SocketContext)

  // 🔹 Handle socket + location updates
  useEffect(() => {
    if (!captain?._id || !socket) return

    socket.emit('join', {
      userId: captain._id,
      userType: 'captain'
    })

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          socket.emit('update-location-captain', {
            userId: captain._id,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        })
      }
    }

    const locationInterval = setInterval(updateLocation, 10000)
    updateLocation()
    // 🔹 New Ride listener
    const handleNewRide = (data) => {
      console.log('Received new-ride socket event:', data);
      setRide(data);
      setRidePopupPanel(true);
    };

    socket.on("new-ride", handleNewRide);

    // Ensure server knows this socket id for the captain on connect/reconnect
    const emitJoin = () => {
      if (!captain?._id) return;
      console.log('Emitting join for captain:', captain._id);
      socket.emit('join', {
        userId: captain._id,
        userType: 'captain'
      });
    };

    socket.on('connect', emitJoin);
    // If already connected, emit immediately
    if (socket.connected) emitJoin();

  // ✅ Cleanup
  return () => {
    clearInterval(locationInterval);
    socket.off("new-ride", handleNewRide);
    socket.off('connect', emitJoin);
  };
}, [captain?._id, socket]);
  // 🔹 Confirm ride API
  async function confirmRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/rides/confirmRide`,
        { rideId: ride._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // ✅ use same key everywhere
          }
        }
      )
     
      if (response.status === 200) {
        setRide(response.data)
        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)
      }
    } catch (err) {
      console.error("Confirm ride error:", err)
    }
  }

  // 🔹 GSAP Animations
  useGSAP(() => {
    gsap.to(ridePopupPanelRef.current, {
      transform: ridePopupPanel ? 'translateY(0)' : 'translateY(100%)'
    })
  }, [ridePopupPanel])

  useGSAP(() => {
    gsap.to(confirmRidePopupPanelRef.current, {
      transform: confirmRidePopupPanel ? 'translateY(0)' : 'translateY(100%)'
    })
  }, [confirmRidePopupPanel])

  return (
    <div className="h-screen">
      {/* Header */}
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <h2 className="text-2xl font-bold">EasyDrive</h2>
        <Link
          to="/captain/home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Banner */}
      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Banner"
        />
      </div>

      {/* Captain Details */}
      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>

      {/* Ride Popup */}
      {/* <div ref={ridePopupPanelRef} className="fixed w-full z-10 bottom-0 bg-white px-3 py-10 pt-12"> */}
        <div
  ref={ridePopupPanelRef}
  className={`fixed w-full z-10 bottom-0 bg-white px-3 py-10 pt-12 transition-transform duration-300 ${
    ridePopupPanel ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"
  }`}
>
        {ridePopupPanel &&<RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />}
      </div>

      {/* Confirm Ride Popup */}
      <div ref={confirmRidePopupPanelRef} className="fixed w-full h-screen z-20 bottom-0 bg-white px-3 py-10 pt-12">
        
         <div
          className={`h-full transition-transform duration-300 ${
            confirmRidePopupPanel ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none'
          }`}
         >
          {confirmRidePopupPanel && (
            <ConfirmRidePopUp
              ride={ride}
              setConfirmRidePopupPanel={setConfirmRidePopupPanel}
              setRidePopupPanel={setRidePopupPanel}
            />
          )}
         </div>
      </div>
    </div>
  )
}

export default CaptainHome
