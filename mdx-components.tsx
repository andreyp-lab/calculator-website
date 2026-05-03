import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold text-gray-900 mb-2 mt-6">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-800 leading-relaxed mb-4">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-gray-800 mr-4">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-800 mr-4">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    a: ({ href, children }) => {
      const isExternal = href?.startsWith('http');
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href || '#'} className="text-blue-600 hover:underline">
          {children}
        </Link>
      );
    },
    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="border-r-4 border-blue-500 pr-4 my-4 text-gray-700 italic bg-blue-50 py-3">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border border-gray-200">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="bg-gray-50 border border-gray-200 px-4 py-2 text-right font-bold">
        {children}
      </th>
    ),
    td: ({ children }) => <td className="border border-gray-200 px-4 py-2">{children}</td>,
    hr: () => <hr className="my-8 border-gray-200" />,
    ...components,
  };
}
