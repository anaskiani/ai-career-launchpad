import { useState } from 'react';
import { Plus, Pencil, Trash2, GraduationCap, X, Check } from 'lucide-react';

const emptyEdu = {
  institution: '', degree: '', field: '', graduationDate: '', gpa: '',
};

export const ResumeEducationSection = ({ data = [], onChange }) => {
  const [editIdx, setEditIdx] = useState(null);
  const [draft, setDraft] = useState({ ...emptyEdu });
  const [isAdding, setIsAdding] = useState(false);

  const startAdd = () => { setDraft({ ...emptyEdu }); setIsAdding(true); setEditIdx(null); };
  const startEdit = (i) => { setDraft({ ...data[i] }); setEditIdx(i); setIsAdding(false); };
  const cancel = () => { setIsAdding(false); setEditIdx(null); };

  const save = () => {
    if (!draft.institution.trim() || !draft.degree.trim()) return;
    if (isAdding) onChange([...data, draft]);
    else { const u = [...data]; u[editIdx] = draft; onChange(u); }
    cancel();
  };

  const remove = (i) => { onChange(data.filter((_, j) => j !== i)); if (editIdx === i) cancel(); };

  const inputClass = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow';

  const renderForm = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
          <input type="text" value={draft.institution} onChange={(e) => setDraft({ ...draft, institution: e.target.value })} className={inputClass} placeholder="University name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
          <input type="text" value={draft.degree} onChange={(e) => setDraft({ ...draft, degree: e.target.value })} className={inputClass} placeholder="BS Computer Science" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
          <input type="text" value={draft.field} onChange={(e) => setDraft({ ...draft, field: e.target.value })} className={inputClass} placeholder="Artificial Intelligence" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Date</label>
          <input type="month" value={draft.graduationDate ? draft.graduationDate.substring(0, 7) : ''} onChange={(e) => setDraft({ ...draft, graduationDate: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
          <input type="text" value={draft.gpa} onChange={(e) => setDraft({ ...draft, gpa: e.target.value })} className={inputClass} placeholder="3.8/4.0" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={save} disabled={!draft.institution.trim() || !draft.degree.trim()} className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 text-sm font-medium"><Check size={16} /> Save</button>
        <button type="button" onClick={cancel} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"><X size={16} /> Cancel</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><GraduationCap size={16} className="text-purple-600" /></div>
        <h3 className="text-lg font-semibold text-gray-800">Education</h3>
      </div>

      {data.map((entry, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          {editIdx === i ? renderForm() : (
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{entry.degree}{entry.field ? ` in ${entry.field}` : ''}</h4>
                <p className="text-gray-600">{entry.institution}</p>
                <div className="flex gap-3 mt-1 text-sm text-gray-400">
                  {entry.graduationDate && <span>{new Date(entry.graduationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>}
                  {entry.gpa && <span>GPA: {entry.gpa}</span>}
                </div>
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
        <button type="button" onClick={startAdd} className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all w-full justify-center font-medium">
          <Plus size={18} /> Add Education
        </button>
      )}
    </div>
  );
};
