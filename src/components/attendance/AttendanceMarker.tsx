import { useState } from 'react';
import { Check, X, Clock, CreditCard as Edit2 } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

interface AttendanceMarkerProps {
  studentId: string;
  date: string;
  currentStatus?: 'present' | 'absent' | 'late';
  currentRemarks?: string;
}

export function AttendanceMarker({
  studentId,
  date,
  currentStatus,
  currentRemarks,
}: AttendanceMarkerProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState(currentStatus);
  const [showRemarks, setShowRemarks] = useState(false);
  const [remarks, setRemarks] = useState(currentRemarks || '');

  const handleStatusChange = (newStatus: 'present' | 'absent' | 'late') => {
    if (newStatus === 'present' || newStatus === 'late') {
      dataService.markAttendance(studentId, date, newStatus, user!.id, remarks);
      setStatus(newStatus);
      setShowRemarks(false);
    } else {
      setShowRemarks(true);
    }
  };

  const handleSaveAbsent = () => {
    dataService.markAttendance(studentId, date, 'absent', user!.id, remarks);
    setStatus('absent');
    setShowRemarks(false);
  };

  const getStatusButton = (
    btnStatus: 'present' | 'absent' | 'late',
    icon: React.ReactNode,
    label: string,
    colorClass: string
  ) => {
    const isActive = status === btnStatus;
    return (
      <button
        onClick={() => handleStatusChange(btnStatus)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
          isActive
            ? colorClass
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  if (showRemarks) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Reason for absence"
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none"
        />
        <button
          onClick={handleSaveAbsent}
          className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition"
        >
          Save
        </button>
        <button
          onClick={() => setShowRemarks(false)}
          className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-300 transition"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {getStatusButton(
        'present',
        <Check className="w-3.5 h-3.5" />,
        'Present',
        'bg-green-100 text-green-700 border border-green-200'
      )}
      {getStatusButton(
        'absent',
        <X className="w-3.5 h-3.5" />,
        'Absent',
        'bg-red-100 text-red-700 border border-red-200'
      )}
      {getStatusButton(
        'late',
        <Clock className="w-3.5 h-3.5" />,
        'Late',
        'bg-amber-100 text-amber-700 border border-amber-200'
      )}
      {status && (
        <button
          onClick={() => setShowRemarks(true)}
          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition"
          title="Edit remarks"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
