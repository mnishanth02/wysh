"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AnimatedCounter } from "./AnimatedCounter";
import { StatsSkeleton } from "./StatsSkeleton";

/**
 * Statistics Section for Homepage
 * Displays platform stats with animated counters
 */
export function StatisticsSection() {
    const stats = useQuery(api.statistics.getHomepageStats);

    // Show skeleton while loading
    if (stats === undefined) {
        return <StatsSkeleton />;
    }

    // Hide section gracefully on error
    if (stats === null) {
        console.error("Failed to load homepage statistics");
        return null;
    }

    return (
        <section className="bg-muted/30 py-16 sm:py-20">
            <div className="container mx-auto px-4">
                <h2 className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl">
                    Join Thousands Creating Beautiful Greetings
                </h2>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatedCounter
                        end={ stats.totalGreetings }
                        label="Greetings Created"
                        suffix="+"
                    />
                    <AnimatedCounter
                        end={ stats.totalViews }
                        label="Total Views"
                        suffix="+"
                    />
                    <AnimatedCounter
                        end={ stats.festivalsSupported }
                        label="Festivals Supported"
                    />
                </div>
            </div>
        </section>
    );
}
