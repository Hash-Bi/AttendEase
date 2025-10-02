export type UserRole = 'principal' | 'hod' | 'advisor';

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  department?: string;
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  department: string;
  year: number;
  advisorId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: string;
  remarks?: string;
}
