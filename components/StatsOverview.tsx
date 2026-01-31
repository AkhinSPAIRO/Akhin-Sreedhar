
import React from 'react';
import { Role, Task, TaskStatus } from '../types';

interface StatsOverviewProps {
  onlineDepts: Record<Role, boolean>;
  tasks: Task[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ onlineDepts, tasks }) => {
  const onlineCount = Object.values(onlineDepts).filter(Boolean).length;
  const totalDepts = Object.keys(onlineDepts).length;
  
  const taskCounts = {
    [TaskStatus.PENDING]: tasks.filter(t => t.status === TaskStatus.PENDING).length,
    [TaskStatus.IN_PROGRESS]: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    [TaskStatus.DONE]: tasks.filter(t => t.status === TaskStatus.DONE).length,
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-sm font-semibold text-slate-400">Online Departments</p>
          <p className="text-4xl font-black mt-2 text-emerald-400">{onlineCount} / {totalDepts}</p>
          <div className="mt-4 w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-1000" 
              style={{ width: `${(onlineCount / totalDepts) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-sm font-semibold text-slate-400">Task Completion</p>
          <p className="text-4xl font-black mt-2 text-blue-400">
            {Math.round((taskCounts[TaskStatus.DONE] / tasks.length) * 100) || 0}%
          </p>
          <div className="mt-4 flex space-x-1">
            {tasks.map(t => (
              <div 
                key={t.id} 
                className={`flex-1 h-1.5 rounded-full ${
                  t.status === TaskStatus.DONE ? 'bg-emerald-500' :
                  t.status === TaskStatus.IN_PROGRESS ? 'bg-amber-500' :
                  'bg-slate-600'
                }`}
              ></div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-sm font-semibold text-slate-400">System Latency</p>
          <p className="text-4xl font-black mt-2 text-slate-100 font-mono">4ms</p>
          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">Local Network: 192.168.0.10</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h3 className="font-bold mb-6 flex items-center gap-2">
          Operational Health Monitor
        </h3>
        <div className="space-y-6">
          {Object.entries(onlineDepts).map(([role, isOnline]) => {
            const deptTasks = tasks.filter(t => t.assignedTo === role as Role);
            const done = deptTasks.filter(t => t.status === TaskStatus.DONE).length;
            const progress = deptTasks.length > 0 ? (done / deptTasks.length) * 100 : 100;

            return (
              <div key={role} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-bold text-slate-200">{role}</span>
                    <span className="text-[10px] text-slate-500">{deptTasks.length} Assigned</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isOnline ? 'bg-blue-500' : 'bg-slate-800'}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
