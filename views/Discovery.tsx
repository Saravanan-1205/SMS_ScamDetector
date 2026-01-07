
import React, { useState, useEffect } from 'react';
import { AppState, User, Skill } from '../types';
import SkillCard from '../components/SkillCard';
import { getSkillRecommendations, getSmartMatches } from '../services/geminiService';

interface DiscoveryProps {
  state: AppState;
  onRequestSwap: (teacherId: string, skill: Skill) => void;
}

const Discovery: React.FC<DiscoveryProps> = ({ state, onRequestSwap }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiRecs, setAiRecs] = useState<string[]>([]);
  const { users, currentUser } = state;

  useEffect(() => {
    if (currentUser) {
      getSkillRecommendations(currentUser, users).then(setAiRecs);
    }
  }, [currentUser, users]);

  const availableTeachers = users.filter(u => u.id !== currentUser?.id);
  
  const allTeachingOffers = availableTeachers.flatMap(teacher => 
    teacher.profile.teachingSkills.map(skill => ({ teacher, skill }))
  );

  const filteredOffers = allTeachingOffers.filter(offer => 
    offer.skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.skill.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.teacher.profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fadeIn">
      <header className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Discover Opportunities ✨</h1>
        <p className="text-slate-500 text-lg font-medium leading-relaxed">
          Find peers who are experts in things you want to learn. Exchange your knowledge for medals!
        </p>
      </header>

      {/* Search Bar Section */}
      <div className="space-y-6">
        <div className="relative max-w-2xl group">
          <input 
            type="text" 
            placeholder="What do you want to master today? (e.g. Photoshop, Calculus, Cooking)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-400 transition-all outline-none text-slate-700 font-semibold text-lg placeholder:text-slate-300"
          />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl filter group-focus-within:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all">🔍</span>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 font-bold"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* AI Recommendations */}
        {aiRecs.length > 0 && (
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">✨</span>
              <h3 className="font-black text-indigo-900 uppercase tracking-widest text-sm">Suggested for your profile</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {aiRecs.map((rec, i) => (
                <button 
                  key={i} 
                  onClick={() => setSearchTerm(rec)}
                  className="bg-white px-5 py-2.5 rounded-2xl text-sm font-black text-indigo-600 border border-indigo-100 hover:border-indigo-400 hover:bg-indigo-600 hover:text-white hover:scale-105 transition-all shadow-sm"
                >
                  {rec}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
            {searchTerm ? `Found ${filteredOffers.length} matches` : 'Top recommendations'}
          </h3>
          <div className="h-px flex-1 mx-6 bg-slate-100"></div>
        </div>
        
        {filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOffers.map((offer, idx) => (
              <SkillCard 
                key={`${offer.teacher.id}-${idx}`}
                skill={offer.skill}
                teacher={offer.teacher}
                onSelect={() => onRequestSwap(offer.teacher.id, offer.skill)}
                canAfford={(currentUser?.profile.medals || 0) >= offer.skill.cost}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="text-4xl mb-4 opacity-50">🔭</div>
            <p className="text-slate-400 font-bold text-lg">We couldn't find any sessions matching your search.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-6 text-indigo-600 font-black hover:underline underline-offset-4"
            >
              Browse all skills
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discovery;
