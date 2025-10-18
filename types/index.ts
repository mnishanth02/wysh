/**
 * Type Definitions: Wysh Festival Greeting Platform
 *
 * Central type definitions for greetings, festivals, relationships, and templates
 */

import type { Id } from "../convex/_generated/dataModel";

// Greeting Types

/**
 * Festival types supported by the platform
 */
export type FestivalType =
  | "diwali"
  | "holi"
  | "christmas"
  | "newyear"
  | "pongal"
  | "generic";

/**
 * Relationship types that determine greeting context and styling
 */
export type RelationshipType =
  // Family
  | "parents"
  | "siblings"
  | "spouse"
  | "children"
  | "relatives"
  // Friends
  | "friend"
  | "best_friend"
  | "neighbor"
  // Professional
  | "boss"
  | "colleague"
  | "client"
  | "mentor"
  // Romantic
  | "partner"
  | "fiance"
  | "crush";

/**
 * Greeting status
 */
export type GreetingStatus = "active" | "deleted" | "expired";

/**
 * Complete greeting document structure
 */
export interface Greeting {
  _id: Id<"greetings">;
  festivalType: FestivalType;
  relationshipType: RelationshipType;
  recipientName: string;
  senderName: string;
  customMessage?: string;
  generatedMessage?: string;
  templateId: string;
  shareableId: string;
  viewCount: number;
  createdAt: number;
  status: GreetingStatus;
}

/**
 * Input for creating a new greeting
 */
export interface CreateGreetingInput {
  festivalType: FestivalType;
  relationshipType: RelationshipType;
  recipientName: string;
  senderName: string;
  customMessage?: string;
  templateId: string;
}

/**
 * Response from greeting creation
 */
export interface CreateGreetingResponse {
  greetingId: Id<"greetings">;
  shareableId: string;
}

// Festival Types

/**
 * Festival category classification
 */
export type FestivalCategory = "religious" | "cultural" | "national";

/**
 * Animation style for festival templates
 */
export type AnimationStyle =
  | "sequential"
  | "burst"
  | "generic"
  | "cascade"
  | "fade";

/**
 * Festival reference data
 */
export interface Festival {
  _id: Id<"festivals">;
  festivalId: FestivalType;
  displayName: string;
  category: FestivalCategory;
  colorPalette: string[];
  symbols: string[];
  animationStyle: AnimationStyle;
  isActive: boolean;
}

// Relationship Context Types

/**
 * Relationship category groupings
 */
export type RelationshipCategory =
  | "family"
  | "friends"
  | "professional"
  | "romantic";

/**
 * Visual tone determined by relationship context
 */
export type VisualTone =
  | "formal"
  | "warm"
  | "playful"
  | "intimate"
  | "respectful";

/**
 * Relationship context that maps to visual styling
 */
export interface RelationshipContext {
  category: RelationshipCategory;
  relationshipType: RelationshipType;
  displayName: string;
  visualTone: VisualTone;
  colorIntensity: "muted" | "moderate" | "vibrant";
  animationSpeed: "slow" | "medium" | "fast";
  messageTone: "formal" | "casual" | "intimate" | "professional";
}

// Template Types

/**
 * Template metadata for festival greetings
 */
export interface Template {
  id: string;
  festivalType: FestivalType;
  displayName: string;
  thumbnailUrl: string;
  previewUrl?: string;
  supportedRelationships: RelationshipType[];
  defaultColorPalette: string[];
  animationDuration: number; // in seconds
  complexity: "simple" | "moderate" | "complex";
}

/**
 * Template with relationship context applied
 */
export interface ContextualizedTemplate extends Template {
  appliedContext: RelationshipContext;
  adjustedColors: string[];
  adjustedAnimationSpeed: number;
}

// Form Types

/**
 * Greeting creation form data
 */
export interface GreetingFormData {
  festivalType: FestivalType;
  relationshipType: RelationshipType;
  recipientName: string;
  senderName: string;
  customMessage: string;
  templateId: string;
}

/**
 * Form step state for multi-step greeting creation
 */
export interface GreetingCreationState {
  step: "festival" | "relationship" | "personalize" | "template" | "success";
  festivalType?: FestivalType;
  relationshipType?: RelationshipType;
  recipientName?: string;
  senderName?: string;
  customMessage?: string;
  templateId?: string;
  shareableId?: string;
}

// Validation Types

/**
 * Validation constraints
 */
export const ValidationConstraints = {
  RECIPIENT_NAME_MAX: 50,
  SENDER_NAME_MAX: 50,
  CUSTOM_MESSAGE_MAX: 150,
  SHAREABLE_ID_LENGTH: 8,
} as const;

/**
 * View count increment result
 */
export interface ViewCountResult {
  success: boolean;
}

// Error Types

/**
 * Greeting-specific error types
 */
export type GreetingErrorType =
  | "INVALID_FESTIVAL"
  | "INVALID_RELATIONSHIP"
  | "INVALID_NAME"
  | "INVALID_MESSAGE"
  | "GREETING_NOT_FOUND"
  | "CREATION_FAILED"
  | "DATABASE_ERROR";

/**
 * Structured error response
 */
export interface GreetingError {
  type: GreetingErrorType;
  message: string;
  field?: string;
}
