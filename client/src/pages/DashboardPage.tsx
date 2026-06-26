import { useEffect, useState } from 'react';
import { ArrowRight, Bell, BookOpen, ClipboardCheck, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Badge, Button, Metric, ShellCard } from '../components/UI';
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
      <ShellCard className="overflow-hidden bg-slate-950 text-white">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.32em] text-emerald-300">Starter status</div>
            <h2 className="mt-4 text-4xl font-semibold">Reusable platform live. Local-first. Ready to customize.</h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Use this dashboard to steer curriculum, community, deliverables, and feedback without inherited product-specific infrastructure.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={nextTopic ? `/program/day/${nextTopic.ID}` : '/program'}>
                <Button variant="secondary">Open next topic</Button>
              </Link>
              <Link to="/deliverables">
                <Button variant="ghost">Review deliverables</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-white/8 p-5">
            <div className="text-sm text-slate-300">Current focus</div>
            <div className="mt-3 text-2xl font-semibold">{overview?.currentTopicTitle ?? 'No topic unlocked yet'}</div>
            <div className="mt-4 text-sm text-slate-300">Use seeded data as a reference, then swap in your own tracks, roles, and workflows.</div>
          </div>
        </div>
      </ShellCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Progress" value={`${overview?.myProgress ?? 0}%`} hint="Program completion" />
        <Metric label="Points" value={overview?.myPoints ?? 0} hint="Earned from learning and submissions" />
        <Metric label="Rank" value={overview?.myRank ?? '-'} hint="Across seeded users" />
        <Metric label="Pending" value={overview?.pendingDeliverables ?? 0} hint="Deliverables without fresh submission" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ShellCard title="Next actions" subtitle="Use these paths to test core learner flow.">
          <div className="space-y-3">
            <Link className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 hover:border-slate-950" to="/program">
              <div className="flex items-center gap-3">
                <BookOpen size={18} />
                <div>
                  <div className="font-semibold text-slate-950">Continue curriculum</div>
                  <div className="text-sm text-slate-600">{nextTopic?.TITLE ?? 'Browse all topics'}</div>
                </div>
              </div>
              <ArrowRight size={18} />
            </Link>
            <Link className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 hover:border-slate-950" to="/community">
              <div className="flex items-center gap-3">
                <Trophy size={18} />
                <div>
                  <div className="font-semibold text-slate-950">Join discussion</div>
                  <div className="text-sm text-slate-600">Share adaptation ideas with facilitators and learners.</div>
                </div>
              </div>
              <ArrowRight size={18} />
            </Link>
            <Link className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 hover:border-slate-950" to="/deliverables">
              <div className="flex items-center gap-3">
                <ClipboardCheck size={18} />
                <div>
                  <div className="font-semibold text-slate-950">Check submissions</div>
                  <div className="text-sm text-slate-600">Practice link-based deliverable review flow.</div>
                </div>
              </div>
              <ArrowRight size={18} />
            </Link>
          </div>
        </ShellCard>

        <ShellCard title="Latest notifications" subtitle="Seeded starter events.">
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.ID} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-slate-500" />
                    <div className="font-semibold text-slate-950">{notification.TITLE}</div>
                  </div>
                  {!notification.IS_READ ? <Badge>Unread</Badge> : null}
                </div>
                <div className="mt-2 text-sm text-slate-600">{notification.MESSAGE}</div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
