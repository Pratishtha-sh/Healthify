import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// Page Imports
import LoginPage           from "./pages/LoginPage";
import AdminDashboard      from "./pages/AdminDashboard";
import BillingPage         from "./pages/BillingPage";
import DoctorDashboard     from "./pages/DoctorDashboard";
import PharmacyManager     from "./pages/PharmacyManager";
import PatientDashboard    from "./pages/PatientDashboard";
import PatientBooking      from "./pages/PatientBooking";
import MedicalRecords      from "./pages/MedicalRecords";
import PatientRegistration from "./pages/PatientRegistration";
import RoomManagement      from "./pages/RoomManagement";
import ScheduleAppointment from "./pages/ScheduleAppointment";

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem("userRole");
    if (!role) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" replace />;
    return children;
};

const RECEP_ROLES = ["admin", "receptionist"];

function App() {
    return (
        <Router>
            <div className="app-layout">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    {/* ── Admin / Receptionist ── */}
                    <Route path="/admin"                    element={<ProtectedRoute allowedRoles={RECEP_ROLES}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/register-patient"   element={<ProtectedRoute allowedRoles={RECEP_ROLES}><PatientRegistration /></ProtectedRoute>} />
                    <Route path="/admin/rooms"              element={<ProtectedRoute allowedRoles={RECEP_ROLES}><RoomManagement /></ProtectedRoute>} />
                    <Route path="/admin/schedule"           element={<ProtectedRoute allowedRoles={RECEP_ROLES}><ScheduleAppointment /></ProtectedRoute>} />
                    <Route path="/billing"                  element={<ProtectedRoute allowedRoles={RECEP_ROLES}><BillingPage /></ProtectedRoute>} />

                    {/* ── Doctor ── */}
                    <Route path="/doctor"                   element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />

                    {/* ── Pharmacy ── */}
                    <Route path="/pharmacy"                 element={<ProtectedRoute allowedRoles={["pharmacist", "admin"]}><PharmacyManager /></ProtectedRoute>} />

                    {/* ── Patient ── */}
                    <Route path="/patient"                  element={<ProtectedRoute allowedRoles={["patient"]}><PatientDashboard /></ProtectedRoute>} />
                    <Route path="/patient/book"             element={<ProtectedRoute allowedRoles={["patient"]}><PatientBooking /></ProtectedRoute>} />
                    <Route path="/patient/records"          element={<ProtectedRoute allowedRoles={["patient"]}><MedicalRecords /></ProtectedRoute>} />

                    {/* ── Fallback ── */}
                    <Route path="/"   element={<Navigate to="/login" replace />} />
                    <Route path="*"   element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
