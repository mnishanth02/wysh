"use client";

/**
 * Success Page
 * Displays success message and sharing options after greeting creation
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ShareButton } from "@/components/shared/ShareButton";

export default function SuccessPage() {
  const router = useRouter();
  const [shareableId, setShareableId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedId = sessionStorage.getItem("greeting_shareableId");
    if (!storedId) {
      router.push("/create/festival");
      return;
    }
    setShareableId(storedId);
  }, [router]);

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
    // Clear session storage
    sessionStorage.removeItem("greeting_festival");
    sessionStorage.removeItem("greeting_relationship");
    sessionStorage.removeItem("greeting_recipientName");
    sessionStorage.removeItem("greeting_senderName");
    sessionStorage.removeItem("greeting_customMessage");
    sessionStorage.removeItem("greeting_shareableId");
    sessionStorage.removeItem("greeting_templateId");

    router.push("/create/festival");
  };

  if (!shareableId) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Success Message */}
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

          {/* Preview Card */}
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Your Greeting URL</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={greetingUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Sharing Options */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">
              Share Your Greeting
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <ShareButton shareableId={shareableId} />

              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="h-auto py-4"
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

          {/* Preview Link */}
          <Card className="p-6 bg-muted/50 space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">Want to see how it looks?</span>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/g/${shareableId}`} target="_blank">
                Preview Your Greeting
              </Link>
            </Button>
          </Card>

          {/* Create Another */}
          <div className="text-center space-y-4 pt-4">
            <Button
              onClick={handleCreateAnother}
              size="lg"
              className="w-full sm:w-auto"
            >
              Create Another Greeting
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
