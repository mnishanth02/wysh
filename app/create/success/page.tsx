"use client";

/**
 * Success Page
 * Displays success message and sharing options after greeting creation
 *
 * Note: Wrapped in Suspense boundary for nuqs (uses useSearchParams internally)
 */

import { Check, Copy, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryStates } from "nuqs";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { LoadingState } from "@/components/shared/LoadingState";
import { ShareButton } from "@/components/shared/ShareButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { greetingParsers } from "@/lib/url-state-parsers";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shareableId = searchParams.get("shareableId") || "";
  const [copied, setCopied] = useState(false);

  // Read festival and sender name from URL state
  const [{ festival: festivalType, senderName }] = useQueryStates({
    festival: greetingParsers.festival,
    senderName: greetingParsers.senderName,
  });

  useEffect(() => {
    // Redirect to festival selection if shareableId is missing
    if (!shareableId) {
      router.push("/create/festival");
    }
  }, [shareableId, router]);

  const greetingUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/g/${shareableId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(greetingUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleCreateAnother = () => {
    // Navigate to festival selection - URL state will be cleared automatically
    // by starting a new flow
    router.push("/create/festival");
  };

  if (!shareableId) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Success Message */ }
      <div className="text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Check className="h-8 w-8" />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Your Greeting Is Ready! 🎉
        </h1>

        <p className="text-lg text-muted-foreground">
          Share your beautiful greeting with your loved ones
        </p>
      </div>

      {/* Preview Card */ }
      <Card className="p-4 sm:p-6 space-y-4 bg-gradient-to-br from-purple-50/5 to-pink-50/5 border-2">
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold">Your Greeting URL</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={ greetingUrl }
              readOnly
              className="flex-1 px-3 sm:px-4 py-3 text-xs sm:text-sm border-2 rounded-lg bg-background font-mono touch-target"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={ handleCopyLink }
              className="shrink-0 h-12 w-12 border-2"
            >
              { copied ? (
                <Check className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              ) }
            </Button>
          </div>
        </div>
      </Card>

      {/* Sharing Options */ }
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">
          Share Your Greeting
        </h2>

        <div className="grid sm:grid-cols-2">
          <ShareButton
            shareableId={ shareableId }
            festivalType={ festivalType || undefined }
            senderName={ senderName }
          />

          <Button
            variant="outline"
            onClick={ handleCopyLink }
            className="h-auto sm:w-full py-4"
          >
            <Copy className="h-5 w-5 mr-2" />
            <div className="text-left">
              <div className="font-semibold">Copy Link</div>
              <div className="text-xs text-muted-foreground">
                Share anywhere
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Preview Link */ }
      <Card className="p-6 bg-muted/50 space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sparkles className="h-5 w-5" />
          <span className="font-medium">Want to see how it looks?</span>
        </div>
        <Button asChild variant="outline" className="w-full h-11">
          <Link href={ `/g/${shareableId}` } target="_blank">
            Preview Your Greeting
          </Link>
        </Button>
      </Card>

      {/* Create Another */ }
      <div className="text-center space-y-4 pt-4">
        <Button
          onClick={ handleCreateAnother }
          size="lg"
          className="w-full h-12 sm:w-auto"
        >
          Create Another Greeting
        </Button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <Suspense fallback={ <LoadingState message="Loading..." /> }>
          <SuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
