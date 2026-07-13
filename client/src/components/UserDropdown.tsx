import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export function UserDropdown() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const logout = async () => {
    await api.logout();
    setUser(null);
    navigate('/login');
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-[#CFE6FA] bg-white py-1.5 pl-1.5 pr-3 transition hover:border-[#1B90FF]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B90FF] text-sm font-bold text-white">
          {initials(user.fullName)}
        </div>
        <ChevronDown size={14} className={`text-[#637080] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-[#CFE6FA] bg-white shadow-[0_16px_48px_rgba(0,32,96,0.14)]">
          <div className="border-b border-[#CFE6FA] px-4 py-3">
            <div className="font-semibold text-[#002060]">{user.fullName}</div>
            <div className="mt-0.5 text-xs text-[#637080]">{user.email}</div>
          </div>
          <div className="p-2">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#445063] transition hover:bg-[#EAF5FF] hover:text-[#002060]"
            >
              <User size={16} className="text-[#637080]" />
              Profile
            </Link>
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#445063] transition hover:bg-[#EAF5FF] hover:text-[#002060]"
            >
              <Settings size={16} className="text-[#637080]" />
              Settings
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#445063] transition hover:bg-[#EAF5FF] hover:text-[#002060]"
            >
              <LogOut size={16} className="text-[#637080]" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
