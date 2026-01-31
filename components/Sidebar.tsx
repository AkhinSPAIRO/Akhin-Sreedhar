
import React from 'react';
import { User, Role } from '../types';

interface SidebarProps {
  currentUser: User;
  onlineDepts: Record<Role, boolean>;
  onLogout: () => void;
  onToggleEmergency: () => void;
  isEmergency: boolean;
  activeTab: 'CHAT' | 'TASKS' | 'STATUS';
  setActiveTab: (tab: 'CHAT' | 'TASKS' | 'STATUS') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentUser, 
  onlineDepts, 
  onLogout, 
  onToggleEmergency, 
  isEmergency,
  activeTab,
  setActiveTab
}) => {
  const isAdmin = currentUser.role === Role.ADMIN;

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">
            {currentUser.username.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold truncate text-sm">{currentUser.username}</p>
            <p className="text-xs text-blue-400 font-semibold">{currentUser.role}</p>
          </div>
        </div>

        <nav className="space-y-1">
          <button 
            onClick={() => setActiveTab('CHAT')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'CHAT' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
          >
            Communication
          </button>
          <button 
            onClick={() => setActiveTab('TASKS')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'TASKS' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
          >
            Tasks & Ops
          </button>
          <button 
            onClick={() => setActiveTab('STATUS')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'STATUS' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
          >
            System Status
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Departments</h3>
          <div className="space-y-2">
            {Object.entries(onlineDepts).map(([role, isOnline]) => (
              <div key={role} className="flex items-center justify-between px-2 py-1">
                <span className="text-xs text-slate-300 font-medium">{role}</span>
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-700'}`}></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 space-y-3">
        {isAdmin && (
          <button
            onClick={onToggleEmergency}
            className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
              isEmergency 
                ? 'bg-slate-100 text-red-600' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isEmergency ? 'Reset Alert' : 'Red Alert'}
          </button>
        )}
        <button
          onClick={onLogout}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 py-2 rounded-lg text-xs font-semibold transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
