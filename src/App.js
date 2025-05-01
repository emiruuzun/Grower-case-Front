import { Routes, Route } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";

import { getCookie } from "./utils/cookie-manager";
import { decodeToken } from "./utils/decoded-token";
import PropTypes from "prop-types";

// User Pages
import KayıtOl from "./pages/Register/index";
import Giris from "./pages/Login/index";
import Dashboard from "./pages/Dashboard/index.jsx";
import ProjectSelector from "./pages/Dashboard/ProjectList/ProjectSelector.jsx";
import ProjectAnalysis from "./pages/Dashboard/ProjectAnalysis/index.jsx";

const userRole = () => {
  const token = getCookie("access_token");
  if (!token) {
    return null;
  }

  const decodedToken = decodeToken(token);
  return decodedToken ? decodedToken.role : null;
};

function PrivateRoute({ children }) {
  const from = useLocation().state;
  const role = userRole();

  if (!role) {
    return <Navigate to="/giris" replace state={{ from }} />;
  }

  return children;
}

function PublicRoute({ children }) {
  const from = useLocation().state;

  if (userRole()) {
    return <Navigate to="/dashboard" replace state={{ from }} />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Giris />
            </PublicRoute>
          }
        />
        <Route
          path="/giris"
          element={
            <PublicRoute>
              <Giris />
            </PublicRoute>
          }
        />
        <Route
          path="/kayıt-ol"
          element={
            <PublicRoute>
              <KayıtOl />
            </PublicRoute>
          }
        />
        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/ProjectSelector"
          element={
            <PrivateRoute>
              <ProjectSelector />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:projectId/analysis"
          element={
            <PrivateRoute>
              <ProjectAnalysis />
            </PrivateRoute>
          }
        />
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/giris" replace />} />
      </Routes>
    </>
  );
}

export default App;
