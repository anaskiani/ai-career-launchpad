import { useState } from 'react';
import { Plus, Pencil, Trash2, GraduationCap, X, Check } from 'lucide-react';

const emptyEntry = {
  institution: '',
  degree: '',
  field: '',
  startYear: '',
  endYear: '',
  current: false,
};

export const EducationSection = ({ education = [], onChange }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [draft, setDraft] = useState({ ...emptyEntry });
  const [isAdding, setIsAdding] = useState(false);

  const startAdd = () => {
    setDraft({ ...emptyEntry });
    setIsAdding(true);
    setEditingIndex(null);
  };

  const startEdit = (index) => {
    setDraft({ ...education[index] });
    setEditingIndex(index);
    setIsAdding(false);
  };

  const cancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setDraft({ ...emptyEntry });
  };

  const save = () => {
    if (!draft.institution.trim() || !draft.degree.trim()) return;
    if (isAdding) {
      onChange([...education, draft]);
    } else if (editingIndex !== null) {
      const updated = [...education];
      updated[editingIndex] = draft;
      onChange(updated);
    }
    cancel();
  };

  const remove = (index) => {
    onChange(education.filter((_, i) => i !== index));
    if (editingIndex === index) cancel();
  };

  const updateDraft = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const renderForm = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
          <input
            type="text"
            value={draft.institution}
            onChange={(e) => updateDraft('institution', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="University / College name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
          <input
            type="text"
            value={draft.degree}
            onChange={(e) => updateDraft('degree', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="e.g. BS Computer Science"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
          <input
            type="text"
            value={draft.field}
            onChange={(e) => updateDraft('field', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="e.g. Artificial Intelligence"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
            <input
              type="number"
              value={draft.startYear}
              onChange={(e) => updateDraft('startYear', e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              placeholder="2020"
              min="1950"
              max="2040"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
            <input
              type="number"
              value={draft.current ? '' : draft.endYear}
              onChange={(e) => updateDraft('endYear', e.target.value ? parseInt(e.target.value) : '')}
              disabled={draft.current}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-shadow"
              placeholder="2024"
              min="1950"
              max="2040"
            />
          </div>
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={draft.current}
          onChange={(e) => updateDraft('current', e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-600">Currently enrolled</span>
      </label>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={save}
          disabled={!draft.institution.trim() || !draft.degree.trim()}
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

  return (
    <div className="space-y-4">
      {education.map((entry, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
        >
          {editingIndex === i ? (
            renderForm()
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <GraduationCap size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{entry.degree}</h4>
                  <p className="text-gray-600">{entry.institution}</p>
                  {entry.field && <p className="text-sm text-gray-500">{entry.field}</p>}
                  <p className="text-sm text-gray-400 mt-1">
                    {entry.startYear || '–'}
                    {' — '}
                    {entry.current ? 'Present' : entry.endYear || '–'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(i)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label="Edit education"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                  aria-label="Delete education"
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
          className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all w-full justify-center font-medium"
        >
          <Plus size={18} /> Add Education
        </button>
      )}
    </div>
  );
};
