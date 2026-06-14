import { useEffect, useState } from 'react';
import { AlertCircle, Bot, Loader2, Send, Sparkles, User } from 'lucide-react';
import { aiService } from '../../services/aiService';

const topicOptions = [
  { value: 'resume', label: 'Resume feedback' },
  { value: 'interview', label: 'Interview help' },
  { value: 'skill-roadmap', label: 'Skill roadmap' },
  { value: 'job-advice', label: 'Job advice' },
  { value: 'career-guidance', label: 'Career guidance' },
];

export const AIChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState('career-guidance');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fallbackUsed, setFallbackUsed] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await aiService.getHistory();
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error('Failed to load chat history', err);
      }
    };

    loadHistory();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    setIsLoading(true);
    setError('');

    const userMessage = {
      _id: `temp-user-${Date.now()}`,
      role: 'user',
      topic,
      content: message,
    };

    setMessages((current) => [...current, userMessage]);
    const currentMessage = message;
    setMessage('');

    try {
      const res = await aiService.chat(currentMessage, { topic });
      setFallbackUsed(Boolean(res.data.fallbackUsed));
      setMessages((current) => [
        ...current,
        {
          _id: `temp-assistant-${Date.now()}`,
          role: 'assistant',
          topic: res.data.topic,
          content: res.data.reply,
        },
      ]);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Career Chatbot</h1>
        </div>
      </div>



      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 p-4 flex flex-col md:flex-row md:items-center gap-3">
          <select value={topic} onChange={(e) => setTopic(e.target.value)} className="input md:max-w-xs">
            {topicOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fallbackUsed && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
              Last reply used static fallback (Local AI server offline).
            </div>
          )}
        </div>

        <div className="p-6 space-y-4 min-h-[420px] max-h-[60vh] overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles size={28} className="mx-auto text-emerald-500 mb-3" />
              <p className="font-semibold text-gray-900 mb-2">Start your first conversation</p>
              <p className="text-gray-500">Try asking for resume feedback, interview answers, or a learning roadmap.</p>
            </div>
          ) : (
            messages.map((item) => (
              <div
                key={item._id}
                className={`flex ${item.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-3xl rounded-2xl px-4 py-3 shadow-sm ${
                    item.role === 'assistant'
                      ? 'bg-white border border-gray-100 text-gray-800'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold opacity-80">
                    {item.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                    {item.role === 'assistant' ? 'Career Assistant' : 'You'}
                  </div>
                  <p className="text-sm leading-6 whitespace-pre-line">{item.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4 space-y-3">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="flex gap-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="input min-h-[100px]"
              placeholder="Ask about your resume, interview prep, skills, jobs, or your career path..."
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="btn btn-primary self-end inline-flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
