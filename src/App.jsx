import React, { useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { Card } from "primereact/card";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Divider } from "primereact/divider";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import SearchBar from "./components/SearchBar";
import WeatherDisplay from "./components/WeatherDisplay";
import MapWithGeolocator from "./components/MapWithGeolocator";
import { fetchWeather } from "./api";

export default function App() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aboutVisible, setAboutVisible] = useState(false);
  const toast = useRef(null);

  // Enhanced error handling with toast notifications
  const showError = (message) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000,
      sticky: false
    });
  };

  const showSuccess = (message) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000
    });
  };

  const showInfo = (message) => {
    toast.current?.show({
      severity: 'info',
      summary: 'Info',
      detail: message,
      life: 4000
    });
  };

  // Enhanced city selection handler
  async function handleCitySelect(city) {
    if (!city) return;
    
    const lat = parseFloat(city.lat);
    const lon = parseFloat(city.lng);
    const name = `${city.city}, ${city.country}`;
    
    showInfo(`Loading weather for ${name}...`);
    await loadWeather({ lat, lon, name });
  }

  // Enhanced map location selection handler
  async function handleMapLocationSelect(obj) {
    if (!obj) return;
    
    const { lat, lon, name } = obj;
    
    if (obj.weather) {
      setLocation({ lat, lon, name });
      setWeather(obj.weather);
      showSuccess(`Weather data loaded for ${name}`);
      return;
    }
    
    showInfo(`Loading weather for ${name}...`);
    await loadWeather({ lat, lon, name });
  }

  // Enhanced weather loading with better error handling
  async function loadWeather({ lat, lon, name }) {
    try {
      setLoading(true);
      setError("");
      
      const w = await fetchWeather(lat, lon);
      setLocation({ lat, lon, name });
      setWeather(w);
      
      showSuccess(`Weather data loaded successfully for ${name}`);
    } catch (err) {
      console.error('Weather fetch error:', err);
      const errorMessage = err.message || "Failed to fetch weather data. Please try again.";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Enhanced toolbar with gradient and better styling
  const leftToolbar = (
    <div className="flex align-items-center gap-3">
      <Avatar 
        icon="pi pi-cloud" 
        className="bg-blue-500" 
        size="large" 
        shape="circle"
      />
      <div>
        <h2 className="m-0 text-2xl font-bold text-primary">WeatherScope</h2>
        <div className="flex align-items-center gap-2 mt-1">
          <Badge value="React" severity="info" className="text-xs" />
          <Badge value="PrimeReact" severity="success" className="text-xs" />
          <Badge value="Leaflet" severity="warning" className="text-xs" />
        </div>
      </div>
    </div>
  );

  const rightToolbar = (
    <div className="flex gap-2">
      <Button 
        icon="pi pi-info-circle" 
        label="About" 
        className="p-button-outlined p-button-rounded"
        onClick={() => setAboutVisible(true)}
      />
      <Button 
        icon="pi pi-refresh" 
        className="p-button-text p-button-rounded"
        tooltip="Refresh Weather"
        tooltipOptions={{ position: 'bottom' }}
        onClick={() => location && loadWeather(location)}
        disabled={!location || loading}
      />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      <Toast ref={toast} position="top-right" />
      
      {/* Enhanced Toolbar with glass effect */}
      <Toolbar 
        left={leftToolbar} 
        right={rightToolbar}
        className="shadow-2 border-none"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      />

      {/* Main Content Container */}
      <div className="p-4 max-w-7xl mx-auto">
        <div className="grid">
          {/* Left Column - Search & Weather */}
          <div className="col-12 lg:col-6">
            {/* Search Section */}
            <Card 
              className="mb-4 shadow-3 border-round-xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="p-3">
                <div className="flex align-items-center gap-2 mb-3">
                  <i className="pi pi-search text-primary text-xl"></i>
                  <h3 className="m-0 text-primary font-semibold">Search Location</h3>
                </div>
                <SearchBar onSelectCity={handleCitySelect} />
              </div>
            </Card>

            {/* Weather Display Section */}
            <Card 
              className="shadow-3 border-round-xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                minHeight: '400px'
              }}
            >
              <div className="p-3">
                <div className="flex align-items-center justify-content-between mb-3">
                  <div className="flex align-items-center gap-2">
                    <i className="pi pi-cloud text-primary text-xl"></i>
                    <h3 className="m-0 text-primary font-semibold">Weather Information</h3>
                  </div>
                  {loading && (
                    <ProgressSpinner 
                      style={{ width: '24px', height: '24px' }} 
                      strokeWidth="4"
                    />
                  )}
                </div>
                
                {/* Loading Overlay */}
                {loading && (
                  <div className="flex flex-column align-items-center justify-content-center py-6">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" />
                    <p className="mt-3 text-600">Fetching weather data...</p>
                  </div>
                )}
                
                {/* Weather Content */}
                {!loading && (
                  <WeatherDisplay
                    location={location}
                    weather={weather}
                    loading={loading}
                    error={error}
                  />
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Map */}
          <div className="col-12 lg:col-6">
            <Card 
              className="shadow-3 border-round-xl overflow-hidden h-full"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                minHeight: '600px'
              }}
            >
              <div className="p-3 h-full">
                <div className="flex align-items-center gap-2 mb-3">
                  <i className="pi pi-map text-primary text-xl"></i>
                  <h3 className="m-0 text-primary font-semibold">Interactive Map</h3>
                  <Badge value="Click to select" severity="info" className="ml-auto text-xs" />
                </div>
                
                <div style={{ height: 'calc(100% - 60px)', minHeight: '500px' }}>
                  <MapWithGeolocator onLocationSelect={handleMapLocationSelect} />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Info Card */}
        {weather && (
          <Card 
            className="mt-4 shadow-3 border-round-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <div className="p-4 text-center">
              <i className="pi pi-info-circle text-primary text-2xl mb-2"></i>
              <p className="text-600 m-0">
                Weather data is updated in real-time. Click on the map or search for a city to get current conditions.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* About Dialog */}
      <Dialog
        header={
          <div className="flex align-items-center gap-2">
            <Avatar icon="pi pi-info-circle" className="bg-primary" />
            <span>About WeatherScope</span>
          </div>
        }
        visible={aboutVisible}
        onHide={() => setAboutVisible(false)}
        style={{ width: '450px' }}
        modal
        className="border-round-xl"
        contentStyle={{ 
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: '12px'
        }}
      >
        <div className="p-4">
          <div className="text-center mb-4">
            <Avatar 
              icon="pi pi-cloud" 
              className="bg-blue-500" 
              size="xlarge" 
              shape="circle"
            />
          </div>
          
          <h4 className="text-center text-primary mb-3">WeatherScope</h4>
          <p className="text-600 line-height-3 mb-4">
            A modern, responsive weather application built with React and PrimeReact. 
            Get real-time weather information for any location worldwide through our 
            intuitive search interface or interactive map.
          </p>
          
          <Divider />
          
          <div className="mt-4">
            <h5 className="text-primary mb-3">Features</h5>
            <ul className="list-none p-0 m-0">
              <li className="flex align-items-center gap-2 mb-2">
                <i className="pi pi-check-circle text-green-500"></i>
                <span className="text-700">Real-time weather data</span>
              </li>
              <li className="flex align-items-center gap-2 mb-2">
                <i className="pi pi-check-circle text-green-500"></i>
                <span className="text-700">Interactive map selection</span>
              </li>
              <li className="flex align-items-center gap-2 mb-2">
                <i className="pi pi-check-circle text-green-500"></i>
                <span className="text-700">Global city search</span>
              </li>
              <li className="flex align-items-center gap-2">
                <i className="pi pi-check-circle text-green-500"></i>
                <span className="text-700">Responsive design</span>
              </li>
            </ul>
          </div>
          
          <Divider />
          
          <div className="mt-4">
            <h5 className="text-primary mb-3">Technologies</h5>
            <div className="flex flex-wrap gap-2">
              <Badge value="React 18" severity="info" />
              <Badge value="PrimeReact" severity="success" />
              <Badge value="Leaflet Maps" severity="warning" />
              <Badge value="OpenWeather API" severity="secondary" />
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              label="Close" 
              icon="pi pi-times"
              className="p-button-outlined p-button-rounded"
              onClick={() => setAboutVisible(false)}
            />
          </div>
        </div>
      </Dialog>

      <Routes>
        <Route path="/" element={null} />
        {/* Add more routes if desired */}
      </Routes>

      {/* Custom Styles */}
      <style jsx>{`
        .p-toolbar {
          transition: all 0.3s ease;
        }
        
        .p-card {
          transition: all 0.3s ease;
        }
        
        .p-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
        
        .p-button {
          transition: all 0.3s ease;
        }
        
        .p-button:hover {
          transform: translateY(-1px);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        /* Enhanced scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        /* Custom PrimeReact theme overrides */
        .p-card .p-card-body {
          padding: 0;
        }
        
        .p-toolbar .p-toolbar-group-left,
        .p-toolbar .p-toolbar-group-right {
          display: flex;
          align-items: center;
        }
        
        .p-dialog .p-dialog-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px 12px 0 0;
        }
        
        .p-dialog .p-dialog-content {
          border-radius: 0 0 12px 12px;
        }
        
        /* Enhanced badge styling */
        .p-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }
        
        /* Loading spinner custom styling */
        .p-progress-spinner-circle {
          animation: p-progress-spinner-rotate 2s linear infinite;
        }
        
        /* Custom responsive grid adjustments */
        @media (max-width: 768px) {
          .p-toolbar .p-toolbar-group-left h2 {
            font-size: 1.5rem;
          }
          
          .p-toolbar .p-toolbar-group-left small {
            display: none;
          }
        }
        
        /* Enhanced hover effects for interactive elements */
        .p-card .p-card-content:hover {
          background: rgba(255, 255, 255, 0.05);
          transition: background 0.3s ease;
        }
        
        /* Professional gradient backgrounds for different sections */
        .search-section {
          background: linear-gradient(145deg, rgba(103, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        }
        
        .weather-section {
          background: linear-gradient(145deg, rgba(118, 75, 162, 0.1) 0%, rgba(103, 126, 234, 0.1) 100%);
        }
        
        .map-section {
          background: linear-gradient(145deg, rgba(52, 211, 153, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
        }
      `}</style>
    </div>
  );
}