import { useState } from 'react';
import { Plus, Pencil, Trash2, Award, X, Check } from 'lucide-react';

const emptyCert = { title: '', issuer: '', issueDate: '', expiryDate: '', url: '' };

export const CertificationsSection = ({ data = [], onChange }) => {
  const [editIdx, setEditIdx] = useState(null);
  const [draft, setDraft] = useState({ ...emptyCert });
  const [isAdding, setIsAdding] = useState(false);

  const startAdd = () => { setDraft({ ...emptyCert }); setIsAdding(true); setEditIdx(null); };
  const startEdit = (i) => { setDraft({ ...data[i] }); setEditIdx(i); setIsAdding(false); };
  const cancel = () => { setIsAdding(false); setEditIdx(null); };

  const updateDraft = (field, value) => {
    setDraft((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'issueDate' && next.expiryDate && next.issueDate > next.expiryDate) {
        next.expiryDate = next.issueDate;
      } else if (field === 'expiryDate' && next.issueDate && next.expiryDate < next.issueDate) {
        next.issueDate = next.expiryDate;
      }
      return next;
    });
  };

  const handleUrlBlur = (e) => {
    const val = e.target.value;
    if (val && !/^https?:\/\//i.test(val)) {
      setDraft((prev) => ({ ...prev, url: `https://${val}` }));
    }
  };

  const save = () => {
    if (!draft.title.trim()) return;
    if (isAdding) onChange([...data, draft]);
    else { const u = [...data]; u[editIdx] = draft; onChange(u); }
    cancel();
  };

  const remove = (i) => { onChange(data.filter((_, j) => j !== i)); if (editIdx === i) cancel(); };

  const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date)) return d;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const inputClass = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow';

  const renderForm = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Certification Title *</label>
          <input type="text" value={draft.title} onChange={(e) => updateDraft('title', e.target.value)} className={inputClass} placeholder="AWS Solutions Architect" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
          <input type="text" value={draft.issuer} onChange={(e) => updateDraft('issuer', e.target.value)} className={inputClass} placeholder="Amazon Web Services" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
          <input type="month" value={draft.issueDate ? draft.issueDate.substring(0, 7) : ''} onChange={(e) => updateDraft('issueDate', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <input type="month" value={draft.expiryDate ? draft.expiryDate.substring(0, 7) : ''} onChange={(e) => updateDraft('expiryDate', e.target.value)} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Credential URL</label>
          <input type="url" value={draft.url} onChange={(e) => updateDraft('url', e.target.value)} onBlur={handleUrlBlur} className={inputClass} placeholder="https://credential.net/..." />
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
        <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center"><Award size={16} className="text-rose-600" /></div>
        <h3 className="text-lg font-semibold text-gray-800">Certifications</h3>
      </div>

      {data.map((entry, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          {editIdx === i ? renderForm() : (
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{entry.title}</h4>
                {entry.issuer && <p className="text-gray-600">{entry.issuer}</p>}
                <div className="flex gap-3 mt-1 text-sm text-gray-400">
                  {entry.issueDate && <span>Issued: {formatDate(entry.issueDate)}</span>}
                  {entry.expiryDate && <span>Expires: {formatDate(entry.expiryDate)}</span>}
                </div>
                {entry.url && <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-1 inline-block">View Credential</a>}
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
        <button type="button" onClick={startAdd} className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all w-full justify-center font-medium">
          <Plus size={18} /> Add Certification
        </button>
      )}
    </div>
  );
};
