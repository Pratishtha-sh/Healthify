import Navbar from "../components/Navbar";
import Card from "../components/Card";

const PatientDashboard = () => {
    return (
        <>
            <Navbar
                links={[
                    { label: "Home", path: "/patient" },
                    { label: "Book Appointment", path: "/patient" },
                    { label: "My Records", path: "/patient" },
                ]}
            />
            <div className="page-content">
                <h1>Patient Portal</h1>
                <Card style={{ marginTop: "2rem" }}>
                    <h2>Welcome to Healthify</h2>
                    <p>Your health records and appointments will appear here soon.</p>
                </Card>
            </div>
        </>
    );
};

export default PatientDashboard;
