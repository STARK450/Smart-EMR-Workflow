import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient, ConsultationRecord, PatientStatus, Gender } from '../types';

interface AppContextType {
  patients: Patient[];
  consultations: ConsultationRecord[];
  addPatient: (patient: Patient) => void;
  updatePatientStatus: (id: string, status: PatientStatus) => void;
  addConsultation: (record: ConsultationRecord) => void;
  largeTextMode: boolean;
  toggleLargeText: () => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Data
const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P-1001',
    name: 'John Doe',
    age: 45,
    gender: Gender.Male,
    contact: '555-0101',
    history: 'Hypertension, Seasonal Allergies',
    status: PatientStatus.Registered,
    registeredAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'P-1002',
    name: 'Jane Smith',
    age: 32,
    gender: Gender.Female,
    contact: '555-0102',
    history: 'None',
    status: PatientStatus.InConsultation,
    registeredAt: new Date().toISOString(),
  },
  {
    id: 'P-1003',
    name: 'Robert Brown',
    age: 68,
    gender: Gender.Male,
    contact: '555-0103',
    history: 'Type 2 Diabetes',
    status: PatientStatus.Discharged,
    registeredAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [largeTextMode, setLargeTextMode] = useState(false);

  const addPatient = (patient: Patient) => {
    setPatients(prev => [patient, ...prev]);
  };

  const updatePatientStatus = (id: string, status: PatientStatus) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const addConsultation = (record: ConsultationRecord) => {
    setConsultations(prev => [record, ...prev]);
    updatePatientStatus(record.patientId, PatientStatus.Discharged);
  };

  const toggleLargeText = () => {
    setLargeTextMode(prev => !prev);
  };

  const resetData = () => {
      setPatients(MOCK_PATIENTS);
      setConsultations([]);
  }

  return (
    <AppContext.Provider value={{
      patients,
      consultations,
      addPatient,
      updatePatientStatus,
      addConsultation,
      largeTextMode,
      toggleLargeText,
      resetData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};