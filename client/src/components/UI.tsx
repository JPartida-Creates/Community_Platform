import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function ShellCard({
  title,
  subtitle,
  children,
  className = '',
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur ${className}`}>
      {(title || subtitle) && (
        <header className="mb-5">
          {title ? <h2 className="text-xl font-semibold text-slate-950">{title}</h2> : null}
          {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
        </header>
      )}
      {children}
    </section>
  );
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
}) {
  const variantClass = {
    primary: 'bg-slate-950 text-white hover:bg-slate-800',
    secondary: 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200',
    ghost: 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200',
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-950">{value}</div>
      {hint ? <div className="mt-1 text-sm text-slate-600">{hint}</div> : null}
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}
