import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";

function MapPage() {
  const mapContainer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [73.8567, 18.5204],
      zoom: 5,
    });

    map.on("load", () => {
      const savedSites =
        JSON.parse(localStorage.getItem("darukaaSites")) || [];

      const defaultSites = [
        {
          id: "default-1",
          name: "Pune Forest Project",
          projectName: "Pune Forest Project",
          latitude: 18.5204,
          longitude: 73.8567,
          carbon: "1250 tCO₂e",
          biodiversity: "High",
          status: "Active",
        },
        {
          id: "default-2",
          name: "Mumbai Mangrove Project",
          projectName: "Mumbai Mangrove Project",
          latitude: 19.076,
          longitude: 72.8777,
          carbon: "2100 tCO₂e",
          biodiversity: "Very High",
          status: "Active",
        },
        {
          id: "default-3",
          name: "Nashik Green Project",
          projectName: "Nashik Green Project",
          latitude: 19.9975,
          longitude: 73.7898,
          carbon: "850 tCO₂e",
          biodiversity: "Medium",
          status: "Active",
        },
      ];

      const sites = [...defaultSites, ...savedSites];

      sites.forEach((site) => {
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: true,
        }).setHTML(`
          <div style="
            width: 240px;
            background: #ffffff;
            color: #1f2937;
            padding: 14px;
            font-family: Arial, sans-serif;
            border-radius: 10px;
            box-sizing: border-box;
          ">

            <h3 style="
              margin: 0 0 12px 0;
              color: #14532d;
              font-size: 18px;
              font-weight: 700;
            ">
              ${site.name}
            </h3>

            <div style="
              font-size: 14px;
              line-height: 1.6;
            ">

              <p style="margin: 4px 0; color: #374151;">
                <strong style="color: #111827;">Project:</strong>
                ${site.projectName || site.project_name || site.name}
              </p>

              <p style="margin: 4px 0; color: #374151;">
                <strong style="color: #111827;">Carbon:</strong>
                ${site.carbon || "Not available"}
              </p>

              <p style="margin: 4px 0; color: #374151;">
                <strong style="color: #111827;">Biodiversity:</strong>
                ${site.biodiversity || "Not available"}
              </p>

              <p style="margin: 4px 0; color: #374151;">
                <strong style="color: #111827;">Status:</strong>
                ${site.status || "Active"}
              </p>

              <p style="margin: 4px 0; color: #374151;">
                <strong style="color: #111827;">Latitude:</strong>
                ${site.latitude}
              </p>

              <p style="margin: 4px 0 12px 0; color: #374151;">
                <strong style="color: #111827;">Longitude:</strong>
                ${site.longitude}
              </p>

            </div>

            <button
              id="analytics-${site.id}"
              style="
                width: 100%;
                border: none;
                padding: 9px 12px;
                border-radius: 7px;
                background: #1f5d42;
                color: #ffffff;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
              "
            >
              View Analytics
            </button>

          </div>
        `);

        new mapboxgl.Marker()
          .setLngLat([
            site.longitude,
            site.latitude,
          ])
          .setPopup(popup)
          .addTo(map);

        popup.on("open", () => {
          const button = document.getElementById(
            `analytics-${site.id}`
          );

          if (button) {
            button.onclick = () => {
              navigate(
                `/analytics?site=${encodeURIComponent(site.name)}`
              );
            };
          }
        });
      });
    });

    return () => {
      map.remove();
    };
  }, [navigate]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "500px",
      }}
    />
  );
}

export default MapPage;