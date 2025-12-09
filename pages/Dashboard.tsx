import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PatientStatus } from '../types';

const Dashboard: React.FC = () => {
  const { patients, largeTextMode } = useApp();

  const totalPatients = patients.length;
  const waitingPatients = patients.filter(p => p.status === PatientStatus.Registered).length;
  const dischargedPatients = patients.filter(p => p.status === PatientStatus.Discharged).length;
  const inConsultation = patients.filter(p => p.status === PatientStatus.InConsultation).length;

  const statusData = [
    { name: 'Waiting', value: waitingPatients, color: '#f59e0b' },
    { name: 'In Consult', value: inConsultation, color: '#3b82f6' },
    { name: 'Discharged', value: dischargedPatients, color: '#10b981' },
  ];

  const Card = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Patients" value={totalPatients} icon={Users} color="bg-indigo-500" />
        <Card title="Waiting" value={waitingPatients} icon={Clock} color="bg-amber-500" />
        <Card title="In Consultation" value={inConsultation} icon={AlertCircle} color="bg-blue-500" />
        <Card title="Discharged" value={dischargedPatients} icon={CheckCircle} color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Patient Status Distribution</h3>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: largeTextMode ? 16 : 12 }} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            {patients.slice(0, 5).map((patient) => (
              <li key={patient.id} className="flex items-center space-x-3 pb-3 border-b border-slate-50 last:border-0">
                <div className={`w-2 h-2 rounded-full ${
                  patient.status === PatientStatus.Registered ? 'bg-amber-500' :
                  patient.status === PatientStatus.InConsultation ? 'bg-blue-500' : 'bg-emerald-500'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-slate-700">{patient.name}</p>
                  <p className="text-xs text-slate-400">{patient.status} • {new Date(patient.registeredAt).toLocaleTimeString()}</p>
                </div>
              </li>
            ))}
            {patients.length === 0 && <p className="text-slate-400 text-sm">No activity recorded yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;