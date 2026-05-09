import React from "react";

const LocationSearchpanel = ({
  suggestions,
  setVehiclePanelOpen,
  setPanelOpen,
  setPickup,
  setDestination,
  activeField,
}) => {
  const handleSuggestionClick = (suggestion) => {
    // Save only the description string
    if (activeField === "Pickup") {
      
      setPickup(suggestion.description);
      console.log(suggestion.description);
    }  else if (activeField === "destination") {
      setDestination(suggestion.description);
      console.log(suggestion.description)
    }

    setPanelOpen(false);
    if (activeField === "destination") {
      setVehiclePanelOpen?.();
    }
  };

  return (
    <div>
      {suggestions.map((elem, idx) => (
        <div
          key={idx}
          onClick={() => handleSuggestionClick(elem)}
          className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start cursor-pointer"
        >
          <h2 className="bg-[#eee] h-8 flex items-center w-8 justify-center rounded-full">
            <i className="ri-map-pin-line"></i>
          </h2>
          <h4 className="font-medium">{elem.description}</h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchpanel;
