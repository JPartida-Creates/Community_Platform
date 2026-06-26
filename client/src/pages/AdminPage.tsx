import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Metric, ShellCard } from '../components/UI';

export function AdminPage() {
  const [summary, setSummary] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);

  useEffect(() => {
    void Promise.all([
      api.adminSummary().then(setSummary),
      api.adminUsers().then(setUsers),
      api.ranking().then(setRanking),
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Users" value={summary?.users ?? 0} />
        <Metric label="Topics" value={summary?.topics ?? 0} />
        <Metric label="Submissions" value={summary?.submissions ?? 0} />
        <Metric label="Open feedback" value={summary?.feedbackOpen ?? 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ShellCard title="Users" subtitle="Seeded starter identities.">
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="font-semibold text-slate-950">{user.fullName}</div>
                <div className="text-sm text-slate-600">{user.email}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{user.role} · {user.track}</div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Leaderboard" subtitle="Simple points model for demo use.">
          <div className="space-y-3">
            {ranking.map((entry, index) => (
              <div key={entry.userId} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <div>
                  <div className="font-semibold text-slate-950">{index + 1}. {entry.fullName}</div>
                  <div className="text-sm text-slate-600">{entry.track}</div>
                </div>
                <div className="text-lg font-semibold text-slate-950">{entry.totalPoints}</div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
