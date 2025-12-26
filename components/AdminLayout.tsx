
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
<<<<<<< HEAD
import { LayoutDashboard, FileText, Users, Settings, LogOut, Files, Menu, X, Megaphone, Code2 } from 'lucide-react';
=======
import { LayoutDashboard, FileText, Users, Settings, LogOut, Files, Menu, X, Megaphone, Code2, Zap, Radio } from 'lucide-react';
import { autoPilot } from '../services/autoPilotService';
>>>>>>> 81afd11 (Update admin pages, services, and editors)

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiActive, setIsAiActive] = useState(autoPilot.getStatus());

  useEffect(() => {
    // Jalankan service jika status aktif di localStorage
    if (autoPilot.getStatus()) {
      autoPilot.execute();
    }
    
    // Subscribe ke perubahan status
    autoPilot.subscribe((status: string) => {
      setIsAiActive(status === 'active');
    }, null);
  }, []);

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/articles', icon: <FileText size={20} />, label: 'Berita' },
    { 
      path: '/admin/viral-generator', 
      icon: <div className="relative">
        <Zap size={20} className={isAiActive ? 'text-accent' : 'text-gray-400'} />
        {isAiActive && <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>}
      </div>, 
      label: 'Viral AI Generator' 
    },
    { path: '/admin/pages', icon: <Files size={20} />, label: 'Halaman Statis' },
    { path: '/admin/banners', icon: <Megaphone size={20} />, label: 'Manajemen Iklan' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Pengguna' },
    { path: '/admin/api-management', icon: <Code2 size={20} />, label: 'Integrasi API' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Pengaturan' },
  ];

  const isActive = (path: string) => location.pathname === path ? 'bg-ink text-paper' : 'hover:bg-gray-200 text-ink';

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans overflow-hidden">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-300 flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-300 flex justify-between items-center">
           <div>
             <h1 className="font-serif text-2xl font-bold tracking-tight">Pamong<span className="text-accent">Admin</span></h1>
             {isAiActive && (
               <div className="flex items-center gap-1 mt-1">
                 <Radio size={10} className="text-green-500 animate-pulse" />
                 <span className="text-[9px] font-black uppercase text-green-600 tracking-widest">AI Auto-Pilot Active</span>
               </div>
             )}
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-ink">
             <X size={24} />
           </button>
        </div>

        <nav className="flex-grow p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.path}>
                <Link to={item.path} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-medium text-sm ${isActive(item.path)}`}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-300 bg-gray-50">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                 <img src="https://ui-avatars.com/api/?name=Admin" alt="Admin" />
              </div>
              <div>
                 <p className="text-sm font-bold">Administrator</p>
                 <p className="text-xs text-green-600">Online</p>
              </div>
           </div>
           <Link to="/" className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-bold border border-red-100 hover:border-red-200 transition-all">
              <LogOut size={16}/>
              <span>Keluar / Ke Website</span>
           </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="lg:hidden bg-white border-b border-gray-300 p-4 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="text-ink hover:text-accent transition-colors">
            <Menu size={24} />
          </button>
          <span className="font-serif font-bold text-lg">PamongAdmin</span>
        </header>

        <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-gray-100">
           {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
