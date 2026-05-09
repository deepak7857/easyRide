import React from 'react'
import carlogo from "../assets/uber_car_logo.png";
import motologo from "../assets/Uber_Moto.webp";
import autologo from "../assets/Uber_Auto.webp"
const VehiclePanel = (props) => {
  return (
    <div>
       <h5 onClick={()=>{
          props.setVehiclePanelOpen(false)
         }}
        className="p-1 text-center top-0 absolute w-full "><i className="p-10 text-3xl ri-arrow-down-wide-line"></i></h5>
        <h3 className="text-2xl font-semibold mb-5">Choose a Vehicle</h3>
           {/* car */}
        <div 
        onClick={()=>{
          props.setVehiclePanelOpen(false)
          props.setConformRidePanel(true)
           props.selectVehicleType("car"); 
         }}
        
        
        className="flex border-2 mb-2 active:border-black rounded-xl items-center w-full p-3  justify-between">
          <img className="h-10" src={carlogo} alt="car_logo" />

          <div className=" w-1/2">
            <h4 className="font-medium text-lg ">
              EASYGO
              <span>
                <i className="ri-user-3-fill"></i>4
              </span>
            </h4>
            <h5 className="font-medium text-sm ">2 mins away</h5>
            <p className="text-gray-600 font-normal text-xs">
              Affordable, compact rides
            </p>
          </div>
          <h2 className="text-2xl font-semibold">₹{props.fare.car}</h2>
        </div>
        {/* bike */}
        <div
         onClick={()=>{
          props.setVehiclePanelOpen(false)
          props.setConformRidePanel(true)
          props.selectVehicleType("bike");
         }}
         className="flex border-2 mb-2 active:border-black rounded-xl items-center w-full p-3  justify-between">
          <img className="h-10" src={motologo} alt="moto_logo" />

          <div className="  w-1/2">
            <h4 className="font-medium text-lg ">
EASYGO              <span>
                <i className="ri-user-3-fill"></i>1
              </span>
            </h4>
            <h5 className="font-medium text-sm ">5 mins away</h5>
            <p className="text-gray-600 font-normal text-xs">
              Affordable, compact rides
            </p>
          </div>
          <h2 className="text-2xl font-semibold">₹{props.fare.bike}</h2>
        </div>
          {/* auto */}

        <div 
        onClick={()=>{
          props.setVehiclePanelOpen(false)
          props.setConformRidePanel(true)
          props.selectVehicleType("auto");
         }}
        
        
        className="flex border-2 mb-2 active:border-black rounded-xl items-center w-full p-3  justify-between">
          <img className="h-10" src={autologo} alt="car_logo" />

          <div className=" w-1/2">
            <h4 className="font-medium text-lg ">
              EASYGO
              <span>
                <i className="ri-user-3-fill"></i>3
              </span>
            </h4>
            <h5 className="font-medium text-sm ">9 mins away</h5>
            <p className="text-gray-600 font-normal text-xs">
              Affordable, compact rides
            </p>
          </div>
          <h2 className="text-2xl font-semibold">₹{props.fare.auto}</h2>
        </div>

    </div>
  )
}

export default VehiclePanel
