import { Bell, BookOpen, ClipboardCheck, LayoutDashboard, LogOut, MessageSquare, Settings, ShieldCheck, UserCircle2 } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/program', label: 'Program', icon: BookOpen },
  { to: '/community', label: 'Community', icon: MessageSquare },
  { to: '/deliverables', label: 'Deliverables', icon: ClipboardCheck },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function MainLayout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.unreadNotifications()
      .then((payload) => setUnreadCount(payload.unreadCount))
      .catch(() => setUnreadCount(0));
  }, []);

  const logout = async () => {
    await api.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_32%),linear-gradient(180deg,_#f8fafc,_#eef2ff)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur lg:flex lg:flex-col">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-emerald-700">Reusable Starter</div>
            <div className="mt-3 text-2xl font-semibold text-slate-950">Program Platform</div>
            <p className="mt-3 text-sm text-slate-600">Generic learning operations shell for cohort programs, enablement tracks, or internal academies.</p>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
            {user?.role === 'ADMIN' ? (
              <NavLink
                to="/admin"
                className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                <ShieldCheck size={18} />
                Admin
              </NavLink>
            ) : null}
          </nav>

          <div className="mt-auto rounded-3xl bg-slate-950 p-5 text-white">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-300">Signed in</div>
            <div className="mt-2 text-lg font-semibold">{user?.fullName}</div>
            <div className="text-sm text-slate-300">{user?.track}</div>
            <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white" onClick={logout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="rounded-[2rem] border border-white/70 bg-white/85 px-5 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Workspace</div>
                <h1 className="mt-2 text-2xl font-semibold text-slate-950">Build, run, and reuse cohort learning programs.</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                  <Bell size={16} />
                  {unreadCount} unread
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                  {user?.role}
                </div>
              </div>
            </div>
          </header>

          <main className="mt-6 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
