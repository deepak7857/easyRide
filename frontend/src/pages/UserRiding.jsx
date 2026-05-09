import React, { useState } from 'react'
import carlogo from "../assets/uber_car_logo.png";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RideLiveTracking from '../Components/RideLiveTracking'
import axios from 'axios'


function UserRiding() {
        const location = useLocation()
        const navigate = useNavigate()
        const ride = location.state?.ride
        const [isProcessing, setIsProcessing] = useState(false)

        const handlePayment = async () => {
          try {
            setIsProcessing(true)
            // Process payment (placeholder - actual payment would go here)
            console.log("Processing payment for ride:", ride._id)
            
            // For now, just navigate back to home
            // In a real app, you'd integrate with a payment gateway (Razorpay, Stripe, etc.)
            setTimeout(() => {
              alert(`Payment of ₹${ride.fare} completed successfully!`)
              navigate('/user/home')
            }, 1000)
          } catch (error) {
            console.error("Payment error:", error)
            alert("Payment failed. Please try again.")
            setIsProcessing(false)
          }
        }

  return (
    <div className='h-screen'>
    <Link to='/user/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
        <i className="text-lg font-medium ri-home-5-line"></i>
    </Link>
    <div className='h-1/2'>
        <RideLiveTracking ride={ride} showCaptainLocation={true} showUserLocation={true} />
    </div>
    <div className='h-1/2 p-4'>
        <div className='flex items-center justify-between'>
            <img className='h-12' src={carlogo} alt="" />
            <div className='text-right'>
                <h2 className='text-lg font-medium capitalize'>{ride?.captain?.fullName?.firstName} {ride?.captain?.fullName?.lastName}</h2>
                <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain?.vehicle?.plate}</h4>
                <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>

            </div>
        </div>

        <div className='flex gap-2 justify-between flex-col items-center'>
            <div className='w-full mt-5'>

                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="text-lg ri-map-pin-2-fill"></i>
                    <div>
                        <h3 className='text-lg font-medium'>562/11-A</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{ride?.destination}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3'>
                    <i className="ri-currency-line"></i>
                    <div>
                        <h3 className='text-lg font-medium'>₹{ride?.fare} </h3>
                        <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                    </div>
                </div>
            </div>
        </div>
        <button 
          onClick={handlePayment}
          disabled={isProcessing}
          className='w-full mt-5 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-semibold p-2 rounded-lg transition'>
          {isProcessing ? 'Processing Payment...' : 'Make a Payment'}
        </button>
    </div>
</div>
  )
}

export default UserRiding
