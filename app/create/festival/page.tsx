"use client";

/**
 * Festival Selection Page
 * First step in greeting creation flow
 */

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { FestivalSelector } from "@/components/forms/FestivalSelector";

export default function FestivalPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navigation />

            <main className="flex-1 container mx-auto px-4 mobile-p-4 py-6 sm:py-8 md:py-12">
                <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                    <div className="text-center space-y-3 sm:space-y-4">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                            Choose Your Festival
                        </h1>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                            Select the festival you want to create a greeting for
                        </p>
                    </div>

                    <FestivalSelector />
                </div>
            </main>

            <Footer />
        </div>
    );
}
