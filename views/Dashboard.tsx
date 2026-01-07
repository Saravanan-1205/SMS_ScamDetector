
import React from 'react';
import { AppState, SkillExchange, User } from '../types';

interface DashboardProps {
  state: AppState;
  onUpdateStatus: (exchangeId: string, status: 'accepted' | 'completed' | 'rejected') => void;
  onClearNotification: (exchangeId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onUpdateStatus, onClearNotification }) => {
  const { currentUser, exchanges, users } = state;
  if (!currentUser) return null;

  const myRequests = exchanges.filter(e => e.learnerId === currentUser.id);
  const teachingRequests = exchanges.filter(e => e.teacherId === currentUser.id);

  const pendingIncoming = teachingRequests.filter(e => e.status === 'requested');
  const pendingOutgoingUpdates = myRequests.filter(e => (e.status === 'accepted' || e.status === 'rejected') && !e.notified);
  
  const activeTeaching = teachingRequests.filter(e => e.status === 'accepted');
  const activeLearning = myRequests.filter(e => e.status === 'accepted');

  const getUserName = (id: string) => users.find(u => u.id === id)?.profile.name || 'Unknown';

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hi, {currentUser.profile.name}! 👋</h1>
          <p className="text-slate-500 mt-2 text-lg">Your peer learning hub is up to date.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="text-center border-r border-slate-100 pr-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medals</p>
            <p className="text-xl font-black text-amber-600">{currentUser.profile.medals} 🏅</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</p>
            <p className="text-xl font-black text-indigo-600">{currentUser.profile.rating} ★</p>
          </div>
        </div>
      </header>

      {/* Notifications Center */}
      {(pendingIncoming.length > 0 || pendingOutgoingUpdates.length > 0) && (
        <section className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-black flex items-center gap-3 mb-6">
              <span className="p-2 bg-white/20 rounded-xl">🔔</span>
              Notifications Center
            </h2>
            <div className="space-y-3">
              {/* Incoming Requests for Teacher */}
              {pendingIncoming.map(req => (
                <div key={req.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                      {getUserName(req.learnerId)[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">New Request: <span className="text-indigo-200">{req.skillName}</span></p>
                      <p className="text-xs opacity-70">From {getUserName(req.learnerId)} • Reward: {req.cost} Medals</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onUpdateStatus(req.id, 'accepted')}
                      className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-xs font-black hover:scale-105 active:scale-90 transition-all"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(req.id, 'rejected')}
                      className="px-4 py-2 bg-red-500/80 text-white rounded-xl text-xs font-black hover:bg-red-500 active:scale-90 transition-all"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}

              {/* Status Updates for Learner */}
              {pendingOutgoingUpdates.map(update => (
                <div key={update.id} className="bg-white text-slate-900 rounded-2xl p-4 flex items-center justify-between animate-bounce">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${update.status === 'accepted' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                      {update.status === 'accepted' ? '✓' : '✕'}
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        Request {update.status === 'accepted' ? 'Accepted' : 'Rejected'}!
                      </p>
                      <p className="text-xs text-slate-500">
                        {getUserName(update.teacherId)} {update.status === 'accepted' ? 'is ready to teach you' : 'cannot teach'} <b>{update.skillName}</b>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onClearNotification(update.id)}
                    className="text-slate-300 hover:text-slate-600 font-bold p-2 active:scale-150 transition-all"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teaching Side */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">👨‍🏫</span>
              Teaching Status
            </h2>
          </div>
          
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
            {activeTeaching.length > 0 ? (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sessions in Progress</p>
                {activeTeaching.map(req => (
                  <div key={req.id} className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                    <div>
                      <h4 className="font-bold text-slate-900">{req.skillName}</h4>
                      <p className="text-xs text-slate-500">Student: {getUserName(req.learnerId)}</p>
                    </div>
                    <button 
                      onClick={() => onUpdateStatus(req.id, 'completed')}
                      className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-slate-200"
                    >
                      Complete Session
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center space-y-3">
                <div className="text-3xl grayscale opacity-50">😴</div>
                <p className="text-slate-400 font-medium">No active teaching sessions.</p>
                <p className="text-[10px] text-slate-300 uppercase font-black">Waiting for students to find you</p>
              </div>
            )}
          </div>
        </div>

        {/* Learning Side */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm">🎓</span>
            My Learning journey
          </h2>
          
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
            {activeLearning.length > 0 ? (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Enrollments</p>
                {activeLearning.map(req => (
                  <div key={req.id} className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                        {req.skillName[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{req.skillName}</h4>
                        <p className="text-xs text-slate-500">Teacher: <span className="font-bold text-indigo-600">{getUserName(req.teacherId)}</span></p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full uppercase">Active</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center space-y-3">
                <div className="text-3xl grayscale opacity-50">🔭</div>
                <p className="text-slate-400 font-medium">You aren't learning anything new yet.</p>
                <p className="text-[10px] text-indigo-500 font-black uppercase tracking-tighter cursor-pointer hover:underline">Explore the skill discovery page</p>
              </div>
            )}

            {myRequests.filter(e => e.status === 'requested').length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waiting for Approval</p>
                {myRequests.filter(e => e.status === 'requested').map(req => (
                  <div key={req.id} className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                      <p className="text-sm font-semibold text-slate-700">{req.skillName}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold italic">Asking {getUserName(req.teacherId)}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
