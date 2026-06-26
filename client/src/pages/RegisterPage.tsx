import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../services/api';
import { Button, ShellCard } from '../components/UI';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    track: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await api.register(form);
      navigate('/login');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <ShellCard title="Create learner account" subtitle="Register a local account for this reusable starter.">
          <form className="space-y-4" onSubmit={submit}>
            {[
              ['fullName', 'Full name'],
              ['email', 'Email'],
              ['track', 'Track'],
              ['password', 'Password'],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
                <input
                  type={key === 'password' ? 'password' : 'text'}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-950"
                  value={form[key as keyof typeof form]}
                  onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                />
              </label>
            ))}
            {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
            <Button type="submit">Create account</Button>
          </form>
          <div className="mt-6 text-sm text-slate-600">
            Already set? <Link className="font-semibold text-slate-950" to="/login">Back to sign in</Link>
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
