import { useState } from 'react';
import type { User } from '../App';

interface LoginProps {
  onLogin: (user: User) => void;
}

// Predefined SDR list for TeepTrak
const SDR_LIST = [
  { id: '49', name: 'Kathryn Sherman', email: 'ks@teeptrak.com' },
  { id: '141', name: 'Charlie Fruehauf', email: 'cf@teeptrak.com' },
  { id: '142', name: 'Arianna Graves', email: 'ag@teeptrak.com' },
  { id: '127', name: "Thomas O'Brien", email: 'tob@teeptrak.com' },
  { id: '43', name: 'Augustin Lizé', email: 'al@teeptrak.com' },
  { id: '136', name: 'Ravinder Singh', email: 'rav@teeptrak.com' },
];

export default function Login({ onLogin }: LoginProps) {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [customMode, setCustomMode] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  const handleQuickLogin = () => {
    const user = SDR_LIST.find(u => u.id === selectedUser);
    if (user) {
      onLogin(user);
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmail && customName) {
      onLogin({
        id: customEmail.split('@')[0],
        name: customName,
        email: customEmail,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TeepTrak Softphone</h1>
          <p className="text-slate-400">Select your profile to start calling</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50">
          {!customMode ? (
            /* Quick Login Mode */
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Select your profile
                </label>
                <div className="space-y-2">
                  {SDR_LIST.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUser(user.id)}
                      className={`
                        w-full p-4 rounded-xl text-left transition-all
                        ${selectedUser === user.id
                          ? 'bg-blue-500/20 border-2 border-blue-500'
                          : 'bg-slate-700/30 border-2 border-transparent hover:bg-slate-700/50'
                        }
                      `}
                    >
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-slate-400">{user.email}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleQuickLogin}
                disabled={!selectedUser}
                className={`
                  w-full py-4 rounded-xl font-medium transition-all
                  ${selectedUser
                    ? 'bg-blue-500 hover:bg-blue-400 text-white'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }
                `}
              >
                Connect
              </button>

              <button
                onClick={() => setCustomMode(true)}
                className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors"
              >
                Use a different account →
              </button>
            </div>
          ) : (
            /* Custom Login Mode */
            <form onSubmit={handleCustomLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="john@teeptrak.com"
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-medium transition-all"
              >
                Connect
              </button>

              <button
                type="button"
                onClick={() => setCustomMode(false)}
                className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors"
              >
                ← Back to quick login
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Powered by Twilio WebRTC • TeepTrak © 2026
        </p>
      </div>
    </div>
  );
}
