import { useState } from 'react';
import { UserPlus, CreditCard as Edit2, Trash2, X, Save } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Student } from '../../types';

interface StudentManagementProps {
  advisorId: string;
  department: string;
  onStudentChange: () => void;
}

export function StudentManagement({ advisorId, department, onStudentChange }: StudentManagementProps) {
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    rollNumber: '',
    name: '',
    year: 1,
  });

  const myStudents = dataService.getStudents(advisorId, 'advisor', department);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStudentId) {
      dataService.updateStudent(editingStudentId, {
        rollNumber: formData.rollNumber,
        name: formData.name,
        year: formData.year,
      });
      setEditingStudentId(null);
    } else {
      dataService.addStudent({
        rollNumber: formData.rollNumber,
        name: formData.name,
        department,
        year: formData.year,
        advisorId,
      });
      setIsAddingStudent(false);
    }

    setFormData({ rollNumber: '', name: '', year: 1 });
    onStudentChange();
  };

  const handleEdit = (student: Student) => {
    setFormData({
      rollNumber: student.rollNumber,
      name: student.name,
      year: student.year,
    });
    setEditingStudentId(student.id);
    setIsAddingStudent(false);
  };

  const handleDelete = (studentId: string) => {
    if (confirm('Are you sure you want to delete this student? This will also remove all their attendance records.')) {
      dataService.deleteStudent(studentId);
      onStudentChange();
    }
  };

  const handleCancel = () => {
    setIsAddingStudent(false);
    setEditingStudentId(null);
    setFormData({ rollNumber: '', name: '', year: 1 });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Manage Students</h3>
        {!isAddingStudent && !editingStudentId && (
          <button
            onClick={() => setIsAddingStudent(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
          >
            <UserPlus className="w-4 h-4" />
            Add Student
          </button>
        )}
      </div>

      <div className="p-6">
        {(isAddingStudent || editingStudentId) && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="text-md font-semibold text-slate-900 mb-4">
              {editingStudentId ? 'Edit Student' : 'Add New Student'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none"
                  placeholder="CS2021001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Year
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none"
                >
                  <option value={1}>Year 1</option>
                  <option value={2}>Year 2</option>
                  <option value={3}>Year 3</option>
                  <option value={4}>Year 4</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Save className="w-4 h-4" />
                {editingStudentId ? 'Update' : 'Add'} Student
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Roll Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {myStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No students found. Click "Add Student" to add your first student.
                  </td>
                </tr>
              ) : (
                myStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-sm text-slate-900">{student.rollNumber}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-slate-900">{student.name}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      Year {student.year}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                          title="Edit student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                          title="Delete student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
