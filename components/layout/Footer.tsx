/**
 * Footer Component
 * Footer section for the Wysh platform
 */

import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col space-y-3">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span>Wysh</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Create and share personalized festival greetings with beautiful
              animations.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="font-semibold">Festivals</h3>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <Link
                href="/create/festival"
                className="hover:text-foreground transition-colors"
              >
                Diwali
              </Link>
              <Link
                href="/create/festival"
                className="hover:text-foreground transition-colors"
              >
                Holi
              </Link>
              <Link
                href="/create/festival"
                className="hover:text-foreground transition-colors"
              >
                Christmas
              </Link>
              <Link
                href="/create/festival"
                className="hover:text-foreground transition-colors"
              >
                New Year
              </Link>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <Link
                href="/#how-it-works"
                className="hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/create/festival"
                className="hover:text-foreground transition-colors"
              >
                Create Greeting
              </Link>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="font-semibold">Legal</h3>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <span className="text-muted-foreground/70">
                Privacy Policy (Coming Soon)
              </span>
              <span className="text-muted-foreground/70">
                Terms of Service (Coming Soon)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Wysh. All rights reserved. <br />
            Built with <span className="inline-block text-red-500">❤️</span> by
            Nishanth.
          </p>
        </div>
      </div>
    </footer>
  );
}
