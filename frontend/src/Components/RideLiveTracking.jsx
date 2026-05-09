import React, { useState, useEffect } from "react";
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 30.3083,
  lng: 78.0018,
};

function RideLiveTracking({ ride, showCaptainLocation = true, showUserLocation = true }) {
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [captainPosition, setCaptainPosition] = useState(null);
  const [directions, setDirections] = useState(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Update user's current location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition({
        lat: latitude,
        lng: longitude,
      });
    });

    const watchId = navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition({
        lat: latitude,
        lng: longitude,
      });
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Update every 10 seconds
  useEffect(() => {
    if (!navigator.geolocation) return;

    const updatePosition = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({
          lat: latitude,
          lng: longitude,
        });
      });
    };

    const intervalId = setInterval(updatePosition, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // Get directions between captain and destination
  useEffect(() => {
    if (!isLoaded || !ride?.Pickup || !ride?.destination) return;

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: ride.Pickup,
        destination: ride.destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        }
      }
    );
  }, [ride, isLoaded]);

  // Simulate captain position moving towards destination
  useEffect(() => {
    if (!ride?.captain?.vehicle?.location) return;

    const captainLat = ride.captain.vehicle.location.coordinates[1];
    const captainLng = ride.captain.vehicle.location.coordinates[0];

    setCaptainPosition({
      lat: captainLat,
      lng: captainLng,
    });

    // Simulate movement every 5 seconds (in real app, this would come from socket)
    const moveInterval = setInterval(() => {
      setCaptainPosition((prev) => {
        if (!prev) return prev;
        // Small random movement to simulate travel
        return {
          lat: prev.lat + (Math.random() - 0.5) * 0.0005,
          lng: prev.lng + (Math.random() - 0.5) * 0.0005,
        };
      });
    }, 5000);

    return () => clearInterval(moveInterval);
  }, [ride]);

  const mapCenter = captainPosition || currentPosition || defaultCenter;

  if (!isLoaded) {
    return <div className="h-full w-full bg-gray-100" />;
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={15}>
      {directions && <DirectionsRenderer directions={directions} />}

      {showUserLocation && currentPosition && (
        <Marker position={currentPosition} title="Your Location" />
      )}

      {showCaptainLocation && captainPosition && ride?.captain?.vehicle?.plate && (
        <Marker
          position={captainPosition}
          title={`${ride.captain.fullName.firstName}'s ${ride.captain.vehicle.vehicleType}`}
        />
      )}
    </GoogleMap>
  );
}

export default RideLiveTracking;
