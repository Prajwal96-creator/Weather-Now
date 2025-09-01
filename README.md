# Weather-Now

A modern, responsive weather application built with **React**, **PrimeReact**, and **Leaflet**. Instantly get real-time weather information for any location worldwide using an intuitive city search or interactive map.

## Features

- 🌍 **Global City Search**: Search from a large database of cities.
- 🗺️ **Interactive Map**: Click anywhere on the map or use geocoding to select a location.
- ☁️ **Real-Time Weather**: Fetches current weather and 7-day forecast using the [Open-Meteo API](https://open-meteo.com/).
- 📊 **Charts & Tables**: Visualize weather trends with charts and tables.
- 💎 **Modern UI**: Built with PrimeReact, PrimeFlex, and custom styles for a professional look.
- 🔄 **Routing**: Seamless navigation with React Router.

## Technologies Used

- [React 18+](https://react.dev/)
- [Vite](https://vitejs.dev/) (for fast development)
- [PrimeReact](https://primereact.org/) (UI components)
- [PrimeFlex](https://www.primefaces.org/primeflex/) (utility CSS)
- [PrimeIcons](https://www.primefaces.org/primeicons/)
- [Leaflet](https://leafletjs.com/) (interactive maps)
- [Chart.js](https://www.chartjs.org/) (charts)
- [Open-Meteo API](https://open-meteo.com/) (weather data)
- [React Router](https://reactrouter.com/) (routing)
- [ESLint](https://eslint.org/) (linting)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**
	```sh
	git clone https://github.com/your-username/weather-now.git
	cd weather-now
	```

2. **Install dependencies:**
	```sh
	npm install
	```

3. **Start the development server:**
	```sh
	npm run dev
	```

4. **Open your browser:**
	- Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

### Build for Production

```sh
npm run build
```

### Lint the code

```sh
npm run lint
```

## Project Structure

```
.
├── public/
│   └── vite.svg
├── src/
│   ├── api.js                # Weather API logic
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   ├── App.css, index.css    # Styles
│   ├── data/
│   │   └── cities.json       # City coordinates database
│   ├── components/
│   │   ├── SearchBar.jsx
│   │   ├── MapWithGeolocator.jsx
│   │   ├── WeatherDisplay.jsx
│   │   └── ResultPage.jsx
├── package.json
├── vite.config.js
└── README.md
```

## How It Works

- **SearchBar**: Type a city name to get suggestions and select a city.
- **MapWithGeolocator**: Click on the map or use the geocoder to select a location.
- **WeatherDisplay**: Shows current weather and a 7-day forecast for the selected location.
- **ResultPage**: Displays weather results in a dialog-style card with a back button.
- **API**: Uses Open-Meteo for weather data and OpenStreetMap for geocoding.

## Customization

- **Theme**: Change PrimeReact theme in `src/main.jsx`.
- **Cities**: Update `src/data/cities.json` for your own city list.
- **API**: Modify `src/api.js` to use a different weather API if needed.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
