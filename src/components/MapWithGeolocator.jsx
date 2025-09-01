// src/components/MapWithGeolocator.jsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-control-geocoder"; // plugin
import { fetchWeather, describeWeatherCode } from "../api";

// Fix for missing marker icons in many bundlers (Vite/CRA)
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

/**
 * Props:
 * - onLocationSelect({ lat, lon, name, weather? })
 */
export default function MapWithGeolocator({ onLocationSelect }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return; // already initialized

    const mapDiv = document.getElementById("weather-map");
    if (!mapDiv) return;

    const map = L.map(mapDiv).setView([20.5937, 78.9629], 5);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Geocoder (search box)
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on("markgeocode", async function (e) {
        const center = e.geocode.center;
        map.flyTo(center, 12);
        const name = e.geocode.name || e.geocode.html || `${center.lat},${center.lng}`;

        // fetch weather and show marker
        try {
          const w = await fetchWeather(center.lat, center.lng);
          placeMarker(center.lat, center.lng, name, w);
          if (onLocationSelect) onLocationSelect({ lat: center.lat, lon: center.lng, name, weather: w });
        } catch (err) {
          console.error("Weather fetch failed", err);
        }
      })
      .addTo(map);

    // Click handler: reverse geocode via Nominatim then fetch weather
    map.on("click", async function (e) {
      const { lat, lng } = e.latlng;
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const json = await r.json();
        const displayName = json?.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        // fetch weather
        const w = await fetchWeather(lat, lng);
        placeMarker(lat, lng, displayName, w);
        if (onLocationSelect) onLocationSelect({ lat, lon: lng, name: displayName, weather: w });
        // Note: above onLocationSelect receives lon as string by mistake in prior line; ensure we pass correct.
        if (onLocationSelect) onLocationSelect({ lat, lon: lng, name: displayName, weather: w });
      } catch (err) {
        console.error("Reverse geocode or weather error:", err);
      }
    });

    // helper to place a single marker (remove old one)
    function placeMarker(lat, lng, displayName, weatherObj) {
      // remove previous marker
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }

      const marker = L.marker([lat, lng]).addTo(map);
      markerRef.current = marker;

      let popupHtml = `<div style="min-width:180px"><strong>${escapeHtml(displayName)}</strong><br/>`;
      if (weatherObj?.current) {
        popupHtml += `<div style="margin-top:6px"><strong>${weatherObj.current.temperature} °C</strong> — ${escapeHtml(
          describeWeatherCode(weatherObj.current.weathercode)
        )}<br/><small>Wind: ${weatherObj.current.windspeed} km/h</small></div>`;
      } else {
        popupHtml += `<div>No weather info</div>`;
      }
      popupHtml += "</div>";

      marker.bindPopup(popupHtml).openPopup();
    }

    // a small escape helper for popup content
    function escapeHtml(s) {
      if (!s) return "";
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    // cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onLocationSelect]);

return (
  <div>
    <h3>Map</h3>
    <div
      id="weather-map"
      style={{ height: "480px", width: "100%", borderRadius: 8 }}
    ></div>
    <small className="p-d-block p-mt-2 p-text-secondary">
      Click anywhere on the map or use the search box above the map.
    </small>
  </div>
);

}
