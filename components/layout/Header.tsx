import Link from 'next/link';
import { navigation } from '@/lib/config/navigation';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">ש</span>
          </div>
          <span className="font-bold text-lg text-gray-900">FinCalc</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navigation.main.map((item) => {
            const isHighlight = (item as { highlight?: boolean }).highlight;
            if (isHighlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition text-sm"
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition text-sm"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button className="md:hidden p-2" aria-label="פתח תפריט">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
