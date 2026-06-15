import { useState } from 'react';
import { Plus, X, Zap } from 'lucide-react';

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const PROFICIENCY_COLORS = {
  Beginner: 'bg-gray-200 text-gray-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-emerald-100 text-emerald-700',
  Expert: 'bg-purple-100 text-purple-700',
};

export const ResumeSkillsSection = ({ data = [], onChange }) => {
  const [name, setName] = useState('');
  const [proficiency, setProficiency] = useState('Intermediate');

  const addSkill = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (data.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...data, { name: trimmed, proficiency }]);
    setName('');
  };

  const removeSkill = (i) => onChange(data.filter((_, j) => j !== i));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
      </div>

      {/* Skill tags */}
      <div className="flex flex-wrap gap-2">
        {data.map((skill, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${PROFICIENCY_COLORS[skill.proficiency] || PROFICIENCY_COLORS.Intermediate}`}
          >
            {skill.name}
            <span className="text-xs opacity-70">· {skill.proficiency}</span>
            <button type="button" onClick={() => removeSkill(i)} className="ml-0.5 p-0.5 rounded-full hover:bg-black/10 transition-colors">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {/* Add skill */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s\-']/g, ''))}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="e.g. React, Python, AWS"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <select
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {PROFICIENCY_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={addSkill}
          disabled={!name.trim()}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors font-medium"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};
