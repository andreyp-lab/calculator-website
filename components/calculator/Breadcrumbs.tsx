import Link from 'next/link';

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-[0.1em]">
      <ol className="flex items-center gap-1 flex-wrap">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {idx > 0 && (
              <span className="text-gold mx-2" aria-hidden="true">
                ✦
              </span>
            )}
            {item.href ? (
              <Link href={item.href} className="text-ink/60 hover:text-gold transition">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink/80">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
