import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { TrendingUp, Users, FileText, MessageSquare } from 'lucide-react';

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, trend: string }> = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-ink">{value}</h3>
      </div>
      <div className="p-2 bg-gray-100 rounded text-ink">{icon}</div>
    </div>
    <p className="text-xs text-green-600 mt-4 font-bold">{trend}</p>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">Dashboard Redaksi</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Pembaca" value="12,543" icon={<Users size={24}/>} trend="+12% minggu ini" />
        <StatCard title="Artikel Terbit" value="48" icon={<FileText size={24}/>} trend="+4 artikel hari ini" />
        <StatCard title="Interaksi AI" value="342" icon={<TrendingUp size={24}/>} trend="Fitur populer" />
        <StatCard title="Komentar Masuk" value="89" icon={<MessageSquare size={24}/>} trend="Perlu moderasi" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded border border-gray-200">
          <h3 className="font-bold mb-4">Artikel Terpopuler</h3>
          <ul className="space-y-4">
            {[1, 2, 3].map(i => (
              <li key={i} className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div>
                  <p className="font-medium text-sm">Kebijakan Baru Parkir Kota Menuai Protes</p>
                  <p className="text-xs text-gray-500">Politik & Pemerintahan</p>
                </div>
                <span className="text-sm font-bold text-ink">1.2k Views</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded border border-gray-200">
          <h3 className="font-bold mb-4">Status Sistem</h3>
          <div className="space-y-4">
             <div className="flex justify-between text-sm">
                <span>Database (Supabase)</span>
                <span className="text-green-600 font-bold">Terhubung</span>
             </div>
             <div className="flex justify-between text-sm">
                <span>AI Engine (Gemini 2.5)</span>
                <span className="text-green-600 font-bold">Aktif</span>
             </div>
             <div className="flex justify-between text-sm">
                <span>Storage Media</span>
                <span className="text-yellow-600 font-bold">75% Penuh</span>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;