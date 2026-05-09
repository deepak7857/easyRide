import React from "react";

import carlogo from "../assets/uber_car_logo.png";

const LookingForDriver = (props) => {
  return (
    <div>
      <h5
        onClick={() => {
          if (props.resetRidePanels) {
            props.resetRidePanels();
            return;
          }
          props.setActiveRidePanel?.(null);
          props.setVehicleFound(false);
          props.setConformRidePanel?.(false);
          props.setVehiclePanelOpen?.(false);
          props.setWaitingForDriver?.(false);
        }}
        className="p-1 text-center top-0 absolute w-full "
      >
        <i className="p-10 text-3xl ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">
        Looking For a Nearby Drivers{" "}
      </h3>
      <div className="flex justify-between  flex-col items-center">
        <img className="h-13 w-1/2 -mt-7" src={carlogo} alt="car_logo" />
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">24/05-A</h3>
              <p className="text-sm text-gray-600 -mt-1">
                {props.Pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 ">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">01/2-B</h3>
              <p className="text-sm text-gray-600 -mt-1">
                {props.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.fare?.[props.vehicleType] ?? '-'}</h3>
              <p className="text-sm text-gray-600 -mt-1">Cash Cash</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-center">
        <p className="text-sm text-gray-700 font-medium">Ride requested</p>
        <p className="text-xs text-gray-500 mt-1">Waiting for a captain to accept your trip.</p>
      </div>
    </div>
  );
};

export default LookingForDriver;
