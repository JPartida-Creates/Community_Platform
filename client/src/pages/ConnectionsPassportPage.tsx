import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CoffeePassportApp from '../components/CoffeePassport.jsx';
import { useAuth } from '../contexts/AuthContext';

export function ConnectionsPassportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="passport-swoop flex flex-col" style={{ height: '100dvh', backgroundColor: '#EAF5FF' }}>
      {/* Slim platform header */}
      <div className="flex items-center gap-3 px-4 py-2 shrink-0 border-b" style={{ backgroundColor: '#EAF5FF', borderColor: '#CFE6FA' }}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition hover:bg-[#CFE6FA]"
          style={{ color: '#002060' }}
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </div>

      {/* Passport fills remaining space */}
      <div className="flex-1 overflow-hidden">
        <CoffeePassportApp platformUser={user ?? undefined} />
      </div>
    </div>
  );
}
