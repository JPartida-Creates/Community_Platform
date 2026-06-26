import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Badge, Button, ShellCard } from '../components/UI';
import type { Deliverable } from '../types';

export function DeliverablesPage() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { link: string; notes: string }>>({});

  const refresh = () => void api.deliverables().then((items) => {
    setDeliverables(items);
    setDrafts(Object.fromEntries(items.map((item) => [
      item.ID,
      {
        link: item.submission?.LINK ?? '',
        notes: item.submission?.NOTES ?? '',
      },
    ])));
  });

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="space-y-6">
      {deliverables.map((deliverable) => (
        <ShellCard key={deliverable.ID} title={deliverable.TITLE} subtitle={deliverable.TOPIC_TITLE}>
          <p className="text-slate-600">{deliverable.DESCRIPTION}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {deliverable.RUBRIC.map((criterion) => <Badge key={criterion}>{criterion}</Badge>)}
            {deliverable.submission ? <Badge>{deliverable.submission.STATUS}</Badge> : <Badge>Not submitted</Badge>}
          </div>
          {deliverable.submission?.REVIEWER_NOTES ? (
            <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Reviewer note: {deliverable.submission.REVIEWER_NOTES}
            </div>
          ) : null}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3"
              placeholder="Public link or shared doc URL"
              value={drafts[deliverable.ID]?.link ?? ''}
              onChange={(event) => setDrafts((current) => ({
                ...current,
                [deliverable.ID]: { ...(current[deliverable.ID] ?? { link: '', notes: '' }), link: event.target.value },
              }))}
            />
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3"
              placeholder="Submission notes"
              value={drafts[deliverable.ID]?.notes ?? ''}
              onChange={(event) => setDrafts((current) => ({
                ...current,
                [deliverable.ID]: { ...(current[deliverable.ID] ?? { link: '', notes: '' }), notes: event.target.value },
              }))}
            />
          </div>
          <Button className="mt-4" onClick={async () => {
            await api.submitDeliverable(deliverable.ID, drafts[deliverable.ID] ?? { link: '', notes: '' });
            refresh();
          }}>
            Save submission
          </Button>
        </ShellCard>
      ))}
    </div>
  );
}
