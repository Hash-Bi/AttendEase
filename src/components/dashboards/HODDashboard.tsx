import { useState } from 'react';
import { Users, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { Header } from '../shared/Header';
import { StatsCard } from '../shared/StatsCard';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

export function HODDashboard() {
  const { user } = useAuth();
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  const deptStudents = dataService.getStudents(user!.id, user!.role, user!.department);
  const todayAttendance = dataService.getAttendanceRecords(
    user!.id,
    user!.role,
    user!.department,
    selectedDate
  );
  const stats = dataService.getAttendanceStats(deptStudents.map((s) => s.id));

  const presentCount = todayAttendance.filter((r) => r.status === 'present').length;
  const absentCount = todayAttendance.filter((r) => r.status === 'absent').length;
  const lateCount = todayAttendance.filter((r) => r.status === 'late').length;

  const studentsWithStats = deptStudents.map((student) => {
    const studentStat = stats[student.id] || { present: 0, absent: 0, late: 0, total: 0 };
    const percentage = studentStat.total > 0
      ? ((studentStat.present / studentStat.total) * 100).toFixed(1)
      : '0';

    return {
      ...student,
      ...studentStat,
      percentage,
      advisorName: dataService.getAdvisorName(student.advisorId),
    };
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">HOD Dashboard</h2>
          <p className="text-slate-600 mt-1">{user?.department} Department Overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Students"
            value={deptStudents.length}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Present Today"
            value={presentCount}
            icon={CheckCircle}
            color="green"
            subtitle={`${((presentCount / deptStudents.length) * 100).toFixed(1)}% attendance`}
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

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Student Attendance Overview
            </h3>
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
                    Advisor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Present / Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Attendance %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {studentsWithStats.map((student) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-sm">
                      {student.advisorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {student.present} / {student.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">{student.percentage}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {parseFloat(student.percentage) >= 75 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Good
                        </span>
                      ) : parseFloat(student.percentage) >= 60 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Warning
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Critical
                        </span>
                      )}
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
