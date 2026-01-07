import React, { useState, useEffect } from 'react';
import { User, SkillLevel, Skill } from '../types';

interface ProfileProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState(user.profile);
  const [newSkill, setNewSkill] = useState({ 
    name: '', 
    level: 'Beginner' as SkillLevel, 
    category: '', 
    cost: 5 
  });
  
  // States for popups
  const [isDeptPopupOpen, setIsDeptPopupOpen] = useState(false);
  const [isYearPopupOpen, setIsYearPopupOpen] = useState(false);
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);

  const departments = ['CSE', 'IT', 'AIDS', 'ECE', 'EEE', 'Civil', 'Mech'];
  const academicYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const categories = [
    'Web Development', 'Mobile Dev', 'Computer Science', 
    'UI/UX Design', 'Data Science', 'Hardware', 
    'Tools', 'Language', 'Public Speaking', 'Others'
  ];

  // Sync local form if the global user object changes
  useEffect(() => {
    setFormData(user.profile);
  }, [user.profile]);

  const handleSave = () => {
    onUpdate({ ...user, profile: formData });
    alert('Profile saved successfully! Your Department and Year are now updated in the database.');
  };

  const addSkill = () => {
    if (!newSkill.name.trim()) {
      alert('Please enter a skill name.');
      return;
    }
    if (!newSkill.category) {
      alert('Please select a category.');
      return;
    }
    
    const skill: Skill = { 
      id: `s-${Date.now()}`,
      name: newSkill.name,
      level: newSkill.level,
      category: newSkill.category,
      cost: newSkill.cost
    };

    const updatedSkills = [...formData.teachingSkills, skill];
    const updatedProfile = { ...formData, teachingSkills: updatedSkills };
    
    // Update local state for immediate feedback
    setFormData(updatedProfile);
    
    // Clear the "Add New" form
    setNewSkill({ name: '', level: 'Beginner', category: '', cost: 5 });
    
    // Automatically trigger a save to the global "database"
    onUpdate({ ...user, profile: updatedProfile });
    alert(`Successfully added "${skill.name}" to your teaching catalog! Everyone can now see this.`);
  };

  const removeSkill = (id: string) => {
    const updatedSkills = formData.teachingSkills.filter(s => s.id !== id);
    const updatedProfile = { ...formData, teachingSkills: updatedSkills };
    setFormData(updatedProfile);
    onUpdate({ ...user, profile: updatedProfile });
  };

  const selectDept = (dept: string) => {
    setFormData({ ...formData, department: dept });
    setIsDeptPopupOpen(false);
  };

  const selectYear = (year: string) => {
    setFormData({ ...formData, year: year });
    setIsYearPopupOpen(false);
  };

  const selectCategory = (cat: string) => {
    setNewSkill({ ...newSkill, category: cat });
    setIsCategoryPopupOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
      {/* Popups Overlays */}
      {isDeptPopupOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Select Department</h3>
              <button onClick={() => setIsDeptPopupOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold active:scale-125 transition-all">✕</button>
            </div>
            <div className="p-4 grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => selectDept(dept)}
                  className={`w-full py-4 px-6 rounded-2xl text-left font-bold transition-all active:scale-[0.98] ${
                    formData.department === dept 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-100'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isYearPopupOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Academic Year</h3>
              <button onClick={() => setIsYearPopupOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold active:scale-125 transition-all">✕</button>
            </div>
            <div className="p-4 grid grid-cols-1 gap-2">
              {academicYears.map(year => (
                <button
                  key={year}
                  onClick={() => selectYear(year)}
                  className={`w-full py-4 px-6 rounded-2xl text-left font-bold transition-all active:scale-[0.98] ${
                    formData.year === year 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-100'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isCategoryPopupOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Select Skill Category</h3>
              <button onClick={() => setIsCategoryPopupOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold active:scale-125 transition-all">✕</button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className={`py-3 px-4 rounded-xl text-sm font-bold transition-all active:scale-[0.98] ${
                    newSkill.category === cat 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center gap-8 pb-10 border-b border-slate-100">
        <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-indigo-100">
          {(user.profile.name || user.username)[0].toUpperCase()}
        </div>
        <div className="flex-1 space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user.profile.name || user.username}</h1>
          <p className="text-slate-500 font-medium">{formData.department} • {formData.year}</p>
          <div className="flex gap-2 pt-2">
            <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-xl text-xs font-black border border-amber-100 uppercase tracking-wider">
              🏅 {user.profile.medals} Medals
            </span>
            <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-xl text-xs font-black border border-yellow-100 uppercase tracking-wider">
              ★ {user.profile.rating} Rating
            </span>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-50"
        >
          Save Profile Changes
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
             <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
             <h3 className="text-xl font-black text-slate-900">Personal Info</h3>
          </div>
          <div className="space-y-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2.5">Student Bio</label>
              <textarea 
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 min-h-[140px] focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-600"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share your interests or academic goals..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2.5">Department</label>
                <button
                  onClick={() => setIsDeptPopupOpen(true)}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 text-left flex justify-between items-center focus:bg-white hover:border-indigo-200 outline-none font-semibold text-slate-700 transition-all active:scale-[0.97]"
                >
                  <span className="truncate">{formData.department}</span>
                  <span className="text-indigo-400 ml-1">▼</span>
                </button>
              </div>
              <div className="relative">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2.5">Academic Year</label>
                <button
                  onClick={() => setIsYearPopupOpen(true)}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 text-left flex justify-between items-center focus:bg-white hover:border-indigo-200 outline-none font-semibold text-slate-700 transition-all active:scale-[0.97]"
                >
                  <span className="truncate">{formData.year}</span>
                  <span className="text-violet-400 ml-1">▼</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-3">
             <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
             <h3 className="text-xl font-black text-slate-900">Teaching Catalog</h3>
          </div>
          <div className="space-y-4">
            {formData.teachingSkills.length > 0 ? (
               <div className="space-y-3">
                 {formData.teachingSkills.map(skill => (
                    <div key={skill.id} className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors group">
                      <div>
                        <p className="font-black text-slate-800">{skill.name}</p>
                        <div className="flex gap-2 items-center mt-1">
                          <span className="text-[10px] font-black text-indigo-500 uppercase px-1.5 py-0.5 bg-indigo-50 rounded">{skill.level}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{skill.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-amber-600 font-black text-sm">{skill.cost} 🏅</span>
                        <button 
                          onClick={() => removeSkill(skill.id)} 
                          className="text-slate-300 hover:text-red-500 transition-all p-2 active:scale-125"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
               </div>
            ) : (
              <div className="bg-slate-100/50 rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">You haven't added any skills to teach yet.</p>
              </div>
            )}

            {/* Add New Skill Section */}
            <div className="p-8 bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200 space-y-5 mt-8 border border-white/10">
              <h4 className="text-white font-black text-center text-sm uppercase tracking-[0.3em] opacity-80">Add New Offering</h4>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Skill Name (e.g. Photoshop Expert)"
                  className="w-full bg-slate-800 border-none rounded-2xl p-4 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsCategoryPopupOpen(true)}
                    className="w-full bg-slate-800 rounded-xl p-3 text-sm text-white flex justify-between items-center hover:bg-slate-700 transition-all active:scale-[0.97]"
                  >
                    <span className="truncate">{newSkill.category || 'Category'}</span>
                    <span className="text-slate-500 text-xs">▼</span>
                  </button>
                  
                  <select 
                    className="w-full bg-slate-800 border-none rounded-xl p-3 text-sm text-white outline-none cursor-pointer active:scale-[0.97] transition-all"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as SkillLevel })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Set Price (Medals)</p>
                    <input 
                      type="range"
                      min="1"
                      max="30"
                      className="w-full accent-indigo-500 cursor-pointer"
                      value={newSkill.cost}
                      onChange={(e) => setNewSkill({ ...newSkill, cost: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 flex flex-col items-center">
                    <span className="text-white font-black text-lg">{newSkill.cost}</span>
                    <span className="text-[8px] font-bold text-amber-500 uppercase">Medals</span>
                  </div>
                </div>

                <button 
                  onClick={addSkill}
                  className="w-full bg-indigo-500 text-white py-4 rounded-2xl font-black text-sm hover:bg-indigo-400 transition-all active:scale-95 shadow-lg shadow-indigo-900/40"
                >
                  + Add To My Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;