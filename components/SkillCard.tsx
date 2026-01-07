
import React from 'react';
import { Skill, UserProfile, SkillLevel } from '../types';

interface SkillCardProps {
  skill: Skill;
  teacher: {
    id: string;
    profile: UserProfile;
  };
  onSelect: () => void;
  canAfford: boolean;
}

const getLevelColor = (level: SkillLevel) => {
  switch (level) {
    case 'Beginner': return 'bg-emerald-100 text-emerald-700';
    case 'Intermediate': return 'bg-blue-100 text-blue-700';
    case 'Advanced': return 'bg-purple-100 text-purple-700';
  }
};

const SkillCard: React.FC<SkillCardProps> = ({ skill, teacher, onSelect, canAfford }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${getLevelColor(skill.level)}`}>
            {skill.level}
          </span>
          <div className="flex items-center text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
            <span>{skill.cost}</span>
            <span className="text-[10px] ml-1">MEDALS</span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{skill.name}</h3>
        <p className="text-slate-500 text-sm mb-4">{skill.category}</p>
        
        <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
            {teacher.profile.name[0]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900 leading-tight">{teacher.profile.name}</p>
            <p className="text-xs text-slate-500">{teacher.profile.department}</p>
          </div>
          <div className="flex items-center text-yellow-500 text-sm font-bold">
            ★ {teacher.profile.rating}
          </div>
        </div>
      </div>
      <button
        onClick={onSelect}
        disabled={!canAfford}
        className={`w-full py-3 px-4 text-sm font-bold transition-all active:scale-95 ${
          canAfford 
            ? 'bg-slate-900 text-white hover:bg-indigo-600' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        {canAfford ? 'Request Session' : 'Insufficient Medals'}
      </button>
    </div>
  );
};

export default SkillCard;
