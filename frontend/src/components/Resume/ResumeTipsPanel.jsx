import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { resumeTips, getResumeChecklistScore } from '../../utils/resumeTips';

export const ResumeTipsPanel = ({ form }) => {
  const checklistScore = getResumeChecklistScore(form);

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
          <Lightbulb size={18} className="text-amber-700" />
        </div>
        <div>
          <h3 className="font-semibold text-amber-900">Resume tips (offline checklist)</h3>
          <p className="text-sm text-amber-800 mt-0.5">
            Built-in guidance — no paid AI required. Checklist strength: {checklistScore}%
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {resumeTips.map((item) => (
          <li key={item.id} className="flex gap-2 text-sm text-amber-950">
            <CheckCircle2 size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>{item.title}:</strong> {item.tip}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
