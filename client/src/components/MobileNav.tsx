import { BookMarked, Compass, LayoutDashboard, MessageSquare, Trophy } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/community', label: 'Discussion', icon: MessageSquare },
  { to: '/learning', label: 'Learning', icon: BookMarked },
  { to: '/ranking', label: 'Ranking', icon: Trophy },
  { to: '/connections-passport', label: 'Passport', icon: Compass },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#CFE6FA] bg-white/95 backdrop-blur lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[10px] font-medium transition ${
                isActive ? 'text-[#002060]' : 'text-[#637080]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                {tab.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
