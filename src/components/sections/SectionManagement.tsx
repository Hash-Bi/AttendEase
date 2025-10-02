import { useState } from 'react';
import { FolderPlus, Edit2, Trash2, X, Save } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Section } from '../../types';

interface SectionManagementProps {
  department: string;
  onSectionChange: () => void;
}

export function SectionManagement({ department, onSectionChange }: SectionManagementProps) {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    year: 1,
    advisorId: '',
  });

  const sections = dataService.getSections(department);
  const advisors = dataService.getAdvisors(department);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSectionId) {
      dataService.updateSection(editingSectionId, {
        name: formData.name,
        year: formData.year,
        advisorId: formData.advisorId,
      });
      setEditingSectionId(null);
    } else {
      dataService.addSection({
        name: formData.name,
        department,
        year: formData.year,
        advisorId: formData.advisorId,
      });
      setIsAddingSection(false);
    }

    setFormData({ name: '', year: 1, advisorId: '' });
    onSectionChange();
  };

  const handleEdit = (section: Section) => {
    setFormData({
      name: section.name,
      year: section.year,
      advisorId: section.advisorId,
    });
    setEditingSectionId(section.id);
    setIsAddingSection(false);
  };

  const handleDelete = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section? Students in this section will be unassigned.')) {
      dataService.deleteSection(sectionId);
      onSectionChange();
    }
  };

  const handleCancel = () => {
    setIsAddingSection(false);
    setEditingSectionId(null);
    setFormData({ name: '', year: 1, advisorId: '' });
  };

  const getSectionsByYear = (year: number) => {
    return sections.filter((s) => s.year === year);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Manage Sections</h3>
        {!isAddingSection && !editingSectionId && (
          <button
            onClick={() => setIsAddingSection(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
          >
            <FolderPlus className="w-4 h-4" />
            Add Section
          </button>
        )}
      </div>

      <div className="p-6">
        {(isAddingSection || editingSectionId) && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="text-md font-semibold text-slate-900 mb-4">
              {editingSectionId ? 'Edit Section' : 'Add New Section'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Section Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none"
                  placeholder="Section A"
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Advisor
                </label>
                <select
                  value={formData.advisorId}
                  onChange={(e) => setFormData({ ...formData, advisorId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none"
                >
                  <option value="">Select Advisor</option>
                  {advisors.map((advisor) => (
                    <option key={advisor.id} value={advisor.id}>
                      {advisor.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Save className="w-4 h-4" />
                {editingSectionId ? 'Update' : 'Add'} Section
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

        <div className="space-y-6">
          {[1, 2, 3, 4].map((year) => {
            const yearSections = getSectionsByYear(year);
            return (
              <div key={year}>
                <h4 className="text-md font-semibold text-slate-900 mb-3">Year {year}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Section Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Advisor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {yearSections.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-4 text-center text-slate-500 text-sm">
                            No sections for Year {year}
                          </td>
                        </tr>
                      ) : (
                        yearSections.map((section) => (
                          <tr key={section.id} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="font-medium text-slate-900">{section.name}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                              {dataService.getAdvisorName(section.advisorId)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(section)}
                                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                                  title="Edit section"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(section.id)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                                  title="Delete section"
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
