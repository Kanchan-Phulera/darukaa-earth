import "../App.css";
import { useSearchParams } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SiteAnalytics() {
  const [searchParams] = useSearchParams();

  const siteName = searchParams.get("site");

  // =================================
  // DEFAULT SAMPLE SITES
  // =================================

  const defaultSites = {
    "Pune Forest Project": {
      name: "Pune Forest Project",
      projectName: "Pune Forest Project",
      carbon: "1250 tCO₂e",
      biodiversity: "High",
      status: "Active",
      latitude: 18.5204,
      longitude: 73.8567,
    },

    "Mumbai Mangrove Project": {
      name: "Mumbai Mangrove Project",
      projectName: "Mumbai Mangrove Project",
      carbon: "2100 tCO₂e",
      biodiversity: "Very High",
      status: "Active",
      latitude: 19.076,
      longitude: 72.8777,
    },

    "Nashik Green Project": {
      name: "Nashik Green Project",
      projectName: "Nashik Green Project",
      carbon: "850 tCO₂e",
      biodiversity: "Medium",
      status: "Active",
      latitude: 19.9975,
      longitude: 73.7898,
    },
  };

  // =================================
  // GET SITES FROM LOCAL STORAGE
  // =================================

  const savedSites =
    JSON.parse(localStorage.getItem("darukaaSites")) || [];

  // =================================
  // FIND SELECTED SITE
  // =================================

  const savedSite = savedSites.find(
    (site) => site.name === siteName
  );

  const site =
    savedSite ||
    defaultSites[siteName];

  // =================================
  // SITE NOT FOUND
  // =================================

  if (!site) {
    return (
      <div className="analytics-page">
        <h1>Site not found</h1>
        <p>
          No analytics data is available for this site.
        </p>
      </div>
    );
  }

  // =================================
  // CHART DATA
  // =================================

  const chartData = {
    labels: ["2022", "2023", "2024", "2025", "2026"],

    datasets: [
      {
        label: "Carbon Performance (tCO₂e)",

        data:
          siteName === "Pune Forest Project"
            ? [400, 600, 800, 1050, 1250]
            : siteName === "Mumbai Mangrove Project"
              ? [700, 950, 1200, 1650, 2100]
              : siteName === "Nashik Green Project"
                ? [300, 450, 550, 700, 850]
                : [0, 0, 0, 0, 0],

        tension: 0.3,

        borderColor: "#1f5d42",
        backgroundColor: "#1f5d42",

        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // =================================
  // BIODIVERSITY DATA
  // =================================

  const biodiversityData = {
    labels: ["2022", "2023", "2024", "2025", "2026"],

    datasets: [
      {
        label: "Biodiversity Index",

        data:
          siteName === "Pune Forest Project"
            ? [40, 48, 55, 65, 72]
            : siteName === "Mumbai Mangrove Project"
              ? [50, 58, 68, 78, 88]
              : siteName === "Nashik Green Project"
                ? [30, 38, 45, 52, 60]
                : [0, 0, 0, 0, 0],

        tension: 0.3,

        borderColor: "#2f7d57",
        backgroundColor: "#2f7d57",

        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // =================================
  // RETURN UI
  // =================================

  return (
    <div className="analytics-page">

      <h1>Site Analytics</h1>

      <div className="analytics-card">

        {/* SITE NAME */}

        <h2>{site.name}</h2>

        {/* SITE INFORMATION */}

        <div className="analytics-grid">

          <div>
            <h3>Project</h3>
            <p>
              {site.projectName || "Not available"}
            </p>
          </div>

          <div>
            <h3>Carbon</h3>
            <p>
              {site.carbon || "Not available"}
            </p>
          </div>

          <div>
            <h3>Biodiversity</h3>
            <p>
              {site.biodiversity || "Not available"}
            </p>
          </div>

          <div>
            <h3>Project Status</h3>
            <p>
              {site.status || "Active"}
            </p>
          </div>

        </div>

        {/* LOCATION */}

        <div className="analytics-grid">

          <div>
            <h3>Latitude</h3>
            <p>
              {site.latitude}
            </p>
          </div>

          <div>
            <h3>Longitude</h3>
            <p>
              {site.longitude}
            </p>
          </div>

        </div>

        {/* CHARTS */}

        <div className="charts-container">

          {/* CARBON CHART */}

          <div className="chart-card">

            <h2>
              Carbon Performance Over Time
            </h2>

            <Line
              data={chartData}
              options={{
                responsive: true,

                plugins: {
                  legend: {
                    display: true,
                  },
                },
              }}
            />

          </div>

          {/* BIODIVERSITY CHART */}

          <div className="chart-card">

            <h2>
              Biodiversity Performance Over Time
            </h2>

            <Line
              data={biodiversityData}
              options={{
                responsive: true,

                plugins: {
                  legend: {
                    display: true,
                  },
                },
              }}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

export default SiteAnalytics;