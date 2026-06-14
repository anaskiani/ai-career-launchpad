import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Rocket, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProfileStore } from '../../context/profileStore';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const desktopNavClass = ({ isActive }) =>
  [
    'relative inline-flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200',
    'after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:transition-transform after:duration-200',
    isActive
      ? 'text-blue-600 after:scale-x-100 after:bg-blue-600'
      : 'text-slate-600 hover:text-blue-600 after:scale-x-0 after:bg-blue-600 hover:after:scale-x-100',
  ].join(' ');

const mobileNavClass = ({ isActive }) =>
  [
    'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2.5'
      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600',
  ].join(' ');

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile, fetchProfile } = useProfileStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user && !profile) {
      fetchProfile();
    }
  }, [user, profile, fetchProfile]);

  const profileImage = profile?.profileImage || user?.profileImage;
  const avatarUrl = profileImage
    ? profileImage.startsWith('data:image')
      ? profileImage
      : `${API_BASE}/${profileImage}`
    : null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobile = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to={user ? '/dashboard' : '/'}
          className="group flex items-center gap-2.5 shrink-0"
          onClick={closeMobile}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm shadow-blue-600/20">
            <Rocket size={18} className="text-white" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-700">
              AI Career Launchpad
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:block">
              Student career toolkit
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
          {user ? (
            <>
              <NavLink to="/dashboard" className={desktopNavClass} end>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={desktopNavClass}>
                Profile
              </NavLink>
              <div className="mx-3 h-6 w-px bg-slate-200" aria-hidden />
              <div className="flex items-center gap-3">
                <div className="hidden text-right lg:block">
                  <p className="text-sm font-semibold leading-none text-slate-800">{user.name}</p>
                  <p className="mt-0.5 max-w-[160px] truncate text-xs text-slate-500">{user.email}</p>
                </div>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="h-9 w-9 rounded-full object-cover ring-2 ring-white" />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700 ring-2 ring-white">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={desktopNavClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="ml-2 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition hover:bg-blue-700"
              >
                Get started
              </NavLink>
            </>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <nav className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <div className="space-y-1">
            {user ? (
              <>
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Signed in as {user.name}
                </p>
                <NavLink to="/dashboard" className={mobileNavClass} onClick={closeMobile} end>
                  Dashboard
                </NavLink>
                <NavLink to="/profile" className={mobileNavClass} onClick={closeMobile}>
                  Profile
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    handleLogout();
                  }}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={mobileNavClass} onClick={closeMobile}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={closeMobile}
                  className="mt-1 block rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Get started
                </NavLink>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};
