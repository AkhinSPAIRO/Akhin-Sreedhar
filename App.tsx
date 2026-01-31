
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Role, User, Message, Task, TaskStatus } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Check Mic Batteries', description: 'Wireless packs for hosts', assignedTo: Role.STAGE, status: TaskStatus.PENDING, updatedAt: Date.now() },
  { id: '2', title: 'VVIP Catering', description: 'Table 4 requires drinks', assignedTo: Role.HOSPITALITY, status: TaskStatus.IN_PROGRESS, updatedAt: Date.now() },
  { id: '3', title: 'Main Feed Test', description: 'OBS sync check', assignedTo: Role.MEDIA, status: TaskStatus.DONE, updatedAt: Date.now() },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isEmergency, setIsEmergency] = useState(false);
  const [activeIntercom, setActiveIntercom] = useState<Message | null>(null);
  const [onlineDepts, setOnlineDepts] = useState<Record<Role, boolean>>({
    [Role.ADMIN]: true,
    [Role.MEDIA]: false,
    [Role.STAGE]: true,
    [Role.TECH]: true,
    [Role.HOSPITALITY]: false,
    [Role.SECURITY]: true,
  });

  const intercomTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentUser) {
      const welcomeMsg: Message = {
        id: Math.random().toString(),
        from: 'System',
        fromRole: Role.ADMIN,
        to: currentUser.role,
        content: `Operational: ${currentUser.role} channel active. Common Channel 001 Open.`,
        timestamp: Date.now(),
        type: 'SYSTEM',
      };
      setMessages([welcomeMsg]);
    }
  }, [currentUser]);

  const handleLogin = (username: string, role: Role) => {
    setCurrentUser({ id: Math.random().toString(), username, role, isOnline: true });
    setOnlineDepts(prev => ({ ...prev, [role]: true }));
  };

  const handleLogout = () => {
    if (currentUser) setOnlineDepts(prev => ({ ...prev, [currentUser.role]: false }));
    setCurrentUser(null);
  };

  const sendMessage = useCallback((content?: string, audioData?: string, to: Role | 'ALL' = 'ALL') => {
    if (!currentUser) return;
    const newMsg: Message = {
      id: Math.random().toString(),
      from: currentUser.username,
      fromRole: currentUser.role,
      to,
      content,
      audioData,
      timestamp: Date.now(),
      type: audioData ? 'AUDIO' : 'TEXT',
    };
    setMessages(prev => [...prev, newMsg]);
    
    // Simulate Intercom Auto-Play logic for common channel
    if (audioData && to === 'ALL') {
      setActiveIntercom(newMsg);
      if (intercomTimeoutRef.current) clearTimeout(intercomTimeoutRef.current);
      // Simulate playback time
      intercomTimeoutRef.current = window.setTimeout(() => {
        setActiveIntercom(null);
      }, 4000);

      // Trigger local audio element simulation
      const audio = new Audio(audioData);
      audio.play().catch(e => console.log("Auto-play requires user interaction once per session. Listening..."));
    }
  }, [currentUser]);

  const toggleEmergency = useCallback(() => {
    const newState = !isEmergency;
    setIsEmergency(newState);
    if (newState) {
      const alertMsg: Message = {
        id: Math.random().toString(),
        from: 'ADMIN',
        fromRole: Role.ADMIN,
        to: 'ALL',
        content: 'EMERGENCY: ALL STATIONS REPORT!',
        timestamp: Date.now(),
        type: 'ALERT',
      };
      setMessages(prev => [...prev, alertMsg]);
    }
  }, [isEmergency]);

  const updateTask = useCallback((taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status, updatedAt: Date.now() } : t));
  }, []);

  if (!currentUser) return <Login onLogin={handleLogin} />;

  return (
    <div className={`h-screen w-full flex flex-col transition-colors duration-500 overflow-hidden ${isEmergency ? 'bg-red-950' : 'bg-slate-950'}`}>
      {isEmergency && (
        <div className="fixed inset-0 z-50 pointer-events-none border-[8px] md:border-[16px] border-red-600/30 emergency-pulse"></div>
      )}
      <Dashboard 
        currentUser={currentUser}
        messages={messages}
        tasks={tasks}
        isEmergency={isEmergency}
        activeIntercom={activeIntercom}
        onlineDepts={onlineDepts}
        onSendMessage={sendMessage}
        onToggleEmergency={toggleEmergency}
        onUpdateTask={updateTask}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default App;
