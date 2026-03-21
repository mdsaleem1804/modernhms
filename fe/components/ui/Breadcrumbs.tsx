"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-gray-900 flex items-center">
        <Home className="w-4 h-4" />
      </Link>
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const title = path.charAt(0).toUpperCase() + path.slice(1);

        return (
          <div key={path} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4" />
            {isLast ? (
              <span className="text-gray-900 font-medium">{title}</span>
            ) : (
              <Link href={href} className="hover:text-gray-900">
                {title}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
