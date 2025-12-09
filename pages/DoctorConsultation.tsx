import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Patient, PatientStatus, ConsultationRecord } from '../types';
import { getAIClinicalSuggestion } from '../services/geminiService';
import { Stethoscope, ClipboardList, Bot, FileCheck, Mic } from 'lucide-react';

const DoctorConsultation: React.FC = () => {
  const { patients, addConsultation, updatePatientStatus } = useApp();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  
  const [consultationData, setConsultationData] = useState({
    diagnosis: '',
    prescription: '',
    notes: ''
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Filter patients who are waiting or already in consultation
  const activePatients = patients.filter(
    p => p.status === PatientStatus.Registered || p.status === PatientStatus.InConsultation
  );

  useEffect(() => {
    if (selectedPatientId && selectedPatient?.status === PatientStatus.Registered) {
      updatePatientStatus(selectedPatientId, PatientStatus.InConsultation);
    }
  }, [selectedPatientId]);

  const handleGetSuggestion = async () => {
    if (!selectedPatient) return;
    setLoadingAi(true);
    const suggestion = await getAIClinicalSuggestion(consultationData.notes || "Routine checkup", selectedPatient.history);
    setAiSuggestion(suggestion);
    setLoadingAi(false);
  };

  const handleSpeakSuggestion = () => {
    if ('speechSynthesis' in window && aiSuggestion) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(aiSuggestion);
        utterance.onend = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setSpeaking(true);
      }
    }
  };

  const handleComplete = () => {
    if (!selectedPatient) return;
    
    const record: ConsultationRecord = {
      id: `C-${Date.now()}`,
      patientId: selectedPatient.id,
      doctorName: 'Dr. House', // Mock doctor
      diagnosis: consultationData.diagnosis,
      prescription: consultationData.prescription,
      notes: consultationData.notes,
      timestamp: new Date().toISOString()
    };

    addConsultation(record);
    setSelectedPatientId('');
    setConsultationData({ diagnosis: '', prescription: '', notes: '' });
    setAiSuggestion('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Patient List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <ClipboardList size={18} />
            Waiting Queue
          </h3>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {activePatients.map(p => (
            <div 
              key={p.id}
              onClick={() => setSelectedPatientId(p.id)}
              className={`p-3 rounded-lg cursor-pointer border transition-all ${
                selectedPatientId === p.id 
                  ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' 
                  : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-medium text-slate-800">{p.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'Registered' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {p.status === 'Registered' ? 'Waiting' : 'Active'}
                </span>
              </div>
              <div className="text-sm text-slate-500 mt-1">{p.age}y / {p.gender}</div>
            </div>
          ))}
          {activePatients.length === 0 && (
            <div className="text-center p-8 text-slate-400">No patients in queue</div>
          )}
        </div>
      </div>

      {/* Consultation Panel */}
      <div className="lg:col-span-2 flex flex-col space-y-6 overflow-y-auto">
        {selectedPatient ? (
          <>
            {/* Patient Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedPatient.name}</h2>
                  <p className="text-slate-500 mt-1">ID: {selectedPatient.id} • {selectedPatient.age} years • {selectedPatient.gender}</p>
                </div>
                <div className="bg-rose-50 px-4 py-2 rounded-lg border border-rose-100 max-w-xs">
                  <p className="text-xs text-rose-500 font-bold uppercase tracking-wider mb-1">Medical History</p>
                  <p className="text-sm text-rose-800">{selectedPatient.history}</p>
                </div>
              </div>
            </div>

            {/* Input Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Clinical Notes & Symptoms</label>
                <textarea
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                  placeholder="Patient complains of..."
                  value={consultationData.notes}
                  onChange={e => setConsultationData({...consultationData, notes: e.target.value})}
                />
              </div>

              {/* AI Assist Section */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-indigo-900 font-semibold flex items-center gap-2">
                    <Bot size={18} />
                    AI Clinical Support
                  </h4>
                  <button 
                    onClick={handleGetSuggestion}
                    disabled={loadingAi || !consultationData.notes}
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {loadingAi ? 'Analyzing...' : 'Analyze Symptoms'}
                  </button>
                </div>
                {aiSuggestion && (
                  <div className="bg-white/60 p-3 rounded border border-indigo-100 text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap">
                    {aiSuggestion}
                    <div className="mt-2 flex justify-end">
                       <button onClick={handleSpeakSuggestion} className="p-1 hover:bg-indigo-200 rounded text-indigo-600" title="Read Aloud">
                          <Mic size={16} className={speaking ? "animate-pulse" : ""} />
                       </button>
                    </div>
                  </div>
                )}
                {!aiSuggestion && !loadingAi && (
                   <p className="text-xs text-indigo-400 italic">Enter notes and click analyze to get diagnostic suggestions.</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Diagnosis</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Primary Diagnosis"
                    value={consultationData.diagnosis}
                    onChange={e => setConsultationData({...consultationData, diagnosis: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Prescription</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Medication & Dosage"
                    value={consultationData.prescription}
                    onChange={e => setConsultationData({...consultationData, prescription: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleComplete}
                  disabled={!consultationData.diagnosis}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileCheck size={20} />
                  <span>Finalize & Discharge</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            <Stethoscope size={48} className="mb-4 text-slate-300" />
            <p className="text-lg font-medium">Select a patient to begin consultation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorConsultation;