
import React from 'react';
import { AppState } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface LeaderboardProps {
  state: AppState;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ state }) => {
  const sortedTeachers = [...state.users].sort((a, b) => b.profile.rating - a.profile.rating);

  const chartData = sortedTeachers.slice(0, 5).map(u => ({
    name: u.profile.name,
    rating: u.profile.rating,
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900">Hall of Fame 🏆</h1>
        <p className="text-slate-500 mt-2">The most skilled and helpful students in our community.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Top Rated Teachers</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="rating" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Full Ranking</h3>
          {sortedTeachers.map((user, idx) => (
            <div key={user.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                idx === 0 ? 'bg-amber-100 text-amber-600' : 
                idx === 1 ? 'bg-slate-200 text-slate-600' :
                idx === 2 ? 'bg-orange-100 text-orange-600' :
                'bg-slate-50 text-slate-400'
              }`}>
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-sm">{user.profile.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{user.profile.department}</p>
              </div>
              <div className="text-right">
                <div className="text-amber-500 font-bold text-sm">★ {user.profile.rating}</div>
                <div className="text-[10px] text-slate-400">{user.profile.ratingCount} reviews</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
