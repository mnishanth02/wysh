/**
 * Global 404 Not Found Page
 * Displayed when users navigate to invalid routes
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Home, PlusCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-purple-100 p-4">
            <Sparkles className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/create/festival">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Greeting
            </Link>
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-8">
          ✨ Create beautiful festival greetings for your loved ones
        </p>
      </Card>
    </div>
  );
}
