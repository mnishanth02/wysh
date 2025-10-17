"use client";

import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { SampleGreeting } from "@/components/shared/SampleGreeting";
import { SAMPLE_GREETINGS } from "@/lib/constants";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [samplesVisible, setSamplesVisible] = useState(false);
  const samplesSectionRef = useRef<HTMLElement>(null);

  // Lazy load samples when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSamplesVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (samplesSectionRef.current) {
      observer.observe(samplesSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-medium text-purple-900">
              <Sparkles className="h-4 w-4" />
              <span>Create Personalized Festival Greetings</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
              Share Joy with
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Animated Greetings
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Create beautiful, culturally authentic festival greetings
              personalized for your loved ones. Share instantly via WhatsApp
              with stunning animations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="touch-target-lg text-base h-12 sm:h-14 px-8 w-full sm:w-auto"
              >
                <Link href="/create/festival">
                  Create Your Festival Greeting
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="touch-target-lg text-base h-12 sm:h-14 px-8 w-full sm:w-auto"
              >
                <Link href="#how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Sample Greetings Showcase */}
        <section
          ref={samplesSectionRef}
          className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background to-muted/30"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-12 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold">
                See It In Action
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the magic of personalized festival greetings
              </p>
            </div>

            {/* Horizontal scroll container for mobile */}
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
                {SAMPLE_GREETINGS.map((sample) => (
                  <div
                    key={sample.id}
                    className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-auto snap-center"
                  >
                    <SampleGreeting
                      festivalType={sample.festivalType}
                      relationshipType={sample.relationshipType}
                      recipientName={sample.recipientName}
                      senderName={sample.senderName}
                      label={sample.label}
                      description={sample.description}
                      isVisible={samplesVisible}
                    />
                  </div>
                ))}
              </div>

              {/* Scroll hint for mobile */}
              <div className="md:hidden mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  ← Swipe to see more examples →
                </p>
              </div>
            </div>

            {/* CTA after samples */}
            <div className="mt-10 sm:mt-12 text-center">
              <Button
                asChild
                size="lg"
                className="touch-target-lg text-base h-12 sm:h-14 px-8"
              >
                <Link href="/create/festival">Create Your Own Greeting</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="bg-muted/50 py-12 sm:py-16 md:py-24"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              Three Simple Steps
            </h2>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-lg shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold">Choose Festival</h3>
                <p className="text-muted-foreground">
                  Select from Diwali, Holi, Christmas, New Year, Pongal, or
                  Generic celebrations
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-lg shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold">Personalize</h3>
                <p className="text-muted-foreground">
                  Add names, select relationship, and customize your message
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-lg shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold">Share</h3>
                <p className="text-muted-foreground">
                  Share your animated greeting instantly via WhatsApp
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                Ready to Spread Joy?
              </h2>
              <p className="text-lg text-muted-foreground">
                Create your first festival greeting in under 60 seconds
              </p>
              <Button
                asChild
                size="lg"
                className="touch-target-lg text-base h-12 sm:h-14 px-8 w-full sm:w-auto"
              >
                <Link href="/create/festival">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
