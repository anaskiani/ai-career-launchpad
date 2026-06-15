import { useState } from 'react';
import { Plus, Pencil, Trash2, FolderKanban, X, Check } from 'lucide-react';

const emptyProject = { title: '', description: '', technologies: [], url: '' };

export const ProjectsSection = ({ data = [], onChange }) => {
  const [editIdx, setEditIdx] = useState(null);
  const [draft, setDraft] = useState({ ...emptyProject });
  const [isAdding, setIsAdding] = useState(false);
  const [techInput, setTechInput] = useState('');

  const startAdd = () => { setDraft({ ...emptyProject, technologies: [] }); setIsAdding(true); setEditIdx(null); };
  const startEdit = (i) => { setDraft({ ...data[i], technologies: [...(data[i].technologies || [])] }); setEditIdx(i); setIsAdding(false); };
  const cancel = () => { setIsAdding(false); setEditIdx(null); setTechInput(''); };

  const save = () => {
    if (!draft.title.trim()) return;
    if (isAdding) onChange([...data, draft]);
    else { const u = [...data]; u[editIdx] = draft; onChange(u); }
    cancel();
  };

  const handleUrlBlur = (e) => {
    const val = e.target.value;
    if (val && !/^https?:\/\//i.test(val)) {
      setDraft({ ...draft, url: `https://${val}` });
    }
  };
    if (!draft.title.trim()) return;
    if (isAdding) onChange([...data, draft]);
    else { const u = [...data]; u[editIdx] = draft; onChange(u); }
    cancel();
  };

  const remove = (i) => { onChange(data.filter((_, j) => j !== i)); if (editIdx === i) cancel(); };

  const addTech = () => {
    const t = techInput.trim();
    if (!t || draft.technologies.includes(t)) return;
    setDraft({ ...draft, technologies: [...draft.technologies, t] });
    setTechInput('');
  };

  const removeTech = (i) => {
    setDraft({ ...draft, technologies: draft.technologies.filter((_, j) => j !== i) });
  };

  const inputClass = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow';

  const renderForm = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
          <input type="text" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={inputClass} placeholder="My Awesome Project" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
          <input type="url" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} onBlur={handleUrlBlur} className={inputClass} placeholder="https://github.com/..." />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={`${inputClass} resize-none`} rows="3" placeholder="What does this project do?" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {draft.technologies.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
              {t}
              <button type="button" onClick={() => removeTech(i)} className="p-0.5 rounded-full hover:bg-indigo-200"><X size={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} className={inputClass} placeholder="React, Node.js..." />
          <button type="button" onClick={addTech} disabled={!techInput.trim()} className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 text-sm"><Plus size={16} /></button>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={save} disabled={!draft.title.trim()} className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 text-sm font-medium"><Check size={16} /> Save</button>
        <button type="button" onClick={cancel} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"><X size={16} /> Cancel</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center"><FolderKanban size={16} className="text-indigo-600" /></div>
        <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
      </div>

      {data.map((entry, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          {editIdx === i ? renderForm() : (
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{entry.title}</h4>
                {entry.url && <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">{entry.url}</a>}
                {entry.description && <p className="text-sm text-gray-500 mt-1">{entry.description}</p>}
                {entry.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {entry.technologies.map((t, j) => (
                      <span key={j} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">{t}</span>
                    ))}
                  </div>
                )}
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
        <button type="button" onClick={startAdd} className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all w-full justify-center font-medium">
          <Plus size={18} /> Add Project
        </button>
      )}
    </div>
  );
};
