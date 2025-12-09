export enum PatientStatus {
  Registered = 'Registered',
  InConsultation = 'In Consultation',
  Discharged = 'Discharged',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  contact: string;
  history: string;
  status: PatientStatus;
  registeredAt: string;
}

export interface ConsultationRecord {
  id: string;
  patientId: string;
  doctorName: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  timestamp: string;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  logs: string[];
}

export interface ChartData {
  name: string;
  value: number;
}