"use client";

/**
 * Relationship Selector Component
 * Displays relationship categories and types
 * Handles relationship selection for greeting personalization
 */

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { RELATIONSHIP_TYPES } from "@/lib/constants";
import { Users, Heart, Briefcase, UserCircle } from "lucide-react";
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

  const handleRelationshipSelect = (relationshipType: RelationshipType) => {
    // Store selection in session storage
    sessionStorage.setItem("greeting_relationship", relationshipType);
    router.push("/create/personalize");
  };

  return (
    <div className="space-y-8">
      {Object.entries(RELATIONSHIP_TYPES).map(([category, relationships]) => {
        const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
        const label = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS];

        return (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">{label}</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relationships.map((relationship) => (
                <Card
                  key={relationship.value}
                  className="group cursor-pointer border-2 p-4 transition-all hover:border-primary hover:shadow-md"
                  onClick={() => handleRelationshipSelect(relationship.value)}
                >
                  <div className="text-center space-y-2">
                    <p className="font-medium">{relationship.label}</p>
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
