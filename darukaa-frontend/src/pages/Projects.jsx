import { useState, useEffect } from "react";
import "../App.css";

function Projects() {
  // =============================
  // PROJECT STATE
  // =============================

  const [showForm, setShowForm] = useState(false);

  const [projects, setProjects] = useState([]);

  // =============================
  // LOAD PROJECTS + SITES FROM BACKEND
  // =============================

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const [projectsResponse, sitesResponse] = await Promise.all([
          fetch("http://127.0.0.1:8000/projects"),
          fetch("http://127.0.0.1:8000/sites"),
        ]);

        if (!projectsResponse.ok || !sitesResponse.ok) {
          throw new Error("Failed to load data from backend");
        }

        const projectsData = await projectsResponse.json();
        const sitesData = await sitesResponse.json();

        const formattedProjects = projectsData.map((project) => {
          const projectSites = sitesData.filter(
            (site) => site.project_id === project.id
          );

          const totalCarbon = projectSites.reduce(
            (total, site) => total + Number(site.carbon || 0),
            0
          );

          return {
            id: project.id,
            name: project.name,
            description: project.description,
            sites: projectSites.length,
            carbon: `${totalCarbon} tCO₂e`,
            status: "Active",
            location: project.location,
          };
        });

        setProjects(formattedProjects);

        // Keep the existing Mapbox page compatible with backend sites.
        const mapSites = sitesData.map((site) => ({
          id: site.id,
          name: site.name,
          latitude: site.latitude,
          longitude: site.longitude,
          projectId: site.project_id,
          projectName: site.project_name,
          carbon: `${site.carbon} tCO₂e`,
          carbonValue: site.carbon,
          biodiversity: site.biodiversity,
          status: site.status,
        }));

        localStorage.setItem("darukaaSites", JSON.stringify(mapSites));
      } catch (error) {
        console.error("Failed to load backend data:", error);
      }
    };

    loadProjects();
  }, []);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] =
    useState("");

  // =============================
  // VIEW PROJECT STATE
  // =============================

  const [selectedViewProject, setSelectedViewProject] =
    useState(null);

  // =============================
  // SITE STATE
  // =============================

  const [showSiteForm, setShowSiteForm] = useState(false);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [siteName, setSiteName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // NEW
  const [carbon, setCarbon] = useState("");
  const [biodiversity, setBiodiversity] = useState("");

  // =============================
  // SAVE PROJECT
  // =============================

  const handleSaveProject = async (event) => {
    event.preventDefault();

    if (!projectName.trim()) {
      alert("Please enter a project name.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName.trim(),
          description: projectDescription.trim(),
          location: "Pune",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const data = await response.json();

      const newProject = {
        id: data.project.id,
        name: data.project.name,
        description: data.project.description,
        sites: 0,
        carbon: "0 tCO₂e",
        status: "Active",
        location: data.project.location,
      };

      setProjects((currentProjects) => [
        ...currentProjects,
        newProject,
      ]);

      setProjectName("");
      setProjectDescription("");
      setShowForm(false);

      alert("Project added successfully to PostgreSQL.");
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Failed to save project. Make sure the backend is running.");
    }
  };

  // =============================
  // CANCEL PROJECT
  // =============================

  const handleCancelProject = () => {
    setProjectName("");
    setProjectDescription("");
    setShowForm(false);
  };

  // =============================
  // VIEW PROJECT
  // =============================

  const handleViewProject = (project) => {
    setSelectedViewProject(project);

    setShowForm(false);
    setShowSiteForm(false);
    setSelectedProject(null);
  };

  // =============================
  // CLOSE PROJECT DETAILS
  // =============================

  const handleCloseProjectDetails = () => {
    setSelectedViewProject(null);
  };

  // =============================
  // OPEN SITE FORM
  // =============================

  const handleAddSite = (project) => {
    setSelectedProject(project);

    setShowSiteForm(true);
    setShowForm(false);
    setSelectedViewProject(null);

    setSiteName("");
    setLatitude("");
    setLongitude("");
    setCarbon("");
    setBiodiversity("");
  };

  // =============================
  // SAVE SITE
  // =============================

  const handleSaveSite = async (event) => {
    event.preventDefault();

    if (!siteName.trim()) {
      alert("Please enter a site name.");
      return;
    }

    if (!latitude || !longitude) {
      alert("Please enter latitude and longitude.");
      return;
    }

    if (!carbon) {
      alert("Please enter carbon value.");
      return;
    }

    if (!biodiversity) {
      alert("Please select biodiversity level.");
      return;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    const carbonValue = Number(carbon);

    if (Number.isNaN(lat) || lat < -90 || lat > 90) {
      alert("Latitude must be between -90 and 90.");
      return;
    }

    if (Number.isNaN(lng) || lng < -180 || lng > 180) {
      alert("Longitude must be between -180 and 180.");
      return;
    }

    if (Number.isNaN(carbonValue) || carbonValue < 0) {
      alert("Carbon value must be a valid positive number.");
      return;
    }

    if (!selectedProject) {
      alert("Please select a project.");
      return;
    }

    const biodiversityValue =
      biodiversity === "Low"
        ? 25
        : biodiversity === "Medium"
        ? 50
        : biodiversity === "High"
        ? 75
        : 100;

    try {
      const response = await fetch("http://127.0.0.1:8000/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: siteName.trim(),
          latitude: lat,
          longitude: lng,
          project_id: selectedProject.id,
          project_name: selectedProject.name,
          carbon: carbonValue,
          biodiversity: biodiversityValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || "Failed to create site"
        );
      }

      const data = await response.json();

      const newSite = {
        id: data.site.id,
        name: data.site.name,
        latitude: data.site.latitude,
        longitude: data.site.longitude,
        projectId: data.site.project_id,
        projectName: data.site.project_name,
        carbon: `${data.site.carbon} tCO₂e`,
        carbonValue: data.site.carbon,
        biodiversity: biodiversity,
        status: data.site.status,
      };

      // Keep the existing Mapbox frontend compatible.
      const existingSites =
        JSON.parse(localStorage.getItem("darukaaSites")) || [];

      localStorage.setItem(
        "darukaaSites",
        JSON.stringify([...existingSites, newSite])
      );

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === selectedProject.id
            ? {
                ...project,
                sites: project.sites + 1,
                carbon: `${
                  Number(
                    String(project.carbon)
                      .replace(" tCO₂e", "")
                      .replace(",", "") || 0
                  ) + carbonValue
                } tCO₂e`,
              }
            : project
        )
      );

      alert(`Site "${siteName.trim()}" saved to PostgreSQL.`);

      setSiteName("");
      setLatitude("");
      setLongitude("");
      setCarbon("");
      setBiodiversity("");
      setSelectedProject(null);
      setShowSiteForm(false);
    } catch (error) {
      console.error("Failed to save site:", error);
      alert(
        `Failed to save site. ${error.message || "Make sure the backend is running."}`
      );
    }
  };

  // =============================
  // CANCEL SITE
  // =============================

  const handleCancelSite = () => {
    setSiteName("");
    setLatitude("");
    setLongitude("");
    setCarbon("");
    setBiodiversity("");

    setSelectedProject(null);
    setShowSiteForm(false);
  };

  // =============================
  // RETURN UI
  // =============================

  return (
    <div className="projects-page">

      {/* =============================
          PAGE HEADER
      ============================= */}

      <div className="projects-header">

        <div>
          <h1>Projects</h1>

          <p>
            Manage carbon and biodiversity projects
          </p>
        </div>

        <button
          type="button"
          className="add-project-btn"
          onClick={() => {
            setShowForm(true);
            setShowSiteForm(false);
            setSelectedViewProject(null);
            setSelectedProject(null);
          }}
        >
          + Add Project
        </button>

      </div>

      {/* =============================
          ADD PROJECT FORM
      ============================= */}

      {showForm && (
        <div className="project-form-card">

          <h2>Add New Project</h2>

          <form onSubmit={handleSaveProject}>

            <label htmlFor="project-name">
              Project Name
            </label>

            <input
              id="project-name"
              type="text"
              placeholder="Enter project name"
              value={projectName}
              onChange={(event) =>
                setProjectName(event.target.value)
              }
            />

            <label htmlFor="project-description">
              Project Description
            </label>

            <textarea
              id="project-description"
              placeholder="Enter project description"
              value={projectDescription}
              onChange={(event) =>
                setProjectDescription(
                  event.target.value
                )
              }
              rows="4"
            />

            <div className="form-buttons">

              <button
                type="submit"
                className="save-project-btn"
              >
                Save Project
              </button>

              <button
                type="button"
                className="cancel-project-btn"
                onClick={handleCancelProject}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =============================
          ADD SITE FORM
      ============================= */}

      {showSiteForm && selectedProject && (
        <div className="project-form-card">

          <h2>Add Site</h2>

          <p>
            Project:{" "}
            <strong>
              {selectedProject.name}
            </strong>
          </p>

          <form onSubmit={handleSaveSite}>

            {/* SITE NAME */}

            <label htmlFor="site-name">
              Site Name
            </label>

            <input
              id="site-name"
              type="text"
              placeholder="Enter site name"
              value={siteName}
              onChange={(event) =>
                setSiteName(event.target.value)
              }
            />

            {/* LATITUDE */}

            <label htmlFor="latitude">
              Latitude
            </label>

            <input
              id="latitude"
              type="number"
              step="any"
              min="-90"
              max="90"
              placeholder="Example: 18.5204"
              value={latitude}
              onChange={(event) =>
                setLatitude(event.target.value)
              }
            />

            {/* LONGITUDE */}

            <label htmlFor="longitude">
              Longitude
            </label>

            <input
              id="longitude"
              type="number"
              step="any"
              min="-180"
              max="180"
              placeholder="Example: 73.8567"
              value={longitude}
              onChange={(event) =>
                setLongitude(event.target.value)
              }
            />

            {/* CARBON */}

            <label htmlFor="carbon">
              Carbon (tCO₂e)
            </label>

            <input
              id="carbon"
              type="number"
              min="0"
              step="any"
              placeholder="Example: 1250"
              value={carbon}
              onChange={(event) =>
                setCarbon(event.target.value)
              }
            />

            {/* BIODIVERSITY */}

            <label htmlFor="biodiversity">
              Biodiversity Level
            </label>

            <select
              id="biodiversity"
              value={biodiversity}
              onChange={(event) =>
                setBiodiversity(event.target.value)
              }
            >

              <option value="">
                Select biodiversity level
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

              <option value="Very High">
                Very High
              </option>

            </select>

            {/* BUTTONS */}

            <div className="form-buttons">

              <button
                type="submit"
                className="save-project-btn"
              >
                Save Site
              </button>

              <button
                type="button"
                className="cancel-project-btn"
                onClick={handleCancelSite}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =============================
          PROJECT LIST
      ============================= */}

      <div className="projects-list">

        {projects.map((project) => (

          <div key={project.id}>

            {/* PROJECT CARD */}

            <div className="project-card">

              <h2>{project.name}</h2>

              {project.description && (
                <p className="project-description">
                  {project.description}
                </p>
              )}

              <div className="project-info">

                <div>
                  <span>Sites</span>

                  <strong>
                    {project.sites}
                  </strong>
                </div>

                <div>
                  <span>Carbon</span>

                  <strong>
                    {project.carbon}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong>
                    {project.status}
                  </strong>
                </div>

              </div>

              <div className="project-actions">

                <button
                  type="button"
                  className="view-project-btn"
                  onClick={() =>
                    handleViewProject(project)
                  }
                >
                  View Project
                </button>

                <button
                  type="button"
                  className="add-site-btn"
                  onClick={() =>
                    handleAddSite(project)
                  }
                >
                  + Add Site
                </button>

              </div>

            </div>

            {/* PROJECT DETAILS */}

            {selectedViewProject?.id === project.id && (

              <div className="project-form-card project-details-card">

                <h2>
                  Project Details
                </h2>

                <h3>
                  {selectedViewProject.name}
                </h3>

                <p className="project-description">
                  {selectedViewProject.description ||
                    "No project description available."}
                </p>

                <div className="project-info">

                  <div>
                    <span>Total Sites</span>

                    <strong>
                      {selectedViewProject.sites}
                    </strong>
                  </div>

                  <div>
                    <span>Carbon</span>

                    <strong>
                      {selectedViewProject.carbon}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>

                    <strong>
                      {selectedViewProject.status}
                    </strong>
                  </div>

                </div>

                <button
                  type="button"
                  className="cancel-project-btn"
                  onClick={handleCloseProjectDetails}
                >
                  Close
                </button>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}

export default Projects;