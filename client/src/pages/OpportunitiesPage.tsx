import { useState } from 'react';
import { Briefcase, Globe, Sparkles, Users } from 'lucide-react';
import { Button, ShellCard } from '../components/UI';
import { useToast } from '../components/Toast';

const INTEREST_AREAS = [
  { icon: Briefcase, label: 'Internships & Jobs', description: 'Find roles at SAP and partner companies.' },
  { icon: Users, label: 'Mentorship', description: 'Connect with experienced professionals.' },
  { icon: Globe, label: 'Global Events', description: 'SAP Next Gen meetups and conferences.' },
  { icon: Sparkles, label: 'Innovation Challenges', description: 'Hackathons, case competitions, and more.' },
];

export function OpportunitiesPage() {
  const toast = useToast();
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (label: string) =>
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );

  const submit = () => {
    if (selected.length === 0) return;
    setSubmitted(true);
    toast('Thanks! We\'ll notify you when these open up.');
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="overflow-hidden rounded-3xl p-8 text-white"
        style={{ backgroundColor: '#002060', borderColor: '#002060' }}
      >
        <div className="text-xs uppercase tracking-[0.32em] text-[#89D1FF]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          Opportunities
        </div>
        <h1 className="mt-4 text-4xl font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
          What's next for you?
        </h1>
        <p className="mt-3 max-w-2xl text-[#89D1FF]">
          SAP Next Gen connects students and young professionals to internships, mentors, global events, and innovation challenges. Tell us where you want to grow.
        </p>
      </div>

      {/* Interest picker */}
      <ShellCard
        title="What are you interested in?"
        subtitle={submitted ? "Your interests have been saved. We'll reach out when these open up." : "Select everything that applies — we'll surface relevant opportunities first."}
      >
        {submitted ? (
          <div className="flex flex-col items-center py-10 text-center">
            <Sparkles size={36} className="text-[#1B90FF]" />
            <p className="mt-4 text-lg font-semibold text-[#002060]">You're on the list!</p>
            <p className="mt-2 text-sm text-[#445063]">
              We'll notify you as soon as these opportunities are available in the platform.
            </p>
            <button
              className="mt-5 text-sm font-semibold text-[#1B90FF] hover:text-[#002060]"
              onClick={() => { setSubmitted(false); setSelected([]); }}
            >
              Update my interests
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {INTEREST_AREAS.map(({ icon: Icon, label, description }) => {
                const active = selected.includes(label);
                return (
                  <button
                    key={label}
                    onClick={() => toggle(label)}
                    className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition ${
                      active
                        ? 'border-[#1B90FF] bg-[#EAF5FF]'
                        : 'border-[#CFE6FA] bg-white hover:border-[#1B90FF]'
                    }`}
                  >
                    <div className={`mt-0.5 rounded-xl p-2 ${active ? 'bg-[#1B90FF] text-white' : 'bg-[#F5FAFF] text-[#1B90FF]'}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-[#002060]">{label}</div>
                      <div className="mt-0.5 text-sm text-[#445063]">{description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Button onClick={submit} disabled={selected.length === 0}>
                Notify me ({selected.length} selected)
              </Button>
              {selected.length > 0 && (
                <button
                  className="text-sm text-[#637080] hover:text-[#445063]"
                  onClick={() => setSelected([])}
                >
                  Clear
                </button>
              )}
            </div>
          </>
        )}
      </ShellCard>
    </div>
  );
}
