import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import tempMap from "../assets/temp_map.jpg";
import "remixicon/fonts/remixicon.css";
import LocationSearchpanel from "../Components/LocationSearchpanel";

import VehiclePanel from "../Components/VehiclePanel";
import ConformRide from "../Components/ConformRide";
import LookingForDriver from "../Components/LookingForDriver";
import WaitingForDriver from "../Components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { useContext } from "react";
import { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../Components/LiveTracking";
function UserHome() {
  const [Pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelOpenRef = useRef(null);
  const ConformRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [ConformRidePanel, setConformRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [activeRidePanel, setActiveRidePanel] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [ride, setRide] = useState(null);
  const [vehicleType, setVehicleType] = useState(null);

  const resetRidePanels = () => {
    setActiveRidePanel(null);
    setVehiclePanelOpen(false);
    setConformRidePanel(false);
    setVehicleFound(false);
    setWaitingForDriver(false);
  };

  const showVehicleSelection = () => {
    setActiveRidePanel("vehicle");
    setPanelOpen(false);
    setConformRidePanel(false);
    setVehicleFound(false);
    setWaitingForDriver(false);
    setVehiclePanelOpen(true);
  };

  const showConfirmRide = () => {
    setActiveRidePanel("confirm");
    setPanelOpen(false);
    setVehiclePanelOpen(false);
    setVehicleFound(false);
    setWaitingForDriver(false);
    setConformRidePanel(true);
  };

  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);
  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleRideConfirmed = (rideData) => {
      console.log("Received ride-confirmed:", rideData);
      setPanelOpen(false);
      setVehiclePanelOpen(false);
      setConformRidePanel(false);
      setVehicleFound(false);
      setActiveRidePanel("waiting");
      setWaitingForDriver(true);
      setRide(rideData);
    };

    const handleRideStarted = (rideData) => {
      console.log("Received ride-started:", rideData);
      setActiveRidePanel("riding");
      setWaitingForDriver(false);
      navigate("/user/riding", { state: { ride: rideData } });
    };

    const emitJoin = () => {
      socket.emit("join", { userType: "user", userId: user._id });
    };

    socket.on("connect", emitJoin);
    if (socket.connected) emitJoin();
    socket.on("ride-confirmed", handleRideConfirmed);
    socket.on("ride-started", handleRideStarted);

    return () => {
      socket.off("connect", emitJoin);
      socket.off("ride-confirmed", handleRideConfirmed);
      socket.off("ride-started", handleRideStarted);
    };
  }, [socket, user?._id, navigate]);

  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);
    if (!value || value.trim().length < 3) {
      setPickupSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/map/getsuggestions`,
        {
          params: { input: value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPickupSuggestions(response.data);
    } catch {
      // handle error
    }
  };
  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);
    if (!value || value.trim().length < 3) {
      setDestinationSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/map/getsuggestions`,
        {
          params: { input: value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setDestinationSuggestions(response.data);
      console.log(response.data);
    } catch {
      // handle error
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };
  useGSAP(
    function () {
      if (!panelRef.current || !panelCloseRef.current) return;
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );
  useGSAP(
    function () {
      if (!vehiclePanelOpenRef.current) return;
      if (vehiclePanelOpen) {
        gsap.to(vehiclePanelOpenRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelOpenRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanelOpen]
  );

  useGSAP(
    function () {
      if (!ConformRidePanelRef.current) return;
      if (ConformRidePanel) {
        gsap.to(ConformRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(ConformRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ConformRidePanel]
  );

  useGSAP(
    function () {
      if (!vehicleFoundRef.current) return;
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound]
  );
  useGSAP(
    function () {
      if (!waitingForDriverRef.current) return;
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver]
  );
  async function findTrip() {
    setVehiclePanelOpen(true);
    setActiveRidePanel("vehicle");
    setPanelOpen(false);
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/rides/ride-fair`,
      {
        params: { Pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setFare(response.data);
  }
  async function createRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/rides/create`,
      {
        Pickup,
        destination,
        vehicleType,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="text-[20px] font-semibold w-16  ml-6 m-2 text-black ">
        EasyDrive
      </div>
      <div className="h-screen w-screen">
        {/* image for temporary use  */}
        <LiveTracking />
      </div>
      <div className=" flex flex-col justify-end   h-screen absolute top-0 w-full ">
        <div className="bg-white p-6 h[30%] relative ">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 right-6 top-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>

          <h4 className="font-semibold text-2xl">Find a trip</h4>
          <form
            className="relative py-3"
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            
            
            <input
              onClick={() => {
                resetRidePanels();
                setPanelOpen(true);

                setActiveField("Pickup");
                console.log(Pickup);
              }}
              value={Pickup}
              onChange={handlePickupChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={() => {
                resetRidePanels();
                setPanelOpen(true);
                setActiveField("destination");
                console.log(destination);
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button
            onClick={findTrip}
            disabled={!Pickup || !destination} // disable until both filled
            className={`px-4 py-2 rounded-lg mt-3 w-full ${
              Pickup && destination
                ? "bg-black text-white cursor-pointer"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Find Trip
          </button>
        </div>
        <div ref={panelRef} className=" bg-white h-0  ">
          <LocationSearchpanel
            suggestions={
              activeField === "Pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
              setVehiclePanelOpen={showVehicleSelection}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
            setActiveField={setActiveField}
          />
        </div>
      </div>
      {activeRidePanel === "vehicle" && (
        <div
          ref={vehiclePanelOpenRef}
          className="fixed inset-x-0 bottom-0 z-20 bg-white px-3 py-6 w-full max-h-[75vh] overflow-y-auto shadow-2xl rounded-t-3xl"
        >
          <VehiclePanel
            setConformRidePanel={showConfirmRide}
            setVehiclePanelOpen={setVehiclePanelOpen}
            selectVehicleType={setVehicleType}
            fare={fare}
          />
        </div>
      )}

      {activeRidePanel === "confirm" && (
        <div
          ref={ConformRidePanelRef}
          className="fixed inset-x-0 bottom-0 z-20 bg-white px-3 py-6 w-full max-h-[75vh] overflow-y-auto shadow-2xl rounded-t-3xl"
        >
          <ConformRide
            setVehicleFound={setVehicleFound}
            setConformRidePanel={setConformRidePanel}
            setVehiclePanelOpen={setVehiclePanelOpen}
            setActiveRidePanel={setActiveRidePanel}
            createRide={createRide}
            Pickup={Pickup}
            fare={fare}
            vehicleType={vehicleType}
            destination={destination}
          />
        </div>
      )}

      {activeRidePanel === "searching" && (
        <div
          ref={vehicleFoundRef}
          className="fixed inset-x-0 bottom-0 z-20 bg-white px-3 py-6 w-full max-h-[75vh] overflow-y-auto shadow-2xl rounded-t-3xl"
        >
          <LookingForDriver
            createRide={createRide}
            Pickup={Pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setVehicleFound={setVehicleFound}
            setWaitingForDriver={setWaitingForDriver}
            setConformRidePanel={setConformRidePanel}
            setVehiclePanelOpen={setVehiclePanelOpen}
            resetRidePanels={resetRidePanels}
            setActiveRidePanel={setActiveRidePanel}
          />
        </div>
      )}

      {activeRidePanel === "waiting" && (
        <div
          ref={waitingForDriverRef}
          className="fixed inset-x-0 bottom-0 z-20 bg-white px-3 py-6 w-full max-h-[75vh] overflow-y-auto shadow-2xl rounded-t-3xl"
        >
          <WaitingForDriver
            setWaitingForDriver={setWaitingForDriver}
            waitingForDriver={waitingForDriver}
            ride={ride}
             setVehicleFound={setVehicleFound}
             setActiveRidePanel={setActiveRidePanel}
          />
        </div>
      )}
    </div>
  );
}

export default UserHome;
