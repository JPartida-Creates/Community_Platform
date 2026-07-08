import { BookMarked } from 'lucide-react';
import { ShellCard } from '../components/UI';

export function LearningPage() {
  return (
    <div className="space-y-6">
      <ShellCard>
        <div className="flex flex-col items-center py-16 text-center">
          <BookMarked size={40} className="text-[#CFE6FA]" strokeWidth={1.5} />
          <h2 className="mt-6 text-2xl font-semibold text-[#002060]" style={{ fontFamily: "'Fraunces', serif" }}>
            Learning resources coming soon.
          </h2>
          <p className="mt-3 max-w-md text-[#445063]">
            This is where internal trainings and curated resources will live. Check back soon.
          </p>
        </div>
      </ShellCard>
    </div>
  );
}
