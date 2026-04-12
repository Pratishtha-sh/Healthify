// Shared mock doctor roster – used by AdminDashboard (doctor picker) and DoctorDashboard
export const MOCK_DOCTORS = [
    { id: "DOC001", name: "Dr. Sachdev Kumar",    specialty: "General Physician", qualification: "MD, AIIMS Delhi" },
    { id: "DOC002", name: "Dr. Priya Sharma",     specialty: "General Physician", qualification: "MBBS, PGI Chandigarh" },
    { id: "DOC003", name: "Dr. Armaan Syed",      specialty: "Cardiologist",      qualification: "DM Cardiology, AIIMS" },
    { id: "DOC004", name: "Dr. Sakshi Mohapatra", specialty: "Cardiologist",      qualification: "MD, PGIMER" },
    { id: "DOC005", name: "Dr. Rahul Mehta",      specialty: "Dermatologist",     qualification: "MD Dermatology, KEM Mumbai" },
    { id: "DOC006", name: "Dr. Anjali Singh",     specialty: "Pediatrician",      qualification: "MD Pediatrics, AIIMS" },
    { id: "DOC007", name: "Dr. Vikram Nair",      specialty: "Orthopedic",        qualification: "MS Orthopedics, CMC Vellore" },
    { id: "DOC008", name: "Dr. Sonal Gupta",      specialty: "Neurologist",       qualification: "DM Neurology, NIMHANS" },
    { id: "DOC009", name: "Dr. Kavya Reddy",      specialty: "ENT Specialist",    qualification: "MS ENT, Osmania Medical College" },
];

export const getDoctorsBySpecialty = (specialty) =>
    MOCK_DOCTORS.filter(d => d.specialty === specialty);

export const getDoctorById = (id) =>
    MOCK_DOCTORS.find(d => d.id === id) || null;
