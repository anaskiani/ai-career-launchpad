import { useState } from 'react';
import { X } from 'lucide-react';

export const SkillsInput = ({ skills = [], onChange, max = 20 }) => {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (skills.length >= max) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...skills, trimmed]);
    setInput('');
  };

  const removeSkill = (index) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
    if (e.key === 'Backspace' && !input && skills.length > 0) {
      removeSkill(skills.length - 1);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200 hover:border-blue-300 transition-colors"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(i)}
              className="p-0.5 rounded-full hover:bg-blue-200 transition-colors"
              aria-label={`Remove ${skill}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length >= max ? `Max ${max} skills` : 'Type a skill and press Enter'}
          disabled={skills.length >= max}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-shadow"
        />
        <button
          type="button"
          onClick={addSkill}
          disabled={!input.trim() || skills.length >= max}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Add
        </button>
      </div>
      <p className="mt-1.5 text-xs text-gray-400">
        {skills.length}/{max} skills
      </p>
    </div>
  );
};
