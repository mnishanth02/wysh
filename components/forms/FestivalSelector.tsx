"use client";

/**
 * Festival Selector Component
 * Displays festival cards in a grid layout
 * Fetches festivals from Convex and handles selection
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
    // Store selection in session storage for the creation flow
    sessionStorage.setItem("greeting_festival", festivalType);
    router.push("/create/relationship");
  };

  if (festivals === undefined) {
    return <LoadingState message="Loading festivals..." />;
  }

  if (festivals === null || festivals.length === 0) {
    return (
      <ErrorState message="No festivals available. Please try again later." />
    );
  }

  return (
    <div className="grid gap-4 mobile-gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {festivals.map((festival) => {
        const festivalData = FESTIVALS[festival.festivalId as FestivalType];

        return (
          <Card
            key={festival._id}
            className="group touch-target cursor-pointer overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg active:scale-95"
            onClick={() =>
              handleFestivalSelect(festival.festivalId as FestivalType)
            }
          >
            <div
              className="h-24 sm:h-32 transition-transform group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${festivalData.colorPalette[0]}, ${festivalData.colorPalette[1]})`,
              }}
            />
            <div className="p-4 mobile-p-4 sm:p-6 space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold">
                {festival.displayName}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {festivalData.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
