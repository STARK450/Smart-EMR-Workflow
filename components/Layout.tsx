import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  UserPlus, 
  Stethoscope, 
  TestTube2, 
  Settings, 
  Menu,
  Activity,
  Type
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { largeTextMode, toggleLargeText } = useApp();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const NavItem = ({ page, icon: Icon, label }: { page: string, icon: any, label: string }) => (
    <button
      onClick={() => onNavigate(page)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
        ${currentPage === page 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
        }
        ${largeTextMode ? 'text-lg' : 'text-sm'} font-medium
      `}
    >
      <Icon size={largeTextMode ? 24 : 20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className={`flex h-screen bg-slate-50 overflow-hidden ${largeTextMode ? 'text-lg' : 'text-base'}`}>
      
      {/* Sidebar */}
      <div 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-20 shadow-lg md:shadow-none`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center space-x-2 ${!sidebarOpen && 'hidden'} transition-opacity`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="text-white" size={20} />
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">HealSync</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-slate-100 text-slate-500">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <NavItem page="dashboard" icon={LayoutDashboard} label={sidebarOpen ? "Dashboard" : ""} />
          <NavItem page="registration" icon={UserPlus} label={sidebarOpen ? "Registration" : ""} />
          <NavItem page="consultation" icon={Stethoscope} label={sidebarOpen ? "Consultation" : ""} />
          <NavItem page="automation" icon={TestTube2} label={sidebarOpen ? "Test Suite" : ""} />
        </nav>

        <div className="p-4 border-t border-slate-100">
             <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs">
                 {sidebarOpen && <span>v1.0.0 Alpha</span>}
             </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <h1 className="font-semibold text-slate-800 capitalize">{currentPage}</h1>
          <div className="flex items-center space-x-4">
            <button 
                onClick={toggleLargeText}
                className={`p-2 rounded-full border ${largeTextMode ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'} flex items-center gap-2`}
                title="Toggle Large Text (Accessibility)"
            >
                <Type size={18} />
                <span className="text-xs font-medium hidden sm:inline">Accessibility</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 text-xs font-bold">
              DR
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;