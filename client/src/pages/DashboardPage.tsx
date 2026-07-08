import { useEffect, useState } from 'react';
import { ArrowRight, Bell, BookOpen, ClipboardCheck, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Badge, Button, Metric, ShellCard, Skeleton } from '../components/UI';
import type { DashboardOverview, NotificationItem, Topic } from '../types';

export function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    void Promise.all([
      api.myOverview().then(setOverview),
      api.topics().then(setTopics),
      api.notifications().then((items) => setNotifications(items.slice(0, 3))),
    ]);
  }, []);

  const nextTopic = topics.find((topic) => topic.status === 'AVAILABLE');

  return (
    <div className="space-y-6">
      <ShellCard className="overflow-hidden text-white" style={{ backgroundColor: '#002060', borderColor: '#002060' }}>
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.32em] text-[#89D1FF]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Starter status</div>
            <h2 className="mt-4 text-4xl font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>Reusable platform live. Local-first. Ready to customize.</h2>
            <p className="mt-4 max-w-2xl text-[#89D1FF]">
              Use this dashboard to steer curriculum, community, deliverables, and feedback without inherited product-specific infrastructure.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={nextTopic ? `/program/day/${nextTopic.ID}` : '/program'}>
                <Button variant="primary">Open next topic</Button>
              </Link>
              <Link to="/deliverables">
                <Button variant="ghost">Review deliverables</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-white/8 p-5">
            <div className="text-sm text-[#89D1FF]">Current focus</div>
            <div className="mt-3 text-2xl font-semibold">{overview?.currentTopicTitle ?? 'No topic unlocked yet'}</div>
            <div className="mt-4 text-sm text-[#89D1FF]">Use seeded data as a reference, then swap in your own tracks, roles, and workflows.</div>
          </div>
        </div>
      </ShellCard>

      <div className="grid gap-4 md:grid-cols-3">
        {overview ? (
          <>
            <Metric label="Progress" value={`${overview.myProgress}%`} hint="Program completion" to="/program" />
            <Metric label="Points" value={overview.myPoints} hint="Earned from learning and submissions" to="/admin" />
            <Metric label="Rank" value={overview.myRank ?? '-'} hint="Across all members" to="/admin" />
          </>
        ) : (
          <>
            <Skeleton className="h-[88px]" />
            <Skeleton className="h-[88px]" />
            <Skeleton className="h-[88px]" />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ShellCard title="Next actions" subtitle="Where would you like to go today?">
          <div className="space-y-3">
            {overview?.myProgress === 0 && (
              <div className="mb-2 flex items-center gap-3 rounded-2xl border border-[#FFD87A] bg-[#FFF8E8] px-4 py-3 text-sm text-[#002060]">
                <Sparkles size={16} className="shrink-0 text-[#FF9500]" />
                Welcome! Start with your first community session below.
              </div>
            )}
            <Link className="flex items-center justify-between rounded-2xl border border-[#CFE6FA] px-4 py-4 transition hover:border-[#1B90FF]" to="/program">
              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-[#1B90FF]" />
                <div>
                  <div className="font-semibold text-[#002060]">Continue curriculum</div>
                  <div className="text-sm text-[#445063]">{nextTopic?.TITLE ?? 'Browse all topics'}</div>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#637080]" />
            </Link>
            <Link className="flex items-center justify-between rounded-2xl border border-[#CFE6FA] px-4 py-4 transition hover:border-[#1B90FF]" to="/community">
              <div className="flex items-center gap-3">
                <Trophy size={18} className="text-[#1B90FF]" />
                <div>
                  <div className="font-semibold text-[#002060]">Join discussion</div>
                  <div className="text-sm text-[#445063]">Share adaptation ideas with facilitators and learners.</div>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#637080]" />
            </Link>
            <Link className="flex items-center justify-between rounded-2xl border border-[#CFE6FA] px-4 py-4 transition hover:border-[#1B90FF]" to="/learning">
              <div className="flex items-center gap-3">
                <ClipboardCheck size={18} className="text-[#1B90FF]" />
                <div>
                  <div className="font-semibold text-[#002060]">Explore learning</div>
                  <div className="text-sm text-[#445063]">Browse trainings and resources.</div>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#637080]" />
            </Link>
          </div>
        </ShellCard>

        <ShellCard title="Latest notifications" subtitle="Recent activity across the platform.">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Bell size={32} className="text-[#CFE6FA]" strokeWidth={1.5} />
                <p className="mt-3 text-sm font-medium text-[#002060]">You're all caught up</p>
                <p className="mt-1 text-xs text-[#637080]">No new notifications right now.</p>
              </div>
            ) : notifications.map((notification) => (
              <div key={notification.ID} className="rounded-2xl border border-[#CFE6FA] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-[#637080]" />
                    <div className="font-semibold text-[#002060]">{notification.TITLE}</div>
                  </div>
                  {!notification.IS_READ ? <Badge>Unread</Badge> : null}
                </div>
                <div className="mt-2 text-sm text-[#445063]">{notification.MESSAGE}</div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
