/**
 * Navigation Component
 * Top navigation bar for the Wysh platform
 */

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-xl"
        >
          <Sparkles className="h-6 w-6 text-purple-600" />
          <span>Wysh</span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/create/festival"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Create Greeting
          </Link>
        </div>
      </div>
    </nav>
  );
}
