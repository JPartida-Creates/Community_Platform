import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Badge, Button, ShellCard } from '../components/UI';
import { useToast } from '../components/Toast';
import type { Deliverable } from '../types';

export function DeliverablesPage() {
  const toast = useToast();
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
          <p className="text-[#445063]">{deliverable.DESCRIPTION}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {deliverable.RUBRIC.map((criterion) => <Badge key={criterion}>{criterion}</Badge>)}
            {deliverable.submission ? <Badge>{deliverable.submission.STATUS}</Badge> : <Badge>Not submitted</Badge>}
          </div>
          {deliverable.submission?.REVIEWER_NOTES ? (
            <div className="mt-4 rounded-2xl border border-[#CFE6FA] bg-[#EAF5FF] px-4 py-3 text-sm text-[#002060]">
              Reviewer note: {deliverable.submission.REVIEWER_NOTES}
            </div>
          ) : null}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input
              className="rounded-2xl border border-[#CFE6FA] px-4 py-3 outline-none focus:border-[#1B90FF]"
              placeholder="Public link or shared doc URL"
              value={drafts[deliverable.ID]?.link ?? ''}
              onChange={(event) => setDrafts((current) => ({
                ...current,
                [deliverable.ID]: { ...(current[deliverable.ID] ?? { link: '', notes: '' }), link: event.target.value },
              }))}
            />
            <input
              className="rounded-2xl border border-[#CFE6FA] px-4 py-3 outline-none focus:border-[#1B90FF]"
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
            toast('Submission saved.');
          }}>
            Save submission
          </Button>
        </ShellCard>
      ))}
    </div>
  );
}
