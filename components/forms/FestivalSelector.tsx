"use client";

/**
 * Festival Selector Component
 * Displays festival cards in a grid layout
 * Fetches festivals from Convex and handles selection
 *
 * Using nuqs with URL key remapping for cleaner URLs
 */

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { FESTIVALS } from "@/lib/constants";
import type { FestivalType } from "@/types";

export function FestivalSelector() {
  const router = useRouter();
  const festivals = useQuery(api.festivals.listFestivals);

  const handleFestivalSelect = (festivalType: FestivalType) => {
    // Navigation with festival parameter in the URL
    router.push(`/create/relationship?festival=${festivalType}`);
  };

  if (festivals === undefined) {
    return <LoadingState message="Loading festivals..." />;
  }

  if (festivals === null || festivals.length === 0) {
    return (
      <ErrorState message="No festivals available. Please try again later." />
    );
  }

  const filteredFestivals = festivals.filter(
    (f) => f.festivalId !== "holi" && f.festivalId !== "pongal", // Temporarily hide Holi and Pongal from the UI
  );

  return (
    <div className="w-full px-4">
      <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4 auto-rows-max">
        { filteredFestivals.map((festival) => {
          const festivalData = FESTIVALS[festival.festivalId as FestivalType];

          return (
            <Card
              key={ festival._id }
              className="group touch-target gap-0 p-0 cursor-pointer overflow-hidden border border-border shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
              onClick={ () =>
                handleFestivalSelect(festival.festivalId as FestivalType)
              }
            >
              <div
                className="h-28 sm:h-36 transition-transform group-hover:brightness-110 duration-200"
                style={ {
                  background: `linear-gradient(135deg, ${festivalData.colorPalette[0]}, ${festivalData.colorPalette[1]})`,
                } }
              />
              <div className="p-4 sm:p-4 space-y-2">
                <h3 className="text-base sm:text-lg font-semibold leading-tight">
                  { festival.displayName }
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                  { festivalData.description }
                </p>
              </div>
            </Card>
          );
        }) }
      </div>
    </div>
  );
}
