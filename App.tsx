
import React, { useState, useEffect } from 'react';
import { AppState, User, Skill, SkillExchange, UserProfile } from './types';
import { INITIAL_USERS } from './store/mockData';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import Discovery from './views/Discovery';
import Leaderboard from './views/Leaderboard';
import Profile from './views/Profile';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'discovery' | 'exchanges' | 'leaderboard' | 'profile'>('dashboard');
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('skillswap_state_v2');
    if (saved) return JSON.parse(saved);
    return {
      currentUser: null,
      users: INITIAL_USERS,
      exchanges: [],
    };
  });

  const [authForm, setAuthForm] = useState({ username: '', password: '', isRegistering: false, name: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Persistence effect
  useEffect(() => {
    localStorage.setItem('skillswap_state_v2', JSON.stringify(state));
  }, [state]);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const user = state.users.find(u => u.username === authForm.username && u.password === authForm.password);
    
    if (user) {
      setState(prev => ({ ...prev, currentUser: user }));
      setIsAuthenticated(true);
    } else {
      setErrorMessage('Invalid username or password. Please try again.');
      triggerShake();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (authForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      triggerShake();
      return;
    }

    if (state.users.some(u => u.username === authForm.username)) {
      setErrorMessage('This username is already taken.');
      triggerShake();
      return;
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      username: authForm.username,
      password: authForm.password,
      profile: {
        name: authForm.name || authForm.username,
        department: 'General',
        year: '1st Year',
        bio: 'New student on SkillSwap!',
        teachingSkills: [],
        learningSkills: [],
        medals: 20, // Starting bonus for new users
        rating: 5.0,
        ratingCount: 0
      }
    };

    setState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser
    }));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setState(prev => ({ ...prev, currentUser: null }));
    setActiveTab('dashboard');
    setAuthForm({ username: '', password: '', isRegistering: false, name: '' });
  };

  const handleRequestSwap = (teacherId: string, skill: Skill) => {
    if (!state.currentUser) return;
    if (state.currentUser.id === teacherId) return;

    if (state.currentUser.profile.medals < skill.cost) {
      alert('You need more medals for this session!');
      return;
    }

    const newExchange: SkillExchange = {
      id: `ex-${Date.now()}`,
      teacherId,
      learnerId: state.currentUser.id,
      skillName: skill.name,
      cost: skill.cost,
      status: 'requested',
      createdAt: Date.now(),
      notified: false
    };

    setState(prev => ({
      ...prev,
      exchanges: [...prev.exchanges, newExchange]
    }));

    alert(`Request for "${skill.name}" sent to the teacher! Check your dashboard for status updates.`);
  };

  const handleUpdateStatus = (exchangeId: string, status: 'accepted' | 'completed' | 'rejected') => {
    setState(prev => {
      const exchange = prev.exchanges.find(e => e.id === exchangeId);
      if (!exchange) return prev;

      const updatedExchanges = prev.exchanges.map(e => e.id === exchangeId ? { ...e, status, notified: false } : e);
      let updatedUsers = [...prev.users];

      if (status === 'completed') {
        updatedUsers = updatedUsers.map(u => {
          if (u.id === exchange.teacherId) {
            return { 
              ...u, 
              profile: { ...u.profile, medals: u.profile.medals + exchange.cost } 
            };
          }
          if (u.id === exchange.learnerId) {
            return { 
              ...u, 
              profile: { ...u.profile, medals: u.profile.medals - exchange.cost } 
            };
          }
          return u;
        });
      }

      const newCurrentUser = updatedUsers.find(u => u.id === prev.currentUser?.id) || null;

      return {
        ...prev,
        exchanges: updatedExchanges,
        users: updatedUsers,
        currentUser: newCurrentUser
      };
    });
  };

  const handleClearNotification = (exchangeId: string) => {
    setState(prev => ({
      ...prev,
      exchanges: prev.exchanges.map(e => e.id === exchangeId ? { ...e, notified: true } : e)
    }));
  };

  const handleRateTeacher = (exchangeId: string, rating: number) => {
    setState(prev => {
      const exchange = prev.exchanges.find(e => e.id === exchangeId);
      if (!exchange) return prev;

      const updatedExchanges = prev.exchanges.map(e => 
        e.id === exchangeId ? { ...e, rating } : e
      );

      const updatedUsers = prev.users.map(u => {
        if (u.id === exchange.teacherId) {
          const oldRating = u.profile.rating;
          const oldCount = u.profile.ratingCount;
          const newCount = oldCount + 1;
          const newRating = Number(((oldRating * oldCount + rating) / newCount).toFixed(1));
          return {
            ...u,
            profile: { ...u.profile, rating: newRating, ratingCount: newCount }
          };
        }
        return u;
      });

      const newCurrentUser = updatedUsers.find(u => u.id === prev.currentUser?.id) || null;

      return {
        ...prev,
        exchanges: updatedExchanges,
        users: updatedUsers,
        currentUser: newCurrentUser
      };
    });
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u),
      currentUser: updatedUser
    }));
  };

  const getUserName = (id: string) => state.users.find(u => u.id === id)?.profile.name || 'Unknown';

  const updateField = (field: string, value: string) => {
    setErrorMessage(null);
    setAuthForm({ ...authForm, [field]: value });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8faff] flex items-center justify-center p-6 relative overflow-hidden">
        <style>
          {`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-8px); }
              75% { transform: translateX(8px); }
            }
            .shake-animation {
              animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
            }
          `}
        </style>

        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[100px] opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-violet-100 rounded-full blur-[100px] opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className={`max-w-md w-full relative z-10 transition-transform ${isShaking ? 'shake-animation' : ''}`}>
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white/50 p-10 space-y-8">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black mx-auto shadow-xl shadow-indigo-200 mb-6">S</div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">SkillSwap</h1>
              <p className="text-slate-500 font-medium text-lg">National Engineering College</p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
                <span className="text-xl">⚠️</span>
                <p className="text-red-600 text-sm font-bold">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={authForm.isRegistering ? handleRegister : handleLogin} className="space-y-5">
              {authForm.isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Rahul Sharma"
                    className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold text-slate-700"
                    value={authForm.name}
                    onChange={e => updateField('name', e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="rahul_eng"
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold text-slate-700"
                  value={authForm.username}
                  onChange={e => updateField('username', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold text-slate-700"
                  value={authForm.password}
                  onChange={e => updateField('password', e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-5 rounded-2xl font-black text-lg active:scale-95 transition-all shadow-xl shadow-indigo-100 mt-8"
              >
                {authForm.isRegistering ? 'Start Your Journey' : 'Log In'}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setErrorMessage(null);
                  setAuthForm({ ...authForm, isRegistering: !authForm.isRegistering });
                }}
                className="text-slate-500 text-sm font-semibold hover:text-indigo-600 transition-colors py-2 px-4 rounded-lg hover:bg-indigo-50 active:scale-95"
              >
                {authForm.isRegistering ? 'Already have an account? Login' : "New student? Create an account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <Navbar 
        user={state.currentUser} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        exchanges={state.exchanges}
      />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 w-full mb-20 lg:mb-0">
        {activeTab === 'dashboard' && (
          <Dashboard 
            state={state} 
            onUpdateStatus={handleUpdateStatus} 
            onClearNotification={handleClearNotification}
          />
        )}
        {activeTab === 'discovery' && <Discovery state={state} onRequestSwap={handleRequestSwap} />}
        {activeTab === 'exchanges' && (
           <div className="space-y-8 animate-fadeIn">
             <header>
               <h1 className="text-3xl font-extrabold text-slate-900">Exchange History 🔄</h1>
               <p className="text-slate-500 mt-2 text-lg">Track your current and past peer learning sessions.</p>
             </header>
             <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-slate-100">
                   <thead className="bg-slate-50">
                     <tr>
                       <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Skill & Partner</th>
                       <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                       <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                       <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Cost</th>
                       <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {state.exchanges
                       .filter(e => e.learnerId === state.currentUser?.id || e.teacherId === state.currentUser?.id)
                       .sort((a, b) => b.createdAt - a.createdAt)
                       .map(ex => (
                       <tr key={ex.id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-6 py-5">
                           <div className="font-bold text-slate-900">{ex.skillName}</div>
                           <div className="text-xs text-slate-400">
                             {ex.teacherId === state.currentUser?.id ? `Student: ${getUserName(ex.learnerId)}` : `Teacher: ${getUserName(ex.teacherId)}`}
                           </div>
                         </td>
                         <td className="px-6 py-5">
                           <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                             ex.teacherId === state.currentUser?.id ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                           }`}>
                             {ex.teacherId === state.currentUser?.id ? 'Teaching' : 'Learning'}
                           </span>
                         </td>
                         <td className="px-6 py-5">
                           <span className={`capitalize text-sm font-bold ${
                             ex.status === 'completed' ? 'text-emerald-600' : 
                             ex.status === 'rejected' ? 'text-red-500' :
                             ex.status === 'accepted' ? 'text-indigo-500' : 'text-amber-500'
                           }`}>
                             {ex.status}
                           </span>
                         </td>
                         <td className="px-6 py-5 font-black text-slate-700">{ex.cost} 🏅</td>
                         <td className="px-6 py-5">
                            {ex.learnerId === state.currentUser?.id && ex.status === 'completed' && !ex.rating && (
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <button 
                                    key={star}
                                    onClick={() => handleRateTeacher(ex.id, star)}
                                    className="text-slate-200 hover:text-yellow-400 transition-all text-xl active:scale-150"
                                    title={`Rate ${star} stars`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                            )}
                            {ex.rating && <span className="text-yellow-500 font-bold">★ {ex.rating}</span>}
                            {ex.status === 'requested' && ex.teacherId === state.currentUser?.id && (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleUpdateStatus(ex.id, 'accepted')}
                                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold transition-all active:scale-90"
                                >
                                  Accept
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(ex.id, 'rejected')}
                                  className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold transition-all active:scale-90"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               {state.exchanges.length === 0 && (
                 <div className="py-20 text-center text-slate-400">No session history yet. Start exploring or add skills to your profile!</div>
               )}
             </div>
           </div>
        )}
        {activeTab === 'leaderboard' && <Leaderboard state={state} />}
        {activeTab === 'profile' && state.currentUser && <Profile user={state.currentUser} onUpdate={handleUpdateProfile} />}
      </main>
    </div>
  );
};

export default App;
