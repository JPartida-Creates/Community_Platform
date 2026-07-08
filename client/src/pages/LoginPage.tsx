import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button, ShellCard } from '../components/UI';

const seededAccounts = [
  { label: 'Admin', email: 'admin@example.com' },
  { label: 'Faculty', email: 'faculty@example.com' },
  { label: 'Learner', email: 'learner@example.com' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('learner@example.com');
  const [password, setPassword] = useState('Starter123!');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const session = await api.login({ email, password });
      setUser(session.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF5FF] px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/20 bg-[#002060] p-8 text-white shadow-[0_30px_80px_rgba(0,32,96,0.24)]">
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.35em] text-[#89D1FF]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Starter Kit</div>
            <h1 className="mt-4 text-4xl font-semibold leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>Launch your cohort-based learning program.</h1>
            <p className="mt-5 max-w-2xl text-base text-[#89D1FF]">
              A local-first starter stack ready for teams to customize and extend.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {seededAccounts.map((account) => (
                <div key={account.email} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-[#89D1FF]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{account.label}</div>
                  <div className="mt-2 text-sm font-medium">{account.email}</div>
                  <button
                    className="mt-4 text-sm font-semibold text-[#89D1FF] hover:text-white"
                    onClick={() => setEmail(account.email)}
                  >
                    Use account
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ShellCard title="Sign in" subtitle="Seeded password for all demo accounts: Starter123!" className="self-start">
          <form className="space-y-4" onSubmit={submit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#445063]">Email</span>
              <input className="w-full rounded-2xl border border-[#CFE6FA] px-4 py-3 outline-none focus:border-[#1B90FF]" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#445063]">Password</span>
              <input type="password" className="w-full rounded-2xl border border-[#CFE6FA] px-4 py-3 outline-none focus:border-[#1B90FF]" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            {error ? <div className="rounded-2xl border border-[#FFB3D1] bg-[#FFF0F5] px-4 py-3 text-sm text-[#DF1278]">{error}</div> : null}
            <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</Button>
          </form>

          <div className="mt-6 text-sm text-[#445063]">
            Need a fresh user? <Link className="font-semibold text-[#1B90FF]" to="/register">Create account</Link>
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
