import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Button, ShellCard } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';

const INTEREST_CATEGORIES = [
  {
    label: 'Tech & Innovation',
    items: ['AI & ML', 'Cloud Architecture', 'Data Analytics', 'Cybersecurity', 'Product Design', 'UX Research', 'Startups', 'Blockchain'],
  },
  {
    label: 'Business & Career',
    items: ['Sales Strategy', 'Career Mentoring', 'Public Speaking', 'Leadership', 'Entrepreneurship', 'Finance & Markets', 'Consulting', 'Project Management'],
  },
  {
    label: 'Creativity & Culture',
    items: ['Music', 'Photography', 'Writing', 'Film & TV', 'Gaming', 'Design', 'Art', 'Podcasting'],
  },
  {
    label: 'Lifestyle & Wellbeing',
    items: ['Travel', 'Running', 'Fitness', 'Cooking', 'Mindfulness', 'Sustainability', 'Yoga', 'Hiking'],
  },
  {
    label: 'Learning & Community',
    items: ['Languages', 'Volunteering', 'DEI & Inclusion', 'Mentoring Students', 'Book Clubs', 'Social Impact', 'Networking', 'Teaching'],
  },
];

export function ProfilePage() {
  const { setUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    fullName: '',
    track: '',
    bio: '',
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    void api.profile().then((profile) => {
      setForm({
        fullName: profile.fullName ?? '',
        track: profile.track ?? '',
        bio: profile.bio ?? '',
      });
      setSelectedInterests(Array.isArray(profile.interests) ? profile.interests : []);
    });
  }, []);

  function toggleInterest(item: string) {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }

  return (
    <div className="space-y-6">
      <ShellCard title="Profile" subtitle="Update your name, track, and bio.">
        <div className="grid gap-4">
          {([['fullName', 'Full name'], ['track', 'Track']] as const).map(([key, label]) => (
            <label key={key} className="block">
              <div className="mb-2 text-sm font-medium text-[#445063]">{label}</div>
              <input
                className="w-full rounded-2xl border border-[#CFE6FA] px-4 py-3 outline-none focus:border-[#1B90FF]"
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            </label>
          ))}
          <label className="block">
            <div className="mb-2 text-sm font-medium text-[#445063]">Bio</div>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-[#CFE6FA] px-4 py-3 outline-none focus:border-[#1B90FF]"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
          </label>
        </div>
      </ShellCard>

      <ShellCard title="Interests" subtitle="Pick up to 10 topics. These power your Connections Passport matches.">
        <div className="space-y-5">
          {INTEREST_CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#637080]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {cat.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => {
                  const selected = selectedInterests.includes(item);
                  const atMax = selectedInterests.length >= 10 && !selected;
                  return (
                    <button
                      key={item}
                      type="button"
                      disabled={atMax}
                      onClick={() => toggleInterest(item)}
                      className="rounded-full px-3 py-1.5 text-sm font-medium transition-all disabled:opacity-40"
                      style={{
                        backgroundColor: selected ? '#002060' : '#F5FAFF',
                        color: selected ? '#fff' : '#445063',
                        border: `1px solid ${selected ? '#002060' : '#CFE6FA'}`,
                      }}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <p className="text-xs text-[#637080]">
            {selectedInterests.length}/10 selected
          </p>
        </div>
      </ShellCard>

      <Button onClick={async () => {
        const user = await api.updateProfile({
          fullName: form.fullName,
          track: form.track,
          bio: form.bio,
          interests: selectedInterests,
        });
        setUser(user);
        toast('Profile saved successfully.');
      }}>
        Save profile
      </Button>
    </div>
  );
}
