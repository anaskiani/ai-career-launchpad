import { useState } from 'react';
import { Plus, Pencil, Trash2, Briefcase, X, Check } from 'lucide-react';

const emptyExp = {
  company: '', position: '', startDate: '', endDate: '',
  currentlyWorking: false, description: '',
};

export const ExperienceSection = ({ data = [], onChange }) => {
  const [editIdx, setEditIdx] = useState(null);
  const [draft, setDraft] = useState({ ...emptyExp });
  const [isAdding, setIsAdding] = useState(false);

  const startAdd = () => { setDraft({ ...emptyExp }); setIsAdding(true); setEditIdx(null); };
  const startEdit = (i) => { setDraft({ ...data[i] }); setEditIdx(i); setIsAdding(false); };
  const cancel = () => { setIsAdding(false); setEditIdx(null); };

  const save = () => {
    if (!draft.position.trim() || !draft.company.trim()) return;
    if (isAdding) onChange([...data, draft]);
    else { const u = [...data]; u[editIdx] = draft; onChange(u); }
    cancel();
  };

  const remove = (i) => { onChange(data.filter((_, j) => j !== i)); if (editIdx === i) cancel(); };

  const formatDate = (d) => {
    if (!d) return '–';
    const date = new Date(d);
    if (isNaN(date)) return d;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const inputClass = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow';

  const renderForm = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
          <input type="text" value={draft.position} onChange={(e) => setDraft({ ...draft, position: e.target.value })} className={inputClass} placeholder="Software Engineer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
          <input type="text" value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} className={inputClass} placeholder="Google" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input type="month" value={draft.startDate ? draft.startDate.substring(0, 7) : ''} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input type="month" value={draft.currentlyWorking ? '' : (draft.endDate ? draft.endDate.substring(0, 7) : '')} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} disabled={draft.currentlyWorking} className={`${inputClass} disabled:bg-gray-100`} />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={draft.currentlyWorking} onChange={(e) => setDraft({ ...draft, currentlyWorking: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
        <span className="text-sm text-gray-600">Currently working here</span>
      </label>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={`${inputClass} resize-none`} rows="3" placeholder="Key responsibilities and achievements..." />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={save} disabled={!draft.position.trim() || !draft.company.trim()} className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 text-sm font-medium"><Check size={16} /> Save</button>
        <button type="button" onClick={cancel} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"><X size={16} /> Cancel</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center"><Briefcase size={16} className="text-emerald-600" /></div>
        <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
      </div>

      {data.map((entry, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          {editIdx === i ? renderForm() : (
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{entry.position}</h4>
                <p className="text-gray-600">{entry.company}</p>
                <p className="text-sm text-gray-400 mt-1">{formatDate(entry.startDate)} — {entry.currentlyWorking ? 'Present' : formatDate(entry.endDate)}</p>
                {entry.description && <p className="text-sm text-gray-500 mt-2">{entry.description}</p>}
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => startEdit(i)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600"><Pencil size={16} /></button>
                <button type="button" onClick={() => remove(i)} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          )}
        </div>
      ))}

      {isAdding && renderForm()}

      {!isAdding && editIdx === null && (
        <button type="button" onClick={startAdd} className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all w-full justify-center font-medium">
          <Plus size={18} /> Add Experience
        </button>
      )}
    </div>
  );
};
