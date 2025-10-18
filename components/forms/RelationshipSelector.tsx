"use client";

/**
 * Relationship Selector Component
 * Displays relationship categories and types
 * Handles relationship selection for greeting personalization
 *
 * Using nuqs with improved parsers that include history management
 */

import { Briefcase, Heart, UserCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { Card } from "@/components/ui/card";
import { RELATIONSHIP_TYPES } from "@/lib/constants";
import { greetingParsers } from "@/lib/url-state-parsers";
import type { RelationshipType } from "@/types";

const CATEGORY_ICONS = {
  family: Users,
  friends: UserCircle,
  professional: Briefcase,
  romantic: Heart,
};

const CATEGORY_LABELS = {
  family: "Family",
  friends: "Friends",
  professional: "Professional",
  romantic: "Romantic",
};

export function RelationshipSelector() {
  const router = useRouter();
  const [festival] = useQueryState("festival", greetingParsers.festival);

  const handleRelationshipSelect = (relationshipType: RelationshipType) => {
    // Navigate with both festival and relationship parameters already in the URL
    router.push(
      `/create/personalize?festival=${festival}&relationship=${relationshipType}`,
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {Object.entries(RELATIONSHIP_TYPES).map(([category, relationships]) => {
        const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
        const label = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS];

        return (
          <div key={category} className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-xl sm:text-2xl font-semibold">{label}</h2>
            </div>

            <div className="grid gap-3 mobile-gap-4 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relationships.map((relationship) => (
                <Card
                  key={relationship.value}
                  className="group touch-target cursor-pointer border-2 p-3 sm:p-4 transition-all hover:border-primary hover:shadow-md active:scale-95"
                  onClick={() => handleRelationshipSelect(relationship.value)}
                >
                  <div className="text-center space-y-2">
                    <p className="font-medium text-sm sm:text-base">
                      {relationship.label}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
