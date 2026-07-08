import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function ShellCard({
  title,
  subtitle,
  children,
  className = '',
  style,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section className={`rounded-3xl border border-[#CFE6FA] bg-white p-6 shadow-[0_18px_60px_rgba(0,32,96,0.07)] ${className}`} style={style}>
      {(title || subtitle) && (
        <header className="mb-5">
          {title ? <h2 className="text-xl font-semibold text-[#002060]">{title}</h2> : null}
          {subtitle ? <p className="mt-2 text-sm text-[#445063]">{subtitle}</p> : null}
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
    primary: 'bg-[#DF1278] text-white hover:bg-[#c0105e]',
    secondary: 'bg-[#EAF5FF] text-[#002060] hover:bg-[#CFE6FA]',
    ghost: 'bg-white text-[#445063] hover:bg-[#F5FAFF] border border-[#CFE6FA]',
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
  to,
}: {
  label: string;
  value: string | number;
  hint?: string;
  to?: string;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.24em] text-[#637080]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{label}</div>
        {to && <ArrowRight size={14} className="text-[#CFE6FA] transition group-hover:text-[#1B90FF]" />}
      </div>
      <div className="mt-2 text-3xl font-semibold text-[#002060]">{value}</div>
      {hint ? <div className="mt-1 text-sm text-[#445063]">{hint}</div> : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className="group rounded-2xl border border-[#CFE6FA] bg-[#F5FAFF] p-4 transition hover:border-[#1B90FF] hover:shadow-[0_4px_16px_rgba(27,144,255,0.1)]">
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-[#CFE6FA] bg-[#F5FAFF] p-4">
      {content}
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#EAF5FF] px-3 py-1 text-xs font-semibold text-[#1B90FF]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      {children}
    </span>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}
