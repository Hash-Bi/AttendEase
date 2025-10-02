import { useState } from 'react';
import { UserPlus, Edit2, Trash2, X, Save } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { User } from '../../types';

interface AdvisorManagementProps {
  department: string;
  onAdvisorChange: () => void;
}

export function AdvisorManagement({ department, onAdvisorChange }: AdvisorManagementProps) {
  const [isAddingAdvisor, setIsAddingAdvisor] = useState(false);
  const [editingAdvisorId, setEditingAdvisorId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
  });

  const advisors = dataService.getAdvisors(department);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAdvisorId) {
      dataService.updateAdvisor(editingAdvisorId, {
        email: formData.email,
        fullName: formData.fullName,
        ...(formData.password && { password: formData.password }),
      });
      setEditingAdvisorId(null);
    } else {
      dataService.addAdvisor({
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password || 'advisor123',
        role: 'advisor',
        department,
      });
      setIsAddingAdvisor(false);
    }

    setFormData({ email: '', fullName: '', password: '' });
    onAdvisorChange();
  };

  const handleEdit = (advisor: User) => {
    setFormData({
      email: advisor.email,
      fullName: advisor.fullName,
      password: '',
    });
    setEditingAdvisorId(advisor.id);
    setIsAddingAdvisor(false);
  };

  const handleDelete = (advisorId: string) => {
    if (confirm('Are you sure you want to delete this advisor? This will unassign all their sections and students.')) {
      dataService.deleteAdvisor(advisorId);
      onAdvisorChange();
    }
  };

  const handleCancel = () => {
    setIsAddingAdvisor(false);
    setEditingAdvisorId(null);
    setFormData({ email: '', fullName: '', password: '' });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Manage Advisors</h3>
        {!isAddingAdvisor && !editingAdvisorId && (
          <button
            onClick={() => setIsAddingAdvisor(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
          >
            <UserPlus className="w-4 h-4" />
            Add Advisor
          </button>
        )}
      </div>

      <div className="p-6">
        {(isAddingAdvisor || editingAdvisorId) && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="text-md font-semibold text-slate-900 mb-4">
              {editingAdvisorId ? 'Edit Advisor' : 'Add New Advisor'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none"
                  placeholder="Dr. John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none"
                  placeholder="john.smith@college.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password {editingAdvisorId && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingAdvisorId}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none"
                  placeholder={editingAdvisorId ? 'Leave blank to keep current' : 'Enter password'}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Save className="w-4 h-4" />
                {editingAdvisorId ? 'Update' : 'Add'} Advisor
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
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {advisors.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                    No advisors found. Click "Add Advisor" to add your first advisor.
                  </td>
                </tr>
              ) : (
                advisors.map((advisor) => (
                  <tr key={advisor.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-slate-900">{advisor.fullName}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {advisor.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(advisor)}
                          className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                          title="Edit advisor"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(advisor.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                          title="Delete advisor"
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
