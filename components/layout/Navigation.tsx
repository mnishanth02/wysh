/**
 * Navigation Component
 * Top navigation bar for the Wysh platform
 */

import { Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="border-b-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95"
          >
            <Wand2 className="h-4 w-4" />
            <span>Create Greeting</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
