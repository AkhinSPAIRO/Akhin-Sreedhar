
export enum Role {
  ADMIN = 'ADMIN',
  MEDIA = 'MEDIA',
  STAGE = 'STAGE',
  TECH = 'TECH',
  HOSPITALITY = 'HOSPITALITY',
  SECURITY = 'SECURITY'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface User {
  id: string;
  username: string;
  role: Role;
  isOnline: boolean;
}

export interface Message {
  id: string;
  from: string;
  fromRole: Role;
  to: Role | 'ALL';
  content?: string;
  audioData?: string; // Base64 encoded audio
  timestamp: number;
  type: 'TEXT' | 'ALERT' | 'SYSTEM' | 'AUDIO';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: Role;
  status: TaskStatus;
  updatedAt: number;
}
