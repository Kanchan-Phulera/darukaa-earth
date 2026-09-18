import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard.jsx";
import MapPage from "./pages/MapPage";
import SiteAnalytics from "./pages/SiteAnalytics";
import Projects from "./pages/Projects";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/analytics" element={<SiteAnalytics />} />
        <Route path="/projects" element={<Projects />} />
     </Routes>
    </BrowserRouter>
  );
}

export default App;