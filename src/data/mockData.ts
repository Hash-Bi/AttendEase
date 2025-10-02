import { User, Student, AttendanceRecord, Section } from '../types';

export const users: User[] = [
  {
    id: '1',
    email: 'principal@college.edu',
    password: 'principal123',
    fullName: 'Dr. Robert Johnson',
    role: 'principal',
  },
  {
    id: '2',
    email: 'hod.cs@college.edu',
    password: 'hod123',
    fullName: 'Prof. Sarah Williams',
    role: 'hod',
    department: 'Computer Science',
  },
  {
    id: '3',
    email: 'hod.ee@college.edu',
    password: 'hod123',
    fullName: 'Prof. Michael Brown',
    role: 'hod',
    department: 'Electrical Engineering',
  },
  {
    id: '4',
    email: 'advisor.cs1@college.edu',
    password: 'advisor123',
    fullName: 'Dr. Emily Davis',
    role: 'advisor',
    department: 'Computer Science',
  },
  {
    id: '5',
    email: 'advisor.cs2@college.edu',
    password: 'advisor123',
    fullName: 'Dr. James Wilson',
    role: 'advisor',
    department: 'Computer Science',
  },
  {
    id: '6',
    email: 'advisor.ee1@college.edu',
    password: 'advisor123',
    fullName: 'Dr. Lisa Anderson',
    role: 'advisor',
    department: 'Electrical Engineering',
  },
];

export const sections: Section[] = [
  {
    id: 'sec1',
    name: 'Section A',
    department: 'Computer Science',
    year: 3,
    advisorId: '4',
  },
  {
    id: 'sec2',
    name: 'Section B',
    department: 'Computer Science',
    year: 2,
    advisorId: '5',
  },
  {
    id: 'sec3',
    name: 'Section A',
    department: 'Electrical Engineering',
    year: 3,
    advisorId: '6',
  },
];

export const students: Student[] = [
  {
    id: 's1',
    rollNumber: 'CS2021001',
    name: 'Alex Kumar',
    department: 'Computer Science',
    year: 3,
    advisorId: '4',
    sectionId: 'sec1',
  },
  {
    id: 's2',
    rollNumber: 'CS2021002',
    name: 'Maya Patel',
    department: 'Computer Science',
    year: 3,
    advisorId: '4',
    sectionId: 'sec1',
  },
  {
    id: 's3',
    rollNumber: 'CS2021003',
    name: 'Rahul Sharma',
    department: 'Computer Science',
    year: 3,
    advisorId: '4',
    sectionId: 'sec1',
  },
  {
    id: 's4',
    rollNumber: 'CS2022001',
    name: 'Priya Singh',
    department: 'Computer Science',
    year: 2,
    advisorId: '5',
    sectionId: 'sec2',
  },
  {
    id: 's5',
    rollNumber: 'CS2022002',
    name: 'Arjun Reddy',
    department: 'Computer Science',
    year: 2,
    advisorId: '5',
    sectionId: 'sec2',
  },
  {
    id: 's6',
    rollNumber: 'EE2021001',
    name: 'Sneha Gupta',
    department: 'Electrical Engineering',
    year: 3,
    advisorId: '6',
    sectionId: 'sec3',
  },
  {
    id: 's7',
    rollNumber: 'EE2021002',
    name: 'Vikram Joshi',
    department: 'Electrical Engineering',
    year: 3,
    advisorId: '6',
    sectionId: 'sec3',
  },
  {
    id: 's8',
    rollNumber: 'EE2022001',
    name: 'Anjali Verma',
    department: 'Electrical Engineering',
    year: 2,
    advisorId: '6',
    sectionId: 'sec3',
  },
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const attendanceRecords: AttendanceRecord[] = [
  { id: 'a1', studentId: 's1', date: today, status: 'present', markedBy: '4' },
  { id: 'a2', studentId: 's2', date: today, status: 'present', markedBy: '4' },
  { id: 'a3', studentId: 's3', date: today, status: 'absent', markedBy: '4', remarks: 'Medical leave' },
  { id: 'a4', studentId: 's4', date: today, status: 'present', markedBy: '5' },
  { id: 'a5', studentId: 's5', date: today, status: 'late', markedBy: '5', remarks: 'Arrived 15 mins late' },
  { id: 'a6', studentId: 's6', date: today, status: 'present', markedBy: '6' },
  { id: 'a7', studentId: 's7', date: today, status: 'present', markedBy: '6' },
  { id: 'a8', studentId: 's8', date: today, status: 'absent', markedBy: '6' },

  { id: 'a9', studentId: 's1', date: yesterday, status: 'present', markedBy: '4' },
  { id: 'a10', studentId: 's2', date: yesterday, status: 'present', markedBy: '4' },
  { id: 'a11', studentId: 's3', date: yesterday, status: 'present', markedBy: '4' },
  { id: 'a12', studentId: 's4', date: yesterday, status: 'absent', markedBy: '5' },
  { id: 'a13', studentId: 's5', date: yesterday, status: 'present', markedBy: '5' },
];
