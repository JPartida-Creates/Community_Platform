import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Button, ShellCard } from '../components/UI';
import type { FeedbackItem, NotificationItem } from '../types';

export function SettingsPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [feedbackForm, setFeedbackForm] = useState({ title: '', details: '', area: 'GENERAL', type: 'FEATURE' });

  const refresh = async () => {
    const [feedbackData, notificationData] = await Promise.all([api.feedback(), api.notifications()]);
    setFeedback(feedbackData);
    setNotifications(notificationData);
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ShellCard title="Security" subtitle="Local session auth only.">
        <div className="space-y-4">
          <input type="password" className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Current password" value={password.currentPassword} onChange={(event) => setPassword((current) => ({ ...current, currentPassword: event.target.value }))} />
          <input type="password" className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="New password" value={password.newPassword} onChange={(event) => setPassword((current) => ({ ...current, newPassword: event.target.value }))} />
          <Button onClick={() => void api.changePassword(password)}>Change password</Button>
        </div>
      </ShellCard>

      <ShellCard title="Feedback" subtitle="Built-in intake for improvement requests.">
        <div className="space-y-4">
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Title" value={feedbackForm.title} onChange={(event) => setFeedbackForm((current) => ({ ...current, title: event.target.value }))} />
          <textarea className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="What should change?" value={feedbackForm.details} onChange={(event) => setFeedbackForm((current) => ({ ...current, details: event.target.value }))} />
          <Button onClick={async () => {
            await api.createFeedback(feedbackForm);
            setFeedbackForm({ title: '', details: '', area: 'GENERAL', type: 'FEATURE' });
            refresh();
          }}>Send feedback</Button>
          <div className="space-y-3">
            {feedback.map((item) => (
              <div key={item.ID} className="rounded-2xl border border-slate-200 p-4">
                <div className="font-semibold text-slate-950">{item.TITLE}</div>
                <div className="mt-2 text-sm text-slate-600">{item.DETAILS}</div>
                <div className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">{item.STATUS}</div>
              </div>
            ))}
          </div>
        </div>
      </ShellCard>

      <ShellCard title="Notifications" subtitle="Mark starter messages read.">
        <div className="space-y-3">
          {notifications.map((item) => (
            <div key={item.ID} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-slate-950">{item.TITLE}</div>
                {!item.IS_READ ? <Button variant="ghost" onClick={async () => {
                  await api.markNotificationRead(item.ID);
                  refresh();
                }}>Mark read</Button> : null}
              </div>
              <div className="mt-2 text-sm text-slate-600">{item.MESSAGE}</div>
            </div>
          ))}
          <Button variant="secondary" onClick={async () => {
            await api.markAllNotificationsRead();
            refresh();
          }}>Mark all read</Button>
        </div>
      </ShellCard>

      <ShellCard title="Starter notes" subtitle="House rules for reuse.">
        <ul className="space-y-3 text-sm text-slate-600">
          <li>Swap seeded data in `server/data/store.json` after first boot.</li>
          <li>Replace local session auth before production rollout if enterprise SSO needed.</li>
          <li>Keep attribution files if you want downstream users to preserve origin trail.</li>
        </ul>
      </ShellCard>
    </div>
  );
}
