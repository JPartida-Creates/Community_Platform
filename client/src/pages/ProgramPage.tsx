import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronRight, Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Badge, ShellCard } from '../components/UI';
import type { Topic } from '../types';

export function ProgramPage() {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    void api.topics().then(setTopics);
  }, []);

  return (
    <div className="space-y-6">
      <ShellCard title="Curriculum" subtitle="Generic topic structure teams can replace with their own content.">
        <div className="space-y-4">
          {topics.map((topic) => {
            const icon = topic.status === 'COMPLETED'
              ? <CheckCircle2 size={18} className="text-emerald-600" />
              : topic.status === 'LOCKED'
                ? <Lock size={18} className="text-slate-500" />
                : <Sparkles size={18} className="text-sky-600" />;

            return (
              <Link
                key={topic.ID}
                to={topic.status === 'LOCKED' ? '#' : `/program/day/${topic.ID}`}
                className={`flex items-center justify-between rounded-[1.75rem] border px-5 py-5 transition ${topic.status === 'LOCKED' ? 'cursor-not-allowed border-slate-200 bg-slate-100/80' : 'border-slate-200 bg-white hover:border-slate-950'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">{icon}</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-lg font-semibold text-slate-950">{topic.TITLE}</div>
                      <Badge>{topic.status}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">{topic.DESCRIPTION}</div>
                    <div className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">Week {topic.WEEK} · Day {topic.DAY_NUMBER} · {topic.estimatedMinutes} min</div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-500" />
              </Link>
            );
          })}
        </div>
      </ShellCard>
    </div>
  );
}
