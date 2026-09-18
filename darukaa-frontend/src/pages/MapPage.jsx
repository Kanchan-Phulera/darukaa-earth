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
      // =============================
      // GET SAVED SITES
      // =============================

      const savedSites =
        JSON.parse(localStorage.getItem("darukaaSites")) || [];

      // =============================
      // SAMPLE SITES
      // =============================

      const defaultSites = [
        {
          id: "default-1",
          name: "Pune Forest Project",
          latitude: 18.5204,
          longitude: 73.8567,
          carbon: "1250 tCO₂e",
          biodiversity: "High",
        },
        {
          id: "default-2",
          name: "Mumbai Mangrove Project",
          latitude: 19.076,
          longitude: 72.8777,
          carbon: "2100 tCO₂e",
          biodiversity: "Very High",
        },
        {
          id: "default-3",
          name: "Nashik Green Project",
          latitude: 19.9975,
          longitude: 73.7898,
          carbon: "850 tCO₂e",
          biodiversity: "Medium",
        },
      ];

      // =============================
      // COMBINE SITES
      // =============================

      const sites = [
        ...defaultSites,
        ...savedSites,
      ];

      // =============================
      // CREATE MARKERS
      // =============================

      sites.forEach((site) => {
        const popup = new mapboxgl.Popup({
          offset: 25,
        }).setHTML(`
          <div>
            <h3>${site.name}</h3>

            <p>
              <strong>Project:</strong>
              ${site.projectName || site.name}
            </p>

            <p>
              <strong>Latitude:</strong>
              ${site.latitude}
            </p>

            <p>
              <strong>Longitude:</strong>
              ${site.longitude}
            </p>

            <p>
              <strong>Carbon:</strong>
              ${site.carbon || "Not available"}
            </p>

            <p>
              <strong>Biodiversity:</strong>
              ${site.biodiversity || "Not available"}
            </p>

            <button
              id="analytics-${site.id}"
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

        // =============================
        // ANALYTICS BUTTON
        // =============================

        popup.on("open", () => {
          const button = document.getElementById(
            `analytics-${site.id}`
          );

          if (button) {
            button.addEventListener("click", () => {
              navigate(
                `/analytics?site=${encodeURIComponent(
                  site.name
                )}`
              );
            });
          }
        });
      });
    });

    // =============================
    // CLEANUP
    // =============================

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