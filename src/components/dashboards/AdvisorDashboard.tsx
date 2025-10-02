import { useState } from 'react';
import { Users, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { Header } from '../shared/Header';
import { StatsCard } from '../shared/StatsCard';
import { AttendanceMarker } from '../attendance/AttendanceMarker';
import { StudentManagement } from '../students/StudentManagement';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

export function AdvisorDashboard() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [refreshKey, setRefreshKey] = useState(0);

  const myStudents = dataService.getStudents(user!.id, user!.role, user!.department);
  const todayAttendance = dataService.getAttendanceRecords(
    user!.id,
    user!.role,
    user!.department,
    selectedDate
  );
  const stats = dataService.getAttendanceStats(myStudents.map((s) => s.id));

  const presentCount = todayAttendance.filter((r) => r.status === 'present').length;
  const absentCount = todayAttendance.filter((r) => r.status === 'absent').length;
  const lateCount = todayAttendance.filter((r) => r.status === 'late').length;

  const studentsWithAttendance = myStudents.map((student) => {
    const attendanceRecord = todayAttendance.find((r) => r.studentId === student.id);
    const studentStat = stats[student.id] || { present: 0, absent: 0, late: 0, total: 0 };
    const percentage = studentStat.total > 0
      ? ((studentStat.present / studentStat.total) * 100).toFixed(1)
      : '0';

    return {
      ...student,
      attendanceRecord,
      ...studentStat,
      percentage,
    };
  });

  const handleStudentChange = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Advisor Dashboard</h2>
          <p className="text-slate-600 mt-1">Manage students and attendance for your assigned class</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="My Students"
            value={myStudents.length}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Present Today"
            value={presentCount}
            icon={CheckCircle}
            color="green"
            subtitle={`${((presentCount / myStudents.length) * 100).toFixed(1)}% attendance`}
          />
          <StatsCard
            title="Absent Today"
            value={absentCount}
            icon={XCircle}
            color="red"
          />
          <StatsCard
            title="Late Today"
            value={lateCount}
            icon={Clock}
            color="amber"
          />
        </div>

        <div className="mb-8">
          <StudentManagement
            key={refreshKey}
            advisorId={user!.id}
            department={user!.department!}
            onStudentChange={handleStudentChange}
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Mark Attendance
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Roll Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Overall %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Today's Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {studentsWithAttendance.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-slate-900">{student.rollNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-slate-900">{student.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      Year {student.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-semibold ${
                        parseFloat(student.percentage) >= 75 ? 'text-green-600' :
                        parseFloat(student.percentage) >= 60 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {student.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AttendanceMarker
                        studentId={student.id}
                        date={selectedDate}
                        currentStatus={student.attendanceRecord?.status}
                        currentRemarks={student.attendanceRecord?.remarks}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {student.attendanceRecord?.remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
