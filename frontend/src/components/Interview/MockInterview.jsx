import { useEffect, useState, useCallback } from 'react';
import {
  AlertCircle,
  Briefcase,
  Clock3,
  History,
  Loader2,
  MessageSquare,
  PlayCircle,
  CheckCircle2,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { useInterviewStore } from '../../context/interviewStore';

export const MockInterview = () => {
  const {
    roles,
    currentInterview,
    history,
    isLoading,
    isSaving,
    error,
    fetchRoles,
    fetchHistory,
    startInterview,
    updateAnswer,
    submitInterview,
    loadInterview,
    clearCurrentInterview,
  } = useInterviewStore();

  const [selectedRole, setSelectedRole] = useState('');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(75);

  useEffect(() => {
    fetchRoles();
    fetchHistory();
  }, [fetchRoles, fetchHistory]);

  // Handle Timer
  useEffect(() => {
    if (!currentInterview || currentInterview.status === 'completed') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 75;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentInterview, currentQIndex]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(75);
  }, [currentQIndex]);

  const handleStart = async () => {
    if (!selectedRole) return;
    const success = await startInterview(selectedRole);
    if (success) {
      setCurrentQIndex(0);
      setTimeLeft(75);
    }
  };

  const handleNextQuestion = async () => {
    if (!currentInterview) return;
    
    if (currentQIndex < currentInterview.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      await submitInterview();
    }
  };

  const handleOptionSelect = (option) => {
    updateAnswer(currentQIndex, option);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-md">
          <MessageSquare size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skill Quiz</h1>
          <p className="text-sm text-gray-500">Test your knowledge with timed multiple-choice questions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {!currentInterview && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Start a new quiz</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                <select
                  data-testid="interview-role-select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="input"
                  disabled={isLoading}
                >
                  <option value="">Choose a job role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={!selectedRole || isLoading}
                  className="btn btn-primary inline-flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <PlayCircle size={16} />}
                  Start Quiz
                </button>
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
            </div>
          )}

          {currentInterview && currentInterview.status !== 'completed' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6 relative overflow-hidden">
              {/* Progress bar at top */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100">
                <div 
                  className="h-full bg-violet-500 transition-all duration-300" 
                  style={{ width: `${((currentQIndex + 1) / currentInterview.questions.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-wider text-violet-600 uppercase">
                  Question {currentQIndex + 1} of {currentInterview.questions.length}
                </span>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${timeLeft <= 15 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
                  <Clock3 size={16} />
                  {formatTime(timeLeft)}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                {currentInterview.questions[currentQIndex]?.question}
              </h3>

              <div className="space-y-3 mt-8">
                {currentInterview.questions[currentQIndex]?.options?.map((option, idx) => {
                  const isSelected = currentInterview.questions[currentQIndex]?.answer === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-50 shadow-sm' 
                          : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-violet-500' : 'border-gray-300'}`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />}
                        </div>
                        <span className={`font-medium ${isSelected ? 'text-violet-900' : 'text-gray-700'}`}>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  disabled={isSaving}
                  className="btn btn-primary px-8"
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin mx-auto" />
                  ) : currentQIndex === currentInterview.questions.length - 1 ? (
                    'Submit Quiz'
                  ) : (
                    'Next Question'
                  )}
                </button>
              </div>
            </div>
          )}

          {currentInterview && currentInterview.status === 'completed' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 mb-2">
                <span className="text-4xl font-extrabold text-emerald-600">
                  {currentInterview.score}
                </span>
                <span className="text-lg font-bold text-emerald-600 mt-3">%</span>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Quiz Completed!</h2>
                <p className="text-gray-500 mt-2">{currentInterview.feedback}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4">
                <h4 className="font-semibold text-gray-900 mb-4">Question Breakdown</h4>
                {currentInterview.questions.map((q, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <p className="font-medium text-gray-800 text-sm mb-2">{idx + 1}. {q.question}</p>
                    <div className="flex items-start gap-2 text-sm">
                      {q.isCorrect ? (
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={q.isCorrect ? "text-emerald-700 font-medium" : "text-red-700 line-through"}>
                          Your answer: {q.answer || "No answer"}
                        </p>
                        {!q.isCorrect && (
                          <p className="text-emerald-600 font-medium mt-1">Correct: {q.correctAnswer}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={clearCurrentInterview}
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  Restart Quiz
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <History size={18} className="text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-900">Quiz History</h2>
          </div>

          <div className="space-y-3">
            {history.length === 0 ? (
               <p className="text-sm text-gray-500">Your completed quizzes will appear here.</p>
            ) : (
              history.map((session) => (
                <button
                  key={session._id}
                  onClick={() => loadInterview(session._id)}
                  className="w-full text-left rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 p-4 transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-gray-900">{session.role}</p>
                    {session.score != null && (
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        {session.score}%
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    <p className="flex items-center gap-2"><Clock3 size={14} /> {new Date(session.createdAt).toLocaleDateString()}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
