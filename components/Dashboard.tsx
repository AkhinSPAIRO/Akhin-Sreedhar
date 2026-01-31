
import React, { useState } from 'react';
import { User, Message, Task, Role, TaskStatus } from '../types';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import TaskList from './TaskList';
import StatsOverview from './StatsOverview';
import IntercomBar from './IntercomBar';
import PushToTalk from './PushToTalk';

interface DashboardProps {
  currentUser: User;
  messages: Message[];
  tasks: Task[];
  isEmergency: boolean;
  activeIntercom: Message | null;
  onlineDepts: Record<Role, boolean>;
  onSendMessage: (content?: string, audioData?: string, to?: Role | 'ALL') => void;
  onToggleEmergency: () => void;
  onUpdateTask: (id: string, status: TaskStatus) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  messages,
  tasks,
  isEmergency,
  activeIntercom,
  onlineDepts,
  onSendMessage,
  onToggleEmergency,
  onUpdateTask,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'CHAT' | 'TASKS' | 'STATUS'>('CHAT');
  const [selectedChannel, setSelectedChannel] = useState<Role | 'ALL'>('ALL');

  return (
    <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar 
          currentUser={currentUser} 
          onlineDepts={onlineDepts}
          onLogout={onLogout}
          onToggleEmergency={onToggleEmergency}
          isEmergency={isEmergency}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <main className="flex-1 flex flex-col bg-slate-900 relative overflow-hidden">
        {/* Persistent Intercom Bar */}
        <IntercomBar activeTransmission={activeIntercom} isEmergency={isEmergency} />

        <header className="h-14 md:h-16 border-b border-slate-800 flex items-center justify-between px-4 md:px-6 bg-slate-950">
          <div className="flex items-center space-x-3">
            <h2 className="text-sm md:text-lg font-bold text-slate-100 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isEmergency ? 'bg-red-500 animate-ping' : 'bg-blue-500'}`}></span>
              {activeTab === 'CHAT' ? `Comm: ${selectedChannel}` : activeTab}
            </h2>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Global Walkie-Talkie Shortcut for Desktop */}
            <div className="hidden lg:flex items-center bg-slate-900 border border-slate-700 rounded-full px-2 py-1 gap-2 scale-75">
               <span className="text-[9px] font-bold text-slate-500 ml-2">QUICK INTERCOM</span>
               <PushToTalk onAudioReady={(audio) => onSendMessage(undefined, audio, 'ALL')} />
            </div>

            {currentUser.role === Role.ADMIN && (
               <button 
                onClick={onToggleEmergency}
                className={`p-2 rounded-lg ${isEmergency ? 'bg-white text-red-600' : 'bg-red-600 text-white'} md:hidden`}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 14c-.77 1.333.192 3 1.732 3z" />
                 </svg>
               </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'CHAT' && (
            <ChatWindow 
              messages={messages} 
              onSend={(msg, audio) => onSendMessage(msg, audio, selectedChannel)} 
              currentUser={currentUser}
              selectedChannel={selectedChannel}
              onChannelChange={setSelectedChannel}
            />
          )}

          {activeTab === 'TASKS' && (
            <TaskList tasks={tasks} onUpdateTask={onUpdateTask} currentUser={currentUser} />
          )}

          {activeTab === 'STATUS' && (
            <StatsOverview onlineDepts={onlineDepts} tasks={tasks} />
          )}
        </div>

        {/* Mobile Bottom Nav + Global PTT */}
        <nav className="md:hidden flex flex-col border-t border-slate-800 bg-slate-950 z-50">
          {/* Quick Intercom PTT Row */}
          <div className="flex justify-center -mt-8 py-2 pointer-events-none">
            <div className="pointer-events-auto bg-slate-950 rounded-full p-2 border-t border-slate-800 shadow-2xl">
               <PushToTalk onAudioReady={(audio) => onSendMessage(undefined, audio, 'ALL')} />
            </div>
          </div>
          
          <div className="flex h-16 px-2 items-center justify-around">
            <button 
              onClick={() => setActiveTab('CHAT')}
              className={`flex flex-col items-center justify-center w-20 h-full transition-colors ${activeTab === 'CHAT' ? 'text-blue-500' : 'text-slate-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-[10px] mt-1 font-bold">Comm</span>
            </button>
            <button 
              onClick={() => setActiveTab('TASKS')}
              className={`flex flex-col items-center justify-center w-20 h-full transition-colors ${activeTab === 'TASKS' ? 'text-blue-500' : 'text-slate-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="text-[10px] mt-1 font-bold">Tasks</span>
            </button>
            <button 
              onClick={() => setActiveTab('STATUS')}
              className={`flex flex-col items-center justify-center w-20 h-full transition-colors ${activeTab === 'STATUS' ? 'text-blue-500' : 'text-slate-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-[10px] mt-1 font-bold">Status</span>
            </button>
            <button 
              onClick={onLogout}
              className="flex flex-col items-center justify-center w-20 h-full text-slate-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-[10px] mt-1 font-bold">Exit</span>
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
};

export default Dashboard;
