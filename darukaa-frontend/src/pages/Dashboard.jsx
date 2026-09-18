import { Link } from "react-router-dom";
import MapPage from "./MapPage";
import "../App.css";

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-content">

        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>
              Monitor carbon, biodiversity and geospatial project performance.
            </p>
          </div>

          <Link to="/projects" className="dashboard-button">
            + Add Project
          </Link>
        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <h3>Total Projects</h3>
            <div className="stat-number">3</div>
            <p>Active conservation projects</p>
          </div>

          <div className="stat-card">
            <h3>Total Sites</h3>
            <div className="stat-number">3+</div>
            <p>Geographical monitoring sites</p>
          </div>

          <div className="stat-card">
            <h3>Carbon Impact</h3>
            <div className="stat-number">425.5</div>
            <p>tCO₂e monitored</p>
          </div>

          <div className="stat-card">
            <h3>Biodiversity</h3>
            <div className="stat-number">82%</div>
            <p>Current biodiversity index</p>
          </div>

        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Project Locations</h2>
              <p>Interactive geospatial view of conservation sites</p>
            </div>

            <Link to="/map" className="view-link">
              View Full Map →
            </Link>
          </div>

          <div className="dashboard-map">
            <MapPage />
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Recent Projects</h2>
              <p>Manage your carbon and biodiversity projects</p>
            </div>

            <Link to="/projects" className="view-link">
              View Projects →
            </Link>
          </div>

          <div className="project-list">

            <div className="project-item">
              <div>
                <h3>Pune Forest Project</h3>
                <p>Pune • Carbon & Biodiversity Conservation</p>
              </div>
              <span className="active-status">Active</span>
            </div>

            <div className="project-item">
              <div>
                <h3>Mumbai Mangrove Project</h3>
                <p>Mumbai • Mangrove Conservation</p>
              </div>
              <span className="active-status">Active</span>
            </div>

            <div className="project-item">
              <div>
                <h3>Nashik Green Project</h3>
                <p>Nashik • Forest Restoration</p>
              </div>
              <span className="active-status">Active</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;