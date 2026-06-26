import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Badge, Button, ShellCard } from '../components/UI';
import type { CommunityTopicDetail } from '../types';

export function CommunityTopicPage() {
  const { id = '' } = useParams();
  const [topic, setTopic] = useState<CommunityTopicDetail | null>(null);
  const [reply, setReply] = useState('');

  const refresh = () => void api.communityTopic(id).then(setTopic);

  useEffect(() => {
    refresh();
  }, [id]);

  if (!topic) return <div className="text-slate-600">Loading topic...</div>;

  return (
    <div className="space-y-6">
      <ShellCard>
        <Link to="/community" className="text-sm font-semibold text-slate-600 hover:text-slate-950">Back to community</Link>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge>{topic.CATEGORY}</Badge>
          {topic.TAGS.split(',').filter(Boolean).map((tag) => <Badge key={tag}>{tag.trim()}</Badge>)}
        </div>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950">{topic.TITLE}</h2>
        <p className="mt-3 text-slate-600">{topic.CONTENT}</p>
        <div className="mt-4 flex items-center gap-3">
          <Button variant="secondary" onClick={() => void api.likeCommunityTopic(topic.ID).then(refresh)}>Like topic ({topic.LIKE_COUNT})</Button>
          <div className="text-sm text-slate-500">{topic.AUTHOR_NAME} · {topic.AUTHOR_ROLE}</div>
        </div>
      </ShellCard>

      <ShellCard title="Replies" subtitle="Simple peer exchange flow.">
        <div className="space-y-4">
          {topic.posts.map((post) => (
            <div key={post.ID} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-950">{post.AUTHOR_NAME}</div>
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{post.AUTHOR_ROLE}</div>
                </div>
                <Button variant="ghost" onClick={() => void api.voteCommunityPost(post.ID).then(refresh)}>Vote ({post.VOTE_COUNT})</Button>
              </div>
              <p className="mt-3 text-slate-600">{post.CONTENT}</p>
            </div>
          ))}
          <textarea className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Add reply" value={reply} onChange={(event) => setReply(event.target.value)} />
          <Button onClick={async () => {
            await api.createCommunityPost(topic.ID, reply);
            setReply('');
            refresh();
          }}>Post reply</Button>
        </div>
      </ShellCard>
    </div>
  );
}
