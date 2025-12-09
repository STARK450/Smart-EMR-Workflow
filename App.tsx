import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PatientRegistration from './pages/PatientRegistration';
import DoctorConsultation from './pages/DoctorConsultation';
import TestAutomation from './pages/TestAutomation';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'registration':
        return <PatientRegistration />;
      case 'consultation':
        return <DoctorConsultation />;
      case 'automation':
        return <TestAutomation />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
    </AppProvider>
  );
};

export default App;