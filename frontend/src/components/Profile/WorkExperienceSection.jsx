import { useState } from 'react';
import { Plus, Pencil, Trash2, Briefcase, X, Check } from 'lucide-react';

const emptyEntry = {
  title: '',
  company: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
};

export const WorkExperienceSection = ({ workExperience = [], onChange }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [draft, setDraft] = useState({ ...emptyEntry });
  const [isAdding, setIsAdding] = useState(false);

  const startAdd = () => {
    setDraft({ ...emptyEntry });
    setIsAdding(true);
    setEditingIndex(null);
  };

  const startEdit = (index) => {
    setDraft({ ...workExperience[index] });
    setEditingIndex(index);
    setIsAdding(false);
  };

  const cancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setDraft({ ...emptyEntry });
  };

  const save = () => {
    if (!draft.title.trim() || !draft.company.trim()) return;
    if (isAdding) {
      onChange([...workExperience, draft]);
    } else if (editingIndex !== null) {
      const updated = [...workExperience];
      updated[editingIndex] = draft;
      onChange(updated);
    }
    cancel();
  };

  const remove = (index) => {
    onChange(workExperience.filter((_, i) => i !== index));
    if (editingIndex === index) cancel();
  };

  const updateDraft = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const renderForm = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => updateDraft('title', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="e.g. Frontend Developer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
          <input
            type="text"
            value={draft.company}
            onChange={(e) => updateDraft('company', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="e.g. Google"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="month"
            value={draft.startDate}
            onChange={(e) => updateDraft('startDate', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="month"
            value={draft.current ? '' : draft.endDate}
            onChange={(e) => updateDraft('endDate', e.target.value)}
            disabled={draft.current}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-shadow"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={draft.current}
          onChange={(e) => updateDraft('current', e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-600">Currently working here</span>
      </label>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={draft.description}
          onChange={(e) => updateDraft('description', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
          rows="3"
          placeholder="What did you do in this role?"
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={save}
          disabled={!draft.title.trim() || !draft.company.trim()}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <Check size={16} /> Save
        </button>
        <button
          type="button"
          onClick={cancel}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          <X size={16} /> Cancel
        </button>
      </div>
    </div>
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '–';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="space-y-4">
      {workExperience.map((entry, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
        >
          {editingIndex === i ? (
            renderForm()
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Briefcase size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{entry.title}</h4>
                  <p className="text-gray-600">{entry.company}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {formatDate(entry.startDate)}
                    {' — '}
                    {entry.current ? 'Present' : formatDate(entry.endDate)}
                  </p>
                  {entry.description && (
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{entry.description}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(i)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label="Edit experience"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                  aria-label="Delete experience"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {isAdding && renderForm()}

      {!isAdding && editingIndex === null && (
        <button
          type="button"
          onClick={startAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all w-full justify-center font-medium"
        >
          <Plus size={18} /> Add Work Experience
        </button>
      )}
    </div>
  );
};
