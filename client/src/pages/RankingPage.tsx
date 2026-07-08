import { useEffect, useState } from 'react';
import { Crown, Medal, Trophy } from 'lucide-react';
import { api } from '../services/api';
import { ShellCard, Skeleton } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';

type RankEntry = {
  rank: number;
  userId: string;
  fullName: string;
  track: string;
  totalPoints: number;
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={18} className="text-[#F5A623]" />;
  if (rank === 2) return <Medal size={18} className="text-[#A0AEC0]" />;
  if (rank === 3) return <Medal size={18} className="text-[#C07B3A]" />;
  return (
    <span className="w-5 text-center text-sm font-semibold text-[#637080]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      {rank}
    </span>
  );
}

export function RankingPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<RankEntry[] | null>(null);
  const [myPoints, setMyPoints] = useState<number | null>(null);
  const [myRank, setMyRank] = useState<number | null>(null);

  useEffect(() => {
    void Promise.all([
      api.ranking().then(setLeaderboard),
      api.myOverview().then((o) => {
        setMyPoints(o.myPoints);
        setMyRank(o.myRank);
      }),
    ]);
  }, []);

  const myEntry = leaderboard?.find((e) => e.userId === user?.userId);

  return (
    <div className="space-y-6">
      {/* Hero — your standing */}
      <div className="overflow-hidden rounded-3xl p-8 text-white" style={{ backgroundColor: '#002060' }}>
        <div className="text-xs uppercase tracking-[0.32em] text-[#89D1FF]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          Ranking
        </div>
        <h1 className="mt-4 text-4xl font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
          Your standing.
        </h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/10 p-5">
            <div className="text-sm text-[#89D1FF]">Your points</div>
            <div className="mt-2 text-4xl font-semibold">
              {myPoints === null ? '—' : myPoints.toLocaleString()}
            </div>
            <div className="mt-1 text-sm text-[#89D1FF]">Earned from sessions and activity</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-5">
            <div className="text-sm text-[#89D1FF]">Your rank</div>
            <div className="mt-2 text-4xl font-semibold">
              {myRank === null ? '—' : `#${myRank}`}
            </div>
            <div className="mt-1 text-sm text-[#89D1FF]">
              {leaderboard ? `out of ${leaderboard.length} members` : 'across all members'}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <ShellCard title="Leaderboard" subtitle="All members ranked by total points.">
        {leaderboard === null ? (
          <div className="space-y-3">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : (
          <div className="divide-y divide-[#CFE6FA]">
            {leaderboard.map((entry) => {
              const isMe = entry.userId === user?.userId;
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-4 py-4 first:pt-0 last:pb-0 ${isMe ? 'rounded-2xl bg-[#EAF5FF] px-4 -mx-4' : ''}`}
                >
                  {/* Rank */}
                  <div className="flex w-6 shrink-0 items-center justify-center">
                    <RankBadge rank={entry.rank} />
                  </div>

                  {/* Avatar */}
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${isMe ? 'bg-[#1B90FF] text-white' : 'bg-[#F5FAFF] text-[#002060]'}`}>
                    {entry.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>

                  {/* Name + track */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#002060] truncate">{entry.fullName}</span>
                      {isMe && (
                        <span className="shrink-0 rounded-full bg-[#1B90FF] px-2 py-0.5 text-[10px] font-semibold text-white" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                          You
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-[#637080]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      {entry.track}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="shrink-0 text-right">
                    <div className="text-lg font-semibold text-[#002060]">{entry.totalPoints.toLocaleString()}</div>
                    <div className="text-xs text-[#637080]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ShellCard>

      {/* Points guide */}
      <PointsGuide />
    </div>
  );
}

function PointsGuide() {
  const [guide, setGuide] = useState<Array<{ label: string; points: number }> | null>(null);

  useEffect(() => {
    void api.pointsGuide().then(setGuide).catch(() => setGuide([]));
  }, []);

  if (guide !== null && guide.length === 0) return null;

  return (
    <ShellCard title="How points are earned" subtitle="Complete activities to climb the leaderboard.">
      {guide === null ? (
        <div className="space-y-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : (
        <div className="divide-y divide-[#CFE6FA]">
          {guide.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 text-sm first:pt-0 last:pb-0">
              <span className="text-[#445063]">{item.label}</span>
              <span className="font-semibold text-[#1B90FF]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                +{item.points} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </ShellCard>
  );
}
