import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Button, ShellCard } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';

export function ProfilePage() {
  const { setUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    fullName: '',
    track: '',
    bio: '',
    interests: '',
  });

  useEffect(() => {
    void api.profile().then((profile) => setForm({
      fullName: profile.fullName ?? '',
      track: profile.track ?? '',
      bio: profile.bio ?? '',
      interests: Array.isArray(profile.interests) ? profile.interests.join(', ') : '',
    }));
  }, []);

  return (
    <ShellCard title="Profile" subtitle="Make seeded learner identity yours.">
      <div className="grid gap-4">
        {[
          ['fullName', 'Full name'],
          ['track', 'Track'],
        ].map(([key, label]) => (
          <label key={key} className="block">
            <div className="mb-2 text-sm font-medium text-[#445063]">{label}</div>
            <input className="w-full rounded-2xl border border-[#CFE6FA] px-4 py-3 outline-none focus:border-[#1B90FF]" value={form[key as keyof typeof form]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} />
          </label>
        ))}
        <label className="block">
          <div className="mb-2 text-sm font-medium text-[#445063]">Bio</div>
          <textarea className="min-h-32 w-full rounded-2xl border border-[#CFE6FA] px-4 py-3 outline-none focus:border-[#1B90FF]" value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} />
        </label>
        <label className="block">
          <div className="mb-2 text-sm font-medium text-[#445063]">Interests</div>
          <input className="w-full rounded-2xl border border-[#CFE6FA] px-4 py-3 outline-none focus:border-[#1B90FF]" value={form.interests} onChange={(event) => setForm((current) => ({ ...current, interests: event.target.value }))} />
        </label>
        <Button onClick={async () => {
          const user = await api.updateProfile({
            fullName: form.fullName,
            track: form.track,
            bio: form.bio,
            interests: form.interests.split(',').map((item) => item.trim()).filter(Boolean),
          });
          setUser(user);
          toast('Profile saved successfully.');
        }}>
          Save profile
        </Button>
      </div>
    </ShellCard>
  );
}
