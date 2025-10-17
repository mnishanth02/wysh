"use client";

/**
 * Festival Selector Component
 * Displays festival cards in a grid layout
 * Fetches festivals from Convex and handles selection
 */

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {festivals.map((festival) => {
        const festivalData = FESTIVALS[festival.festivalId as FestivalType];

        return (
          <Card
            key={festival._id}
            className="group cursor-pointer overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg"
            onClick={() =>
              handleFestivalSelect(festival.festivalId as FestivalType)
            }
          >
            <div
              className="h-32 transition-transform group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${festivalData.colorPalette[0]}, ${festivalData.colorPalette[1]})`,
              }}
            />
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-semibold">{festival.displayName}</h3>
              <p className="text-sm text-muted-foreground">
                {festivalData.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
