import { ShellCard } from '../components/UI';

export function AboutPlatformPage() {
  return (
    <ShellCard title="About this starter" subtitle="Generic platform, local-first runtime, reusable cohort workflow.">
      <div className="space-y-4 text-slate-600">
        <p>Program Platform Starter packages self-paced topics, community discussion, deliverables, feedback intake, profile management, and admin summary into a clean reusable base.</p>
        <p>It is designed for internal academies, enablement programs, partner onboarding, certification prep, and similar cohort experiences that need structure without inheriting vendor-specific infrastructure.</p>
        <p>Default runtime uses a JSON store so teams can evaluate product fit before choosing a database, object storage, or enterprise identity provider.</p>
      </div>
    </ShellCard>
  );
}
