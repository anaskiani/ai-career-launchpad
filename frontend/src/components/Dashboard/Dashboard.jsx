import { Activity, Bot, Briefcase, FileText, Loader2, Target, UserCircle2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useFetch } from '../../hooks/useFetch';
import dashboardService from '../../services/dashboardService';

export const Dashboard = () => {
  const { data, loading, error } = useFetch(() => dashboardService.getSummary());

  if (loading) {
    return (
      <div className="text-center py-16">
        <Loader2 size={28} className="animate-spin mx-auto text-blue-600 mb-3" />
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600">Failed to load dashboard: {error}</div>;
  }

  const summary = data?.summary;
  const charts = data?.charts;
  const recentActivity = data?.recentActivity;

  const cards = [
    {
      label: 'Profile Completion',
      value: `${summary?.user?.profileCompletion || 0}%`,
      icon: UserCircle2,
      color: 'text-blue-600',
      hint: summary?.user?.targetRole || 'Set your target role',
    },
    {
      label: 'Resume Status',
      value: summary?.resume?.exists ? 'Ready' : 'Missing',
      icon: FileText,
      color: 'text-emerald-600',
      hint: summary?.resume?.exists ? summary.resume.title : 'Create your first resume',
    },
    {
      label: 'Saved Jobs',
      value: summary?.jobs?.savedCount || 0,
      icon: Briefcase,
      color: 'text-violet-600',
      hint: 'Bookmarked opportunities',
    },
    {
      label: 'Skill Match',
      value: summary?.skillGap ? `${summary.skillGap.matchPercentage}%` : 'N/A',
      icon: Target,
      color: 'text-amber-600',
      hint: summary?.skillGap?.targetRole || 'Run a skill analysis',
    },
    {
      label: 'Interview Sessions',
      value: summary?.interviews?.totalSessions || 0,
      icon: Activity,
      color: 'text-pink-600',
      hint: `${summary?.interviews?.completedSessions || 0} completed`,
    },
    {
      label: 'Chatbot Activity',
      value: summary?.chatbot?.assistantReplies || 0,
      icon: Bot,
      color: 'text-cyan-600',
      hint: 'AI replies generated',
    },
  ];

  const pieData = charts?.completion || [];
  const pieColors = ['#3b82f6', '#8b5cf6'];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 data-testid="dashboard-welcome" className="text-3xl font-bold">
          Welcome, {summary?.user?.name}!
        </h1>
        <p className="text-gray-500 mt-1">Your real progress, activity, and readiness at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 text-sm font-medium">{card.label}</h3>
                <Icon size={20} className={card.color} />
              </div>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-sm text-gray-500 mt-2">{card.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="card p-6 xl:col-span-2">
          <h2 className="text-xl font-bold mb-4">Activity Overview</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={charts?.overview || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Readiness Snapshot</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={55}>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Recent Interviews</h2>
          <div className="space-y-3">
            {recentActivity?.interviews?.length ? recentActivity.interviews.map((item) => (
              <div key={item._id} className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-gray-900">{item.role}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-600">
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {item.answeredCount} answers saved · {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            )) : (
              <p className="text-sm text-gray-500">No interview practice yet.</p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Recent Chatbot Activity</h2>
          <div className="space-y-3">
            {recentActivity?.chatbot?.length ? recentActivity.chatbot.map((item) => (
              <div key={item._id} className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-gray-900 capitalize">{item.topic.replace('-', ' ')}</p>
                  <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.content}</p>
              </div>
            )) : (
              <p className="text-sm text-gray-500">No chatbot activity yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
