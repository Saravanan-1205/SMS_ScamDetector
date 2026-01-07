
import React from 'react';
import { User, SkillExchange } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  exchanges: SkillExchange[];
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, activeTab, setActiveTab, exchanges }) => {
  if (!user) return null;

  const incomingRequests = exchanges.filter(e => e.teacherId === user.id && e.status === 'requested').length;
  const statusUpdates = exchanges.filter(e => e.learnerId === user.id && (e.status === 'accepted' || e.status === 'rejected') && !e.notified).length;
  const totalNotifications = incomingRequests + statusUpdates;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'discovery', label: 'Find Skills', icon: '🔍' },
    { id: 'exchanges', label: 'My Swaps', icon: '🔄' },
    { id: 'leaderboard', label: 'Top Teachers', icon: '🏆' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <>
      {/* Sidebar for Desktop */}
      <nav className="hidden lg:flex flex-col w-72 h-screen bg-white border-r border-slate-200 sticky top-0 left-0 z-50 p-6">
        <div className="flex items-center gap-3 mb-12 px-2 cursor-pointer active:scale-95 transition-all" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">
            S
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
            SkillSwap
          </span>
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Main Menu</p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between group px-4 py-4 rounded-2xl transition-all duration-200 active:scale-[0.97] ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-xl transition-transform group-hover:scale-110 ${activeTab === item.id ? '' : 'grayscale'}`}>
                  {item.icon}
                </span>
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              {item.id === 'dashboard' && totalNotifications > 0 && (
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                  activeTab === item.id ? 'bg-white text-indigo-600' : 'bg-red-500 text-white animate-pulse'
                }`}>
                  {totalNotifications}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto space-y-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
             <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-slate-400 uppercase">My Wallet</span>
               <span className="text-amber-500">🏅</span>
             </div>
             <div className="flex items-end justify-between">
                <p className="text-2xl font-black text-slate-900">{user.profile.medals}</p>
                <p className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">Medals</p>
             </div>
          </div>

          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
              {user.profile.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 truncate">{user.profile.name}</p>
              <p className="text-[10px] font-bold text-slate-400 truncate uppercase">{user.profile.department}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-slate-300 hover:text-red-500 transition-all active:scale-125"
              title="Sign Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-4 py-2 flex justify-around shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`relative flex flex-col items-center p-2 rounded-xl transition-all active:scale-90 ${
              activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-[10px] font-bold mt-1">{item.label}</span>
            {item.id === 'dashboard' && totalNotifications > 0 && (
              <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white">
                {totalNotifications}
              </span>
            )}
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
