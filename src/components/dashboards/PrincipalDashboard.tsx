import { useState } from 'react';
import { Users, CheckCircle, XCircle, Clock, Building2 } from 'lucide-react';
import { Header } from '../shared/Header';
import { StatsCard } from '../shared/StatsCard';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { students } from '../../data/mockData';

export function PrincipalDashboard() {
  const { user } = useAuth();
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  const allStudents = dataService.getStudents(user!.id, user!.role);
  const todayAttendance = dataService.getAttendanceRecords(
    user!.id,
    user!.role,
    user!.department,
    selectedDate
  );

  const presentCount = todayAttendance.filter((r) => r.status === 'present').length;
  const absentCount = todayAttendance.filter((r) => r.status === 'absent').length;
  const lateCount = todayAttendance.filter((r) => r.status === 'late').length;

  const departments = Array.from(new Set(students.map((s) => s.department)));
  const departmentStats = departments.map((dept) => {
    const deptStudents = students.filter((s) => s.department === dept);
    const deptAttendance = todayAttendance.filter((r) =>
      deptStudents.some((s) => s.id === r.studentId)
    );
    const deptPresent = deptAttendance.filter((r) => r.status === 'present').length;

    return {
      name: dept,
      total: deptStudents.length,
      present: deptPresent,
      percentage: deptStudents.length > 0 ? ((deptPresent / deptStudents.length) * 100).toFixed(1) : '0',
    };
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Principal Dashboard</h2>
          <p className="text-slate-600 mt-1">Overview of all departments and attendance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Students"
            value={allStudents.length}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Present Today"
            value={presentCount}
            icon={CheckCircle}
            color="green"
            subtitle={`${((presentCount / allStudents.length) * 100).toFixed(1)}% attendance`}
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
              <Building2 className="w-5 h-5" />
              Department-wise Attendance
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Total Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Present Today
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
                {departmentStats.map((dept) => (
                  <tr key={dept.name} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-slate-900">{dept.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {dept.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {dept.present}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">{dept.percentage}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {parseFloat(dept.percentage) >= 75 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Good
                        </span>
                      ) : parseFloat(dept.percentage) >= 60 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Fair
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Low
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
