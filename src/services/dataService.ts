import { Student, AttendanceRecord, User } from '../types';
import { students, attendanceRecords, users } from '../data/mockData';

const ATTENDANCE_STORAGE_KEY = 'attendance_records';
const STUDENTS_STORAGE_KEY = 'students_data';

class DataService {
  private attendanceData: AttendanceRecord[];
  private studentsData: Student[];

  constructor() {
    const storedAttendance = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    this.attendanceData = storedAttendance ? JSON.parse(storedAttendance) : [...attendanceRecords];

    const storedStudents = localStorage.getItem(STUDENTS_STORAGE_KEY);
    this.studentsData = storedStudents ? JSON.parse(storedStudents) : [...students];
  }

  private saveAttendance() {
    localStorage.setItem(
      ATTENDANCE_STORAGE_KEY,
      JSON.stringify(this.attendanceData)
    );
  }

  private saveStudents() {
    localStorage.setItem(
      STUDENTS_STORAGE_KEY,
      JSON.stringify(this.studentsData)
    );
  }

  getStudents(userId: string, userRole: string, userDepartment?: string): Student[] {
    if (userRole === 'principal') {
      return this.studentsData;
    }

    if (userRole === 'hod' && userDepartment) {
      return this.studentsData.filter((s) => s.department === userDepartment);
    }

    if (userRole === 'advisor') {
      return this.studentsData.filter((s) => s.advisorId === userId);
    }

    return [];
  }

  getAttendanceRecords(
    userId: string,
    userRole: string,
    userDepartment?: string,
    date?: string
  ): AttendanceRecord[] {
    let records = this.attendanceData;

    if (date) {
      records = records.filter((r) => r.date === date);
    }

    if (userRole === 'principal') {
      return records;
    }

    if (userRole === 'hod' && userDepartment) {
      const deptStudentIds = this.studentsData
        .filter((s) => s.department === userDepartment)
        .map((s) => s.id);
      return records.filter((r) => deptStudentIds.includes(r.studentId));
    }

    if (userRole === 'advisor') {
      const advisorStudentIds = this.studentsData
        .filter((s) => s.advisorId === userId)
        .map((s) => s.id);
      return records.filter((r) => advisorStudentIds.includes(r.studentId));
    }

    return [];
  }

  markAttendance(
    studentId: string,
    date: string,
    status: 'present' | 'absent' | 'late',
    markedBy: string,
    remarks?: string
  ): AttendanceRecord {
    const existingIndex = this.attendanceData.findIndex(
      (r) => r.studentId === studentId && r.date === date
    );

    const record: AttendanceRecord = {
      id: existingIndex >= 0 ? this.attendanceData[existingIndex].id : `a${Date.now()}`,
      studentId,
      date,
      status,
      markedBy,
      remarks,
    };

    if (existingIndex >= 0) {
      this.attendanceData[existingIndex] = record;
    } else {
      this.attendanceData.push(record);
    }

    this.saveAttendance();
    return record;
  }

  getAttendanceStats(studentIds: string[]): {
    [key: string]: { present: number; absent: number; late: number; total: number };
  } {
    const stats: {
      [key: string]: { present: number; absent: number; late: number; total: number };
    } = {};

    studentIds.forEach((id) => {
      const records = this.attendanceData.filter((r) => r.studentId === id);
      stats[id] = {
        present: records.filter((r) => r.status === 'present').length,
        absent: records.filter((r) => r.status === 'absent').length,
        late: records.filter((r) => r.status === 'late').length,
        total: records.length,
      };
    });

    return stats;
  }

  getAdvisorName(advisorId: string): string {
    const advisor = users.find((u) => u.id === advisorId);
    return advisor?.fullName || 'Unknown';
  }

  addStudent(student: Omit<Student, 'id'>): Student {
    const newStudent: Student = {
      ...student,
      id: `s${Date.now()}`,
    };

    this.studentsData.push(newStudent);
    this.saveStudents();
    return newStudent;
  }

  updateStudent(studentId: string, updates: Partial<Omit<Student, 'id'>>): Student | null {
    const index = this.studentsData.findIndex((s) => s.id === studentId);

    if (index === -1) {
      return null;
    }

    this.studentsData[index] = {
      ...this.studentsData[index],
      ...updates,
    };

    this.saveStudents();
    return this.studentsData[index];
  }

  deleteStudent(studentId: string): boolean {
    const index = this.studentsData.findIndex((s) => s.id === studentId);

    if (index === -1) {
      return false;
    }

    this.studentsData.splice(index, 1);
    this.attendanceData = this.attendanceData.filter((a) => a.studentId !== studentId);

    this.saveStudents();
    this.saveAttendance();
    return true;
  }

  getStudent(studentId: string): Student | null {
    return this.studentsData.find((s) => s.id === studentId) || null;
  }
}

export const dataService = new DataService();
