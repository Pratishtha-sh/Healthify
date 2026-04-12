import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// Page Imports
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import BillingPage from "./pages/BillingPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import PharmacyManager from "./pages/PharmacyManager";
import PatientDashboard from "./pages/PatientDashboard";
import PatientBooking from "./pages/PatientBooking";

// Protected Route Wrapper - only checks local role for mock auth
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem("userRole");
  if (!role) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin", "receptionist"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute allowedRoles={["admin", "receptionist"]}><BillingPage /></ProtectedRoute>} />
          <Route path="/doctor" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/pharmacy" element={<ProtectedRoute allowedRoles={["pharmacist", "admin"]}><PharmacyManager /></ProtectedRoute>} />
          <Route path="/patient" element={<ProtectedRoute allowedRoles={["patient"]}><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/book" element={<ProtectedRoute allowedRoles={["patient"]}><PatientBooking /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
