
import React from 'react';
import { Task, TaskStatus, Role, User } from '../types';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, status: TaskStatus) => void;
  currentUser: User;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask, currentUser }) => {
  const filteredTasks = currentUser.role === Role.ADMIN 
    ? tasks 
    : tasks.filter(t => t.assignedTo === currentUser.role);

  return (
    <div className="p-6 overflow-y-auto h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      {filteredTasks.length === 0 && (
        <div className="col-span-full py-20 text-center text-slate-500">
          <p className="text-xl font-bold">No active tasks for your department</p>
          <p className="text-sm mt-2">Check back later or contact Admin</p>
        </div>
      )}
      
      {filteredTasks.map((task) => (
        <div key={task.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:border-blue-500/50 transition-all">
          <div className="p-4 border-b border-slate-700 flex justify-between items-start">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              task.assignedTo === Role.TECH ? 'bg-blue-900/50 text-blue-400' :
              task.assignedTo === Role.SECURITY ? 'bg-red-900/50 text-red-400' :
              'bg-emerald-900/50 text-emerald-400'
            }`}>
              {task.assignedTo}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              UPD: {new Date(task.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="p-4 space-y-2">
            <h4 className="font-bold text-slate-100">{task.title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{task.description}</p>
          </div>

          <div className="p-4 bg-slate-900/50 grid grid-cols-3 gap-1">
            {Object.values(TaskStatus).map((status) => (
              <button
                key={status}
                onClick={() => onUpdateTask(task.id, status)}
                className={`text-[9px] py-1.5 rounded font-bold uppercase transition-all ${
                  task.status === status
                    ? status === TaskStatus.DONE ? 'bg-emerald-600 text-white' :
                      status === TaskStatus.IN_PROGRESS ? 'bg-amber-600 text-white' :
                      'bg-slate-600 text-white'
                    : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
