import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronRight, Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Badge, ShellCard, Skeleton } from '../components/UI';
import type { Topic } from '../types';

export function ProgramPage() {
  const [topics, setTopics] = useState<Topic[] | null>(null);

  useEffect(() => {
    void api.topics().then(setTopics);
  }, []);

  return (
    <div className="space-y-6">
      <ShellCard title="Curriculum" subtitle="Generic topic structure teams can replace with their own content.">
        <div className="space-y-4">
          {topics === null ? (
            <>
              <Skeleton className="h-[88px]" />
              <Skeleton className="h-[88px]" />
              <Skeleton className="h-[88px]" />
            </>
          ) : topics.map((topic) => {
            const icon = topic.status === 'COMPLETED'
              ? <CheckCircle2 size={18} className="text-[#1B90FF]" />
              : topic.status === 'LOCKED'
                ? <Lock size={18} className="text-[#637080]" />
                : <Sparkles size={18} className="text-[#1B90FF]" />;

            return (
              <Link
                key={topic.ID}
                to={topic.status === 'LOCKED' ? '#' : `/program/day/${topic.ID}`}
                className={`flex items-center justify-between rounded-[1.75rem] border px-5 py-5 transition ${topic.status === 'LOCKED' ? 'cursor-not-allowed border-[#CFE6FA] bg-[#F5FAFF]' : 'border-[#CFE6FA] bg-white hover:border-[#1B90FF]'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">{icon}</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-lg font-semibold text-[#002060]">{topic.TITLE}</div>
                      <Badge>{topic.status}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-[#445063]">{topic.DESCRIPTION}</div>
                    <div className="mt-3 text-xs uppercase tracking-[0.24em] text-[#637080]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Week {topic.WEEK} · Day {topic.DAY_NUMBER} · {topic.estimatedMinutes} min</div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#637080]" />
              </Link>
            );
          })}
        </div>
      </ShellCard>
    </div>
  );
}
