const RidePopUp = ({
  ride,
  setRidePopupPanel,
  setConfirmRidePopupPanel,
  confirmRide
}) => {
  if (!ride) return null;

  return (
    <div className="p-4">
      {/* Close Icon */}
      <h5
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => setRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      {/* Title */}
      <h3 className="text-2xl font-semibold mb-5">New Ride Available!</h3>

      {/* Passenger + Distance */}
      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={ride.passengerAvatar || "https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"}
            alt={ride.passengerName}
          />
          <h2 className="text-lg font-medium capitalize">
            {ride?.user?.fullName?.firstName} {ride?.user?.fullName?.lastName}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">6 KM</h5>
      </div>

      {/* Ride Details */}
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          {/* Pickup */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{ride?.Pickup}</h3>
              <p className="text-sm -mt-1 text-gray-600">gms</p>
            </div>
          </div>
          {/* Drop */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{ride?.destination}</h3>
              <p className="text-sm -mt-1 text-gray-600">destination Landmark</p>
            </div>
          </div>
          {/* Fare */}
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 w-full">
          <button
            type="button" // prevent accidental form submission
            onClick={confirmRide}
            className="bg-green-600 w-full text-white font-semibold p-2 px-10 rounded-lg"
          >
            Accept
          </button>

          <button
            type="button"
            onClick={() => setRidePopupPanel(false)}
            className="mt-2 w-full bg-gray-300 text-gray-700 font-semibold p-2 px-10 rounded-lg"
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  )
}

export default RidePopUp
