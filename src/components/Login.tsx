import { useState } from 'react';
import { LogIn, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const success = login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  const sampleCredentials = [
    { role: 'Principal', email: 'principal@college.edu', password: 'principal123' },
    { role: 'HOD (CS)', email: 'hod.cs@college.edu', password: 'hod123' },
    { role: 'HOD (EE)', email: 'hod.ee@college.edu', password: 'hod123' },
    { role: 'Advisor (CS)', email: 'advisor.cs1@college.edu', password: 'advisor123' },
    { role: 'Advisor (EE)', email: 'advisor.ee1@college.edu', password: 'advisor123' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">College Attendance</h1>
              <p className="text-sm text-slate-600">Management System</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 text-white border border-white/20">
          <h2 className="text-2xl font-bold mb-6">Sample Login Credentials</h2>
          <p className="text-slate-300 mb-6">Use any of these accounts to test the system:</p>

          <div className="space-y-3">
            {sampleCredentials.map((cred, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setEmail(cred.email);
                  setPassword(cred.password);
                }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 cursor-pointer transition"
              >
                <div className="font-semibold text-sm mb-2 text-slate-200">{cred.role}</div>
                <div className="text-sm text-slate-400 font-mono">{cred.email}</div>
                <div className="text-sm text-slate-400 font-mono">{cred.password}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/20 text-sm text-slate-400">
            Click any credential card to auto-fill the login form
          </div>
        </div>
      </div>
    </div>
  );
}
