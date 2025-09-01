import React, { useState, useRef } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";

// IMPORTANT: Ensure cities.json is present at src/data/cities.json
import cities from "../data/cities.json";

/**
 * Props:
 *  - onSelectCity(cityObject)  // callback when a city is selected
 */
export default function SearchBar({ onSelectCity }) {
  const [value, setValue] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const acRef = useRef(null);

  function searchCities(event) {
    const q = (event.query || "").toLowerCase().trim();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const filtered = cities.filter((c) => {
      return (
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.city_ascii && c.city_ascii.toLowerCase().includes(q)) ||
        (c.admin_name && c.admin_name.toLowerCase().includes(q)) ||
        (c.country && c.country.toLowerCase().includes(q))
      );
    });

    setSuggestions(filtered.slice(0, 20));
  }

  function onCityChange(e) {
    setValue(e.value);
  }

  function onCitySelect(e) {
    const city = e.value;
    if (city && onSelectCity) {
      onSelectCity(city);
    }
  }

  function onClear() {
    setValue(null);
    setSuggestions([]);
  }

  return (
    <div>
      <h3>Search city</h3>
      <div className="p-fluid">
        <div className="p-inputgroup">
          <AutoComplete
            ref={acRef}
            value={value}
            suggestions={suggestions}
            field="city"
            dropdown
            completeMethod={searchCities}
            onChange={onCityChange}
            onSelect={onCitySelect}
            placeholder="Type a city name (e.g., Mumbai, Delhi)..."
            forceSelection
            aria-label="City search"
            className="p-inputtext"
          />
          <Button
            icon="pi pi-times"
            onClick={onClear}
            className="p-button-outlined"
            severity="secondary"
          />
        </div>
        <small className="p-d-block p-mt-2 p-text-secondary">
          Select from the dropdown to load weather.
        </small>
      </div>
    </div>
  );
}