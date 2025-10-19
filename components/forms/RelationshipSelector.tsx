"use client";

/**
 * Relationship Selector Component
 * Displays relationship categories and types
 * Handles relationship selection for greeting personalization
 *
 * Using nuqs with improved parsers that include history management
 */

import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { Card } from "@/components/ui/card";
import { RELATIONSHIP_TYPES } from "@/lib/constants";
import { greetingParsers } from "@/lib/url-state-parsers";

const CATEGORY_CONFIG = {
  family: {
    emoji: "👨‍👩‍👧‍👦",
    label: "Family",
    description: "Parents, siblings, relatives",
  },
  friends: {
    emoji: "🤝",
    label: "Friends",
    description: "Best friends, close companions",
  },
  professional: {
    emoji: "💼",
    label: "Professional",
    description: "Colleagues, clients, business partners",
  },
  romantic: {
    emoji: "💕",
    label: "Romantic",
    description: "Partner, special someone",
  },
};

export function RelationshipSelector() {
  const router = useRouter();
  const [festival] = useQueryState("festival", greetingParsers.festival);

  const handleCategorySelect = (category: keyof typeof RELATIONSHIP_TYPES) => {
    // For now, we'll use the first relationship type in the category
    // This matches the simplified UX where users select category, not individual relationships
    const firstRelationship = RELATIONSHIP_TYPES[category][0];
    router.push(
      `/create/personalize?festival=${festival}&relationship=${firstRelationship.value}`,
    );
  };

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto">
      {Object.entries(CATEGORY_CONFIG).map(([category, config]) => (
        <Card
          key={category}
          className="group cursor-pointer border-2 p-6 sm:p-8 transition-all hover:border-primary hover:shadow-lg active:scale-98 touch-target"
          onClick={() =>
            handleCategorySelect(category as keyof typeof RELATIONSHIP_TYPES)
          }
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto sm:mx-0">
              <span className="text-4xl sm:text-5xl">{config.emoji}</span>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                {config.label}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {config.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
