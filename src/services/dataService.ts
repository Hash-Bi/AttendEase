import { Student, AttendanceRecord, User } from '../types';
import { students, attendanceRecords, users } from '../data/mockData';

const ATTENDANCE_STORAGE_KEY = 'attendance_records';

class DataService {
  private attendanceData: AttendanceRecord[];

  constructor() {
    const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    this.attendanceData = stored ? JSON.parse(stored) : [...attendanceRecords];
  }

  private saveAttendance() {
    localStorage.setItem(
      ATTENDANCE_STORAGE_KEY,
      JSON.stringify(this.attendanceData)
    );
  }

  getStudents(userId: string, userRole: string, userDepartment?: string): Student[] {
    if (userRole === 'principal') {
      return students;
    }

    if (userRole === 'hod' && userDepartment) {
      return students.filter((s) => s.department === userDepartment);
    }

    if (userRole === 'advisor') {
      return students.filter((s) => s.advisorId === userId);
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
      const deptStudentIds = students
        .filter((s) => s.department === userDepartment)
        .map((s) => s.id);
      return records.filter((r) => deptStudentIds.includes(r.studentId));
    }

    if (userRole === 'advisor') {
      const advisorStudentIds = students
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
}

export const dataService = new DataService();
