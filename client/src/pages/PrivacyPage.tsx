import { ShellCard } from '../components/UI';

export function PrivacyPage() {
  return (
    <ShellCard title="Privacy" subtitle="Starter-friendly baseline only.">
      <div className="space-y-4 text-slate-600">
        <p>This repo stores demo data in a local JSON file. Do not treat that default persistence layer as production-grade storage for personal or regulated data.</p>
        <p>If you adapt this project for real users, define your own retention policy, lawful basis, access controls, backup process, and deletion workflow before launch.</p>
        <p>Replace seeded accounts and reset the local store before sharing the project externally.</p>
      </div>
    </ShellCard>
  );
}
