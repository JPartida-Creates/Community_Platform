import { Bell, BookMarked, BookOpen, Compass, LayoutDashboard, MessageSquare, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { MobileNav } from './MobileNav';
import { UserDropdown } from './UserDropdown';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/community', label: 'Discussion', icon: MessageSquare },
  { to: '/program', label: 'Community Sessions', icon: BookOpen },
  { to: '/learning', label: 'Learning', icon: BookMarked },
  { to: '/opportunities', label: 'Opportunities', icon: Sparkles },
  { to: '/connections-passport', label: 'Connections Passport', icon: Compass },
  { to: '/ranking', label: 'Ranking', icon: Trophy },
];

const PAGE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/program': 'Community Sessions',
  '/community': 'Discussion',
  '/opportunities': 'Opportunities',
  '/learning': 'Learning',
  '/ranking': 'Ranking',
  '/connections-passport': 'Connections Passport',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/admin': 'Admin',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function MainLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  // Resolve current page label — match longest prefix
  const pageLabel = Object.entries(PAGE_LABELS)
    .filter(([path]) => location.pathname === path || location.pathname.startsWith(path + '/'))
    .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? 'Community Platform';

  useEffect(() => {
    api.unreadNotifications()
      .then((payload) => setUnreadCount(payload.unreadCount))
      .catch(() => setUnreadCount(0));
  }, []);

  // Remove outside-click handler — now lives in UserDropdown

  const firstName = user?.fullName?.split(' ')[0] ?? '';

  return (
    <div className="min-h-screen bg-[#EAF5FF] pb-20 text-[#002060] lg:pb-0">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 rounded-[2rem] border border-[#CFE6FA] bg-[#F5FAFF]/95 p-5 shadow-[0_20px_60px_rgba(0,32,96,0.08)] backdrop-blur lg:flex lg:flex-col">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-[#1B90FF]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>SAP Next Gen</div>
            <div className="mt-3 text-2xl font-semibold text-[#002060]" style={{ fontFamily: "'Fraunces', serif" }}>Community Platform</div>
            <p className="mt-3 text-sm text-[#445063]">A community space for SAP Next Gen members to connect, learn, and grow together.</p>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-[#002060] text-white' : 'text-[#445063] hover:bg-[#EAF5FF]'}`}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
            {user?.role === 'ADMIN' ? (
              <NavLink
                to="/admin"
                className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-[#1B90FF] text-white' : 'text-[#445063] hover:bg-[#EAF5FF]'}`}
              >
                <ShieldCheck size={18} />
                Admin
              </NavLink>
            ) : null}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="rounded-[2rem] border border-[#CFE6FA] bg-white/95 px-5 py-4 shadow-[0_18px_60px_rgba(0,32,96,0.07)] backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-[#637080]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{pageLabel}</div>
                <h1 className="mt-1 text-xl font-semibold text-[#002060]">{getGreeting()}, {firstName}.</h1>
              </div>

              <div className="flex items-center gap-3">
                {/* Bell */}
                <Link to="/settings" className="relative rounded-full p-2 text-[#445063] transition hover:bg-[#EAF5FF]">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DF1278] text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <UserDropdown />
              </div>
            </div>
          </header>

          <main className="mt-6 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
