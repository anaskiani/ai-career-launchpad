import { NavLink } from 'react-router-dom';
import { FileText, Zap, Briefcase, MessageSquare, Users, LayoutDashboard } from 'lucide-react';

const sidebarLinkClass = ({ isActive }) =>
  [
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
    isActive
      ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600',
  ].join(' ');

const iconClass = (isActive) => (isActive ? 'text-blue-600' : 'text-slate-400');

export const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', end: true },
    { icon: FileText, label: 'Resume Builder', path: '/resume' },
    { icon: Zap, label: 'Skill Gap', path: '/skills' },
    { icon: Briefcase, label: 'Job Finder', path: '/jobs' },
    { icon: Users, label: 'Mock Interview', path: '/interview' },
    { icon: MessageSquare, label: 'AI Chatbot', path: '/chatbot' },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white md:block">
      <nav className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={sidebarLinkClass}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} className={iconClass(isActive)} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};
