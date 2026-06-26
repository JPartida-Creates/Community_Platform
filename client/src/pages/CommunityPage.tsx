import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Badge, Button, ShellCard } from '../components/UI';
import type { CommunityTopicListItem } from '../types';

export function CommunityPage() {
  const [topics, setTopics] = useState<CommunityTopicListItem[]>([]);
  const [form, setForm] = useState({ title: '', content: '', category: 'Discussion', tags: '' });

  const refresh = () => void api.communityTopics().then(setTopics);

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
      <ShellCard title="Start discussion" subtitle="Seeded social layer teams can adapt for peer learning or office hours.">
        <div className="space-y-4">
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Topic title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          <textarea className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="What should the cohort discuss?" value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} />
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Tags separated by commas" value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} />
          <Button
            onClick={async () => {
              await api.createCommunityTopic({
                title: form.title,
                content: form.content,
                category: form.category,
                tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
              });
              setForm({ title: '', content: '', category: 'Discussion', tags: '' });
              refresh();
            }}
          >
            Publish topic
          </Button>
        </div>
      </ShellCard>

      <div className="space-y-4">
        {topics.map((topic) => (
          <Link key={topic.ID} to={`/community/topic/${topic.ID}`} className="block rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] transition hover:border-slate-950">
            <div className="flex flex-wrap items-center gap-2">
              {topic.IS_PINNED ? <Badge>Pinned</Badge> : null}
              <Badge>{topic.CATEGORY}</Badge>
              {topic.TAGS.split(',').filter(Boolean).map((tag) => <Badge key={tag}>{tag.trim()}</Badge>)}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-950">{topic.TITLE}</h2>
            <p className="mt-3 text-slate-600">{topic.CONTENT}</p>
            <div className="mt-4 text-sm text-slate-500">{topic.AUTHOR_NAME} · {topic.LIKE_COUNT} likes · {topic.POST_COUNT} replies</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
