import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import axios from 'axios';
import './MapContainer.css'; 

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 37.7749,
  lng: -122.4194
};

const MapContainer = () => {
  const [vehiclePath, setVehiclePath] = useState([]);
  const [date, setDate] = useState('today');

  useEffect(() => {
    const fetchVehicleLocation = async () => {
      try {
        const response = await axios.get('http://localhost:5000/vehicle-location', {
          params: { date }
        });
        console.log('Vehicle path data:', response.data);
        const formattedPath = response.data.map(point => ({
          lat: point.latitude,
          lng: point.longitude
        }));
        setVehiclePath(formattedPath);
      } catch (error) {
        console.error('Error fetching vehicle location:', error);
      }
    };

    fetchVehicleLocation();
  }, [date]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  return (
    <div>
      <select onChange={handleDateChange} value={date}>
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="last-month">Last Month</option>
        {/* Add more options as needed */}
      </select>
      
      <LoadScript
        googleMapsApiKey="AIzaSyCjqFTzy-Z7KP5FmJ_E3vd4Vs5mdspMR7M" // Replace with your API key
        libraries={['places']}
      >
        <GoogleMap
          mapContainerStyle={containerStyle} // Use the updated containerStyle
          center={center}
          zoom={12}
        >
          {vehiclePath.length > 0 && (
            <>
              <Polyline
                path={vehiclePath}
                options={{
                  strokeColor: '#FF0000',
                  strokeOpacity: 1.0,
                  strokeWeight: 2,
                }}
              />
              <Marker position={vehiclePath[0]} />
              <Marker
  position={vehiclePath[vehiclePath.length - 1]}
  icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" // Vehicle icon URL
/>

            </>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapContainer;
