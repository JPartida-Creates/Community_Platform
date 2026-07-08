import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Flame, MessageCircle, Search, Trophy, Users, X, Zap } from 'lucide-react';
import { api } from '../services/api';
import { Badge, Button } from '../components/UI';
import { useToast } from '../components/Toast';
import type { CommunityTopicListItem } from '../types';

const CATEGORIES = ['All Categories', 'Discussion', 'Q&A', 'Announcements', 'Resources'];

export function CommunityPage() {
  const [topics, setTopics] = useState<CommunityTopicListItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'Discussion', tags: '' });

  const refresh = async () => {
    const [topicsData, statsData] = await Promise.all([
      api.communityTopics(),
      api.communityStats(),
    ]);
    setTopics(topicsData);
    setStats(statsData);
  };

  useEffect(() => { void refresh(); }, []);

  const filtered = topics.filter((t) => {
    const matchesSearch = search === '' ||
      t.TITLE.toLowerCase().includes(search.toLowerCase()) ||
      t.TAGS.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All Categories' || t.CATEGORY === category;
    return matchesSearch && matchesCategory;
  });

  const submitTopic = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    await api.createCommunityTopic({
      title: form.title,
      content: form.content,
      category: form.category,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setForm({ title: '', content: '', category: 'Discussion', tags: '' });
    setShowModal(false);
    void refresh();
    toast('Discussion published!');
  };

  return (
    <div className="space-y-6">

      {/* ── Hero header ── */}
      <div className="rounded-3xl border border-[#CFE6FA] bg-white p-6 shadow-[0_18px_60px_rgba(0,32,96,0.07)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#1B90FF]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              <MessageCircle size={14} /> Community Hub
            </div>
            <h1 className="mt-2 text-4xl font-bold text-[#002060]" style={{ fontFamily: "'Fraunces', serif" }}>
              Learn faster together.
            </h1>
            <p className="mt-2 max-w-xl text-[#445063]">
              Ask questions, share insights, and build on each other's knowledge across the SAP Next Gen community.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-1 inline-flex shrink-0 items-center gap-2 rounded-full bg-[#1B90FF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0070d2]"
          >
            <span className="text-lg leading-none">+</span> Start a Discussion
          </button>
        </div>

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[
            { icon: <Users size={16} className="text-[#637080]" />, label: 'Members', value: stats?.members ?? 0 },
            { icon: <Flame size={16} className="text-[#637080]" />, label: 'Active This Week', value: stats?.activeThisWeek ?? 0 },
            { icon: <Trophy size={16} className="text-[#637080]" />, label: 'Contributions', value: stats?.contributions ?? 0 },
            { icon: <Crown size={16} className="text-[#637080]" />, label: 'Top Contributor', value: stats?.topContributor ?? '—' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#CFE6FA] bg-[#F5FAFF] p-4">
              <div className="flex items-center gap-2 text-xs text-[#637080]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {stat.icon} {stat.label}
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#002060]">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Middle row: Trending / New Today / Leaderboard / Your Activity ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
        {/* Trending + Leaderboard stacked left 2/3 */}
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Trending */}
            <div className="rounded-2xl border border-[#CFE6FA] bg-white p-5">
              <div className="flex items-center gap-2 font-semibold text-[#002060]">
                <Flame size={16} className="text-[#1B90FF]" /> Trending This Week
              </div>
              {stats?.trending?.length ? (
                <ul className="mt-3 space-y-2">
                  {stats.trending.map((t: any) => (
                    <li key={t.ID}>
                      <Link to={`/community/topic/${t.ID}`} className="text-sm text-[#1B90FF] hover:underline">{t.TITLE}</Link>
                      <span className="ml-2 text-xs text-[#637080]">{t.POST_COUNT} replies</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-[#637080]">No trending topics yet.</p>
              )}
            </div>

            {/* New Today */}
            <div className="rounded-2xl border border-[#CFE6FA] bg-white p-5">
              <div className="flex items-center gap-2 font-semibold text-[#002060]">
                <Zap size={16} className="text-[#1B90FF]" /> New Today
              </div>
              {stats?.newToday?.length ? (
                <ul className="mt-3 space-y-2">
                  {stats.newToday.map((t: any) => (
                    <li key={t.ID}>
                      <Link to={`/community/topic/${t.ID}`} className="text-sm text-[#1B90FF] hover:underline">{t.TITLE}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-[#637080]">No new topics today.</p>
              )}
            </div>
          </div>

          {/* Leaderboard snapshot */}
          <div className="rounded-2xl border border-[#CFE6FA] bg-white p-5">
            <div className="flex items-center gap-2 font-semibold text-[#002060]">
              <Trophy size={16} className="text-[#1B90FF]" /> Leaderboard Snapshot
            </div>
            {stats?.leaderboard?.length ? (
              <ul className="mt-3 divide-y divide-[#CFE6FA]">
                {stats.leaderboard.map((entry: any) => (
                  <li key={entry.rank} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-[#445063]"><span className="font-semibold text-[#002060]">{entry.rank}.</span> {entry.fullName}</span>
                    <span className="text-xs text-[#1B90FF]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{entry.totalPoints} pts</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[#637080]">No contributors yet.</p>
            )}
          </div>
        </div>

        {/* Your Activity */}
        <div className="rounded-2xl border border-[#CFE6FA] bg-white p-5">
          <div className="font-semibold text-[#002060]">Your Activity</div>
          {(() => {
            const rows = [
              { label: 'Topics started', value: stats?.myActivity?.topicsStarted ?? 0 },
              { label: 'Replies on your topics', value: stats?.myActivity?.repliesOnTopics ?? 0 },
            ].filter((row) => row.value > 0);
            return rows.length > 0 ? (
              <>
                <ul className="mt-4 space-y-3">
                  {rows.map((row) => (
                    <li key={row.label} className="flex items-center justify-between border-b border-[#CFE6FA] pb-3 text-sm last:border-0 last:pb-0">
                      <span className="text-[#445063]">{row.label}</span>
                      <span className="font-semibold text-[#002060]">{row.value}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-[#637080]">Keep the momentum — your insights help others move faster.</p>
              </>
            ) : (
              <div className="mt-6 flex flex-col items-center text-center">
                <MessageCircle size={32} className="text-[#CFE6FA]" strokeWidth={1.5} />
                <p className="mt-3 text-sm font-medium text-[#002060]">Nothing here yet</p>
                <p className="mt-1 text-xs text-[#637080]">Start a discussion or reply to a topic to build your activity.</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#EAF5FF] px-4 py-2 text-xs font-semibold text-[#1B90FF] transition hover:bg-[#CFE6FA]"
                >
                  <span className="text-base leading-none">+</span> Start a Discussion
                </button>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Search + Category filter ── */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#637080]" />
          <input
            className="w-full rounded-full border border-[#CFE6FA] bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#1B90FF]"
            placeholder="Search topics, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="appearance-none rounded-full border border-[#CFE6FA] bg-white py-3 pl-4 pr-10 text-sm text-[#445063] outline-none focus:border-[#1B90FF]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <Search size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#637080]" />
        </div>
      </div>

      {/* ── Topic list ── */}
      <div className="rounded-3xl border border-[#CFE6FA] bg-white shadow-[0_18px_60px_rgba(0,32,96,0.07)]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MessageCircle size={44} className="text-[#CFE6FA]" strokeWidth={1.5} />
            <div className="mt-4 font-semibold text-[#002060]">No topics yet</div>
            <div className="mt-1 text-sm text-[#637080]">Be the first to start a discussion!</div>
          </div>
        ) : (
          <ul className="divide-y divide-[#CFE6FA]">
            {filtered.map((topic, i) => (
              <li key={topic.ID}>
                <Link
                  to={`/community/topic/${topic.ID}`}
                  className={`block px-6 py-5 transition hover:bg-[#F5FAFF] ${i === 0 ? 'rounded-t-3xl' : ''} ${i === filtered.length - 1 ? 'rounded-b-3xl' : ''}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {topic.IS_PINNED ? <Badge>Pinned</Badge> : null}
                    <Badge>{topic.CATEGORY}</Badge>
                    {topic.TAGS.split(',').filter(Boolean).map((tag) => <Badge key={tag}>{tag.trim()}</Badge>)}
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-[#002060]">{topic.TITLE}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-[#445063]">{topic.CONTENT}</p>
                  <div className="mt-3 text-xs text-[#637080]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {topic.AUTHOR_NAME} · {topic.LIKE_COUNT} likes · {topic.POST_COUNT} replies
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Start a Discussion modal ── */}
      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-[#CFE6FA] bg-white p-6 shadow-[0_30px_80px_rgba(0,32,96,0.18)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#002060]">Start a Discussion</h2>
              <button onClick={() => setShowModal(false)} className="rounded-full p-1 text-[#637080] hover:bg-[#EAF5FF]">
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <input
                className="w-full rounded-2xl border border-[#CFE6FA] px-4 py-3 text-sm outline-none focus:border-[#1B90FF]"
                placeholder="Topic title"
                value={form.title}
                onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))}
              />
              <select
                className="w-full rounded-2xl border border-[#CFE6FA] px-4 py-3 text-sm text-[#445063] outline-none focus:border-[#1B90FF]"
                value={form.category}
                onChange={(e) => setForm((c) => ({ ...c, category: e.target.value }))}
              >
                {CATEGORIES.filter((c) => c !== 'All Categories').map((c) => <option key={c}>{c}</option>)}
              </select>
              <textarea
                className="min-h-32 w-full rounded-2xl border border-[#CFE6FA] px-4 py-3 text-sm outline-none focus:border-[#1B90FF]"
                placeholder="What would you like to discuss?"
                value={form.content}
                onChange={(e) => setForm((c) => ({ ...c, content: e.target.value }))}
              />
              <input
                className="w-full rounded-2xl border border-[#CFE6FA] px-4 py-3 text-sm outline-none focus:border-[#1B90FF]"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => setForm((c) => ({ ...c, tags: e.target.value }))}
              />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={submitTopic}>Publish</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
