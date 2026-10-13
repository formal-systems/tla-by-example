import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

// Opens this repo in GitHub Codespaces (see .devcontainer/devcontainer.json):
// full VS Code in the browser with the TLA+ extension, TLC, the lessons as
// .tla/.cfg files and the tlaplus/Examples specifications. Point it at a fork
// or branch with NEXT_PUBLIC_CODESPACES_REPO / NEXT_PUBLIC_CODESPACES_REF.
const codespacesRepo = process.env.NEXT_PUBLIC_CODESPACES_REPO || "tlaplus/tla-by-example";
const codespacesRef = process.env.NEXT_PUBLIC_CODESPACES_REF;
export const CODESPACES_URL =
  `https://codespaces.new/${codespacesRepo}` +
  (codespacesRef ? `/tree/${codespacesRef}` : "") +
  "?quickstart=1";

interface NavbarProps {
  breadcrumbs: BreadcrumbItem[];
  prev?: NavLink;
  next?: NavLink;
  showCodespaces?: boolean;
}

export default function Navbar({ breadcrumbs, prev, next, showCodespaces }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
        >
          TLA+ By Example
        </Link>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="contents">
            <span className="text-gray-300">/</span>
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-700">{crumb.label}</span>
            )}
          </span>
        ))}
      </div>
      {(prev || next || showCodespaces) && (
        <div className="flex items-center gap-2">
          {showCodespaces && (
            <a
              href={CODESPACES_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Full VS Code with the TLA+ extension and TLC in the browser, on GitHub Codespaces"
              className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Open in VS Code
            </a>
          )}
          {prev ? (
            <Link
              href={prev.href}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← {prev.label}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={next.href}
              className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 transition-colors"
            >
              {next.label} →
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
