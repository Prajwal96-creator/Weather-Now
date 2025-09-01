// src/components/WeatherDisplay.jsx
import React, { useMemo } from "react";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Chart } from "primereact/chart";
import { ProgressSpinner } from "primereact/progressspinner";
import { describeWeatherCode } from "../api";

/**
 * Props:
 *  - location: {lat, lon, name}
 *  - weather: { current, days, timezone }
 *  - loading: bool
 *  - error: string
 */
export default function WeatherDisplay({ location, weather, loading, error }) {
  const days = weather?.days || [];

  const chartData = useMemo(() => {
    if (!days.length) return null;
    const labels = days.map((d) => {
      // show short date
      try {
        const dt = new Date(d.date);
        return dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
      } catch {
        return d.date;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: "Max (°C)",
          data: days.map((d) => d.tmax),
          fill: false,
          tension: 0.3,
        },
        {
          label: "Min (°C)",
          data: days.map((d) => d.tmin),
          fill: false,
          tension: 0.3,
        },
      ],
    };
  }, [days]);

  const chartOptions = {
    plugins: {
      legend: { display: true },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div>
      <h3>Weather</h3>

      {loading && (
        <div className="p-d-flex p-jc-center p-mt-4">
          <ProgressSpinner />
        </div>
      )}

      {error && <div className="p-mt-2 p-text-color-danger">Error: {error}</div>}

      {!loading && !weather && <div className="p-mt-2">Search a city or click the map to load weather.</div>}

      {!loading && weather && (
        <div className="p-fluid p-grid">
          <div className="p-col-12 p-md-6">
            <Card title={location?.name ?? "Selected location"}>
              <div>
                <h2 style={{ margin: 0, fontSize: "2rem" }}>
                  {weather.current?.temperature ?? "—"} °C
                </h2>
                <small className="p-d-block p-mb-2">
                  {weather.current?.time ? new Date(weather.current.time).toLocaleString() : ""}
                </small>
                <div className="p-grid p-align-center">
                  <div className="p-col-6">
                    <div><strong>Wind</strong></div>
                    <div>{weather.current?.windspeed ?? "—"} km/h</div>
                  </div>
                  <div className="p-col-6">
                    <div><strong>Condition</strong></div>
                    <div>{describeWeatherCode(weather.current?.weathercode)}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="p-col-12 p-md-6">
            <Panel header="7-day forecast" toggleable>
              <div style={{ height: 240 }}>
                {chartData ? <Chart type="line" data={chartData} options={chartOptions} /> : <div>No data</div>}
              </div>

              <div className="p-mt-3">
                <DataTable value={days} responsiveLayout="scroll">
                  <Column field="date" header="Date" body={(row) => new Date(row.date).toLocaleDateString()}></Column>
                  <Column field="tmin" header="Min (°C)"></Column>
                  <Column field="tmax" header="Max (°C)"></Column>
                  <Column field="precipitation" header="Precip (mm)"></Column>
                  <Column
                    header="Cond"
                    body={(row) => (row.weathercode != null ? describeWeatherCode(row.weathercode) : "")}
                  ></Column>
                </DataTable>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}
