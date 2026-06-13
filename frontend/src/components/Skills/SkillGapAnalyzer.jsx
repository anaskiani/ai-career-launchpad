import { useState, useEffect } from 'react';
import { useSkillStore } from '../../context/skillStore';
import {
  Zap, Target, CheckCircle, XCircle, AlertCircle, Loader2,
  ChevronRight, ExternalLink, Trash2, Clock, TrendingUp,
  BookOpen, ArrowRight, BarChart3
} from 'lucide-react';

const PRIORITY_BADGE = {
  essential: 'bg-red-100 text-red-700 border-red-200',
  recommended: 'bg-amber-100 text-amber-700 border-amber-200',
  optional: 'bg-gray-100 text-gray-600 border-gray-200',
};

export const SkillGapAnalyzer = () => {
  const {
    roles, analysis, history, isLoading, isAnalyzing, error,
    fetchRoles, analyzeGap, fetchHistory, loadAnalysis, deleteFromHistory, clearAnalysis,
  } = useSkillStore();

  const [selectedRole, setSelectedRole] = useState('');
  const [activeTab, setActiveTab] = useState('results');

  useEffect(() => {
    fetchRoles();
    fetchHistory();
  }, [fetchRoles, fetchHistory]);

  const handleAnalyze = async () => {
    if (!selectedRole) return;
    const success = await analyzeGap(selectedRole);
    if (success) {
      setActiveTab('results');
      fetchHistory();
    }
  };

  const getMatchColor = (pct) => {
    if (pct >= 80) return 'text-emerald-600';
    if (pct >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getMatchBg = (pct) => {
    if (pct >= 80) return 'from-emerald-500 to-green-400';
    if (pct >= 50) return 'from-amber-500 to-yellow-400';
    return 'from-red-500 to-orange-400';
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
          <BarChart3 size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skill Gap Analyzer</h1>
          <p className="text-sm text-gray-500">Compare your skills against target role requirements</p>
        </div>
      </div>

      {/* Role Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Target Role</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); clearAnalysis(); }}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white text-gray-800 font-medium"
            disabled={isLoading}
          >
            <option value="">Choose a role...</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <button
            onClick={handleAnalyze}
            disabled={!selectedRole || isAnalyzing}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all font-semibold shadow-sm"
          >
            {isAnalyzing ? (
              <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
            ) : (
              <><Zap size={18} /> Analyze Skills</>
            )}
          </button>
        </div>
        {error && (
          <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}
      </div>

      {/* Results */}
      {analysis && (
        <div className="space-y-6 animate-fadeIn">
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Match Score */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle
                    cx="50" cy="50" r="42"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${analysis.matchPercentage * 2.64} 264`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={analysis.matchPercentage >= 50 ? '#10b981' : '#ef4444'} />
                      <stop offset="100%" stopColor={analysis.matchPercentage >= 50 ? '#34d399' : '#f97316'} />
                    </linearGradient>
                  </defs>
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${getMatchColor(analysis.matchPercentage)}`}>
                  {analysis.matchPercentage}%
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600">Skill Match</p>
            </div>

            {/* Skills Matched */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle size={24} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{analysis.matchingSkills.length}</p>
                <p className="text-sm text-gray-500">Skills You Have</p>
              </div>
            </div>

            {/* Skills Missing */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <XCircle size={24} className="text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{analysis.missingSkills.length}</p>
                <p className="text-sm text-gray-500">Skills to Learn</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {[
                { id: 'results', label: 'Skill Breakdown', icon: Target },
                { id: 'roadmap', label: 'Learning Roadmap', icon: BookOpen },
                { id: 'recommendations', label: 'Recommendations', icon: TrendingUp },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-violet-600 text-violet-600 bg-violet-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} /> {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-6">
              {/* Skill Breakdown Tab */}
              {activeTab === 'results' && (
                <div className="space-y-6">
                  {/* Matching Skills */}
                  {analysis.matchingSkills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <CheckCircle size={16} /> Skills You Have
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.matchingSkills.map((skill, i) => (
                          <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {analysis.missingDetails && analysis.missingDetails.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <XCircle size={16} /> Skills to Learn
                      </h3>
                      <div className="space-y-2">
                        {analysis.missingDetails.map((skill, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900">{skill.name}</span>
                              <span className="text-xs text-gray-400">{skill.category}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PRIORITY_BADGE[skill.priority]}`}>
                                {skill.priority}
                              </span>
                            </div>
                            {skill.resource && (
                              <a
                                href={skill.resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium"
                              >
                                {skill.resource.platform} <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Learning Roadmap Tab */}
              {activeTab === 'roadmap' && (
                <div className="space-y-6">
                  {analysis.roadmap && analysis.roadmap.map((phase, i) => (
                    <div key={i} className="relative">
                      {/* Phase connector line */}
                      {i < analysis.roadmap.length - 1 && (
                        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-violet-200" />
                      )}

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10">
                          {phase.phase}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">{phase.title}</h4>
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-white px-2.5 py-1 rounded-full border">
                              <Clock size={12} /> {phase.duration}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {phase.skills.map((skill, j) => (
                              <div key={j} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200">
                                <div>
                                  <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                                  <span className="text-xs text-gray-400 ml-2">{skill.category}</span>
                                </div>
                                {skill.resource && (
                                  <a
                                    href={skill.resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 text-violet-500 hover:text-violet-700"
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!analysis.roadmap || analysis.roadmap.length === 0) && (
                    <div className="text-center py-8 text-gray-400">
                      <CheckCircle size={40} className="mx-auto mb-3 text-emerald-400" />
                      <p className="font-medium">No learning roadmap needed — you have all the skills!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Recommendations Tab */}
              {activeTab === 'recommendations' && (
                <div className="space-y-3">
                  {analysis.recommendations && analysis.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-violet-50 rounded-xl border border-violet-100">
                      <ArrowRight size={18} className="text-violet-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analysis History */}
      {history.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Analyses</h2>
          <div className="space-y-2">
            {history.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <button
                  onClick={() => loadAnalysis(item._id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br ${getMatchBg(item.matchPercentage)}`}>
                    {item.matchPercentage}%
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.targetRole}</p>
                    <p className="text-xs text-gray-400">
                      {item.matchingSkills?.length || 0} matched · {item.missingSkills?.length || 0} missing · {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => deleteFromHistory(item._id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
