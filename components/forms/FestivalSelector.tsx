"use client";

/**
 * Festival Selector Component
 * Displays festival cards with beautiful background images
 * Fetches festivals from Convex and handles selection
 *
 * Using nuqs with URL key remapping for cleaner URLs
 */

import { useQuery } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ComingSoonBadge,
  ComingSoonOverlay,
} from "@/components/shared/ComingSoonBadge";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { FESTIVALS } from "@/lib/constants";
import { isFestivalEnabled } from "@/lib/feature-flags";
import type { FestivalType } from "@/types";

// Festival image mappings
const FESTIVAL_IMAGES: Record<FestivalType, string> = {
  diwali: "/festivals/diwali/diwali-festival.png",
  holi: "/festivals/holi/holi-festival.png",
  christmas: "/festivals/christmas/christmas-festival.png",
  newyear: "/festivals/newyear/newyear-festival.png",
  pongal: "/festivals/pongal/pongal-festival.png",
  generic: "/festivals/generic-festival.png",
};

// Fallback gradient backgrounds if images are not available
const FESTIVAL_GRADIENTS: Record<FestivalType, string> = {
  diwali: "linear-gradient(135deg, #FF6B35 0%, #FFA500 50%, #8B0000 100%)",
  holi: "linear-gradient(135deg, #FF1493 0%, #FFD700 25%, #1E90FF 50%, #32CD32 75%, #9370DB 100%)",
  christmas: "linear-gradient(135deg, #C41E3A 0%, #0C6B2E 50%, #FFD700 100%)",
  newyear: "linear-gradient(135deg, #FFD700 0%, #FF6B6B 50%, #4ECDC4 100%)",
  pongal: "linear-gradient(135deg, #FF8C42 0%, #FDEE00 50%, #228B22 100%)",
  generic: "linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #F093FB 100%)",
};

function FestivalCard({
  festival,
  festivalData,
  festivalId,
  onSelect,
  isDisabled = false,
}: {
  festival: { _id: string; displayName: string; festivalId: string };
  festivalData: { description: string };
  festivalId: FestivalType;
  onSelect: () => void;
  isDisabled?: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card
      className={ `group relative touch-target gap-0 p-0 overflow-hidden border-2 shadow-lg transition-all duration-300 rounded-3xl ${isDisabled
          ? "cursor-not-allowed opacity-75"
          : "cursor-pointer hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
        }` }
      onClick={ isDisabled ? undefined : onSelect }
    >
      {/* Coming Soon Overlay for Disabled Festivals */ }
      { isDisabled && (
        <>
          <ComingSoonOverlay />
          <ComingSoonBadge position="top-right" size="default" />
        </>
      ) }

      {/* Background Image or Gradient Fallback */ }
      <div className="relative h-56 sm:h-64 md:h-72 w-full overflow-hidden">
        {/* Skeleton Loader - shows while image is loading */ }
        { !imageLoaded && !imageError && (
          <Skeleton className="absolute inset-0 rounded-none" />
        ) }

        { !imageError ? (
          <Image
            src={ FESTIVAL_IMAGES[festivalId] }
            alt={ festival.displayName }
            fill
            className={ `object-cover transition-opacity duration-500 ${isDisabled ? "" : "group-hover:scale-110"
              } ${imageLoaded ? "opacity-100" : "opacity-0"}` }
            priority={ festivalId === "diwali" || festivalId === "christmas" }
            onLoad={ () => setImageLoaded(true) }
            onError={ () => setImageError(true) }
          />
        ) : (
          <div
            className={ `absolute inset-0 transition-transform duration-500 ${isDisabled ? "" : "group-hover:scale-110"
              }` }
            style={ { background: FESTIVAL_GRADIENTS[festivalId] } }
          />
        ) }

        {/* Gradient Overlay for better text readability */ }
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Festival Info Overlay */ }
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
            { festival.displayName }
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-white/90 drop-shadow">
            { festivalData.description }
          </p>
        </div>
      </div>
    </Card>
  );
}

export function FestivalSelector() {
  const router = useRouter();
  const [navigatingFestival, setNavigatingFestival] =
    useState<FestivalType | null>(null);
  const festivals = useQuery(api.festivals.listFestivals);

  const handleFestivalSelect = (festivalType: FestivalType) => {
    // Prevent multiple clicks while navigating
    if (navigatingFestival) return;

    setNavigatingFestival(festivalType);
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

  // Show all festivals, but disable the ones not enabled by feature flags
  const allFestivals = festivals.filter(
    (f) => f.festivalId !== "holi" && f.festivalId !== "pongal", // Temporarily hide Holi and Pongal from the UI
  );

  return (
    <div className="w-full px-4">
      <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
        { allFestivals.map((festival) => {
          const festivalData = FESTIVALS[festival.festivalId as FestivalType];
          const festivalId = festival.festivalId as FestivalType;
          const isEnabled = isFestivalEnabled(festivalId);
          // Only show "Coming Soon" and disable if the festival is actually disabled
          // Don't disable when navigating to prevent the flash effect on enabled festivals
          const shouldDisable = !isEnabled;

          return (
            <FestivalCard
              key={ festival._id }
              festival={ festival }
              festivalData={ festivalData }
              festivalId={ festivalId }
              onSelect={ () => handleFestivalSelect(festivalId) }
              isDisabled={ shouldDisable }
            />
          );
        }) }
      </div>
    </div>
  );
}
