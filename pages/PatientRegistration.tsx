import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Patient, Gender, PatientStatus } from '../types';
import { Sparkles, Save, RotateCw } from 'lucide-react';
import { generatePatientData } from '../services/geminiService';

const PatientRegistration: React.FC = () => {
  const { addPatient } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: Gender.Male,
    contact: '',
    history: '',
  });

  const handleAIAutofill = async () => {
    setLoading(true);
    const data = await generatePatientData();
    if (data) {
      setFormData({
        name: data.name,
        age: data.age.toString(),
        gender: data.gender as Gender,
        contact: data.contact,
        history: data.history
      });
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.contact) return;

    const newPatient: Patient = {
      id: `P-${Math.floor(Math.random() * 10000)}`,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      contact: formData.contact,
      history: formData.history,
      status: PatientStatus.Registered,
      registeredAt: new Date().toISOString()
    };

    addPatient(newPatient);
    // Reset form
    setFormData({
      name: '',
      age: '',
      gender: Gender.Male,
      contact: '',
      history: '',
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">New Patient Registration</h2>
          <button 
            onClick={handleAIAutofill}
            disabled={loading}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium backdrop-blur-sm"
          >
            {loading ? <RotateCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
            <span>AI Autofill</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Ex. John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Age</label>
              <input
                type="number"
                required
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Ex. 45"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value as Gender})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              >
                <option value={Gender.Male}>Male</option>
                <option value={Gender.Female}>Female</option>
                <option value={Gender.Other}>Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Contact Number</label>
              <input
                type="tel"
                required
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="(555) 000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Medical History / Symptoms</label>
            <textarea
              value={formData.history}
              onChange={(e) => setFormData({...formData, history: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Enter past medical conditions, allergies, or current complaints..."
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Save size={18} />
              <span>Register Patient</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;