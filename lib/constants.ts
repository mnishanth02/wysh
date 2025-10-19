/**
 * Constants: Wysh Festival Greeting Platform
 *
 * Central location for festival data, relationship types, and configuration
 */

import type {
  FestivalType,
  RelationshipCategory,
  RelationshipType,
  VisualTone,
} from "../types";

// ============================================================================
// Festival Data
// ============================================================================

/**
 * Festival metadata with cultural colors and symbols
 * Used for template configuration and context engine
 */
export const FESTIVALS = {
  diwali: {
    festivalId: "diwali" as FestivalType,
    displayName: "Diwali - Festival of Lights",
    category: "religious" as const,
    colorPalette: ["#FF6B35", "#FFA500", "#8B0000", "#FFFFFF"],
    symbols: ["diya", "rangoli", "fireworks", "lotus"],
    animationStyle: "sequential" as const,
    description: "Celebrate prosperity and divine light",
  },
  holi: {
    festivalId: "holi" as FestivalType,
    displayName: "Holi - Festival of Colors",
    category: "religious" as const,
    colorPalette: ["#FF1493", "#FFD700", "#1E90FF", "#32CD32", "#9370DB"],
    symbols: ["color_powder", "water_balloon", "hands", "flowers"],
    animationStyle: "burst" as const,
    description: "Spread joy, love, and vibrant celebrations",
  },
  christmas: {
    festivalId: "christmas" as FestivalType,
    displayName: "Christmas - Season of Joy",
    category: "religious" as const,
    colorPalette: ["#C41E3A", "#0C6B2E", "#FFD700", "#FFFFFF"],
    symbols: ["tree", "star", "gift", "snowflake", "bells"],
    animationStyle: "cascade" as const,
    description: "Celebrate love, warmth, and togetherness",
  },
  newyear: {
    festivalId: "newyear" as FestivalType,
    displayName: "New Year",
    category: "cultural" as const,
    colorPalette: ["#FFD700", "#000000", "#FF6B6B", "#4ECDC4", "#95E1D3"],
    symbols: ["fireworks", "champagne", "clock", "confetti", "balloon"],
    animationStyle: "burst" as const,
    description: "Welcome new beginnings with hope",
  },
  pongal: {
    festivalId: "pongal" as FestivalType,
    displayName: "Pongal",
    category: "cultural" as const,
    colorPalette: ["#FF8C42", "#FDEE00", "#8B4513", "#228B22"],
    symbols: ["pot", "sugarcane", "sun", "kolam", "cow"],
    animationStyle: "sequential" as const,
    description: "Harvest Festival",
  },
  generic: {
    festivalId: "generic" as FestivalType,
    displayName: "General Celebration",
    category: "cultural" as const,
    colorPalette: ["#667EEA", "#764BA2", "#F093FB", "#4FACFE"],
    symbols: ["star", "heart", "confetti", "gift"],
    animationStyle: "generic" as const,
    description: "Any Celebration",
  },
} as const;

/**
 * Array of all festival types for iteration
 */
export const FESTIVAL_TYPES: FestivalType[] = [
  "diwali",
  "holi",
  "christmas",
  "newyear",
  "pongal",
  "generic",
];

/**
 * Festival emoji mappings for WhatsApp messages and metadata
 */
export const FESTIVAL_EMOJIS: Record<FestivalType, string> = {
  diwali: "🪔",
  holi: "🎨",
  christmas: "🎄",
  newyear: "🎉",
  pongal: "🌾",
  generic: "✨",
};

// ============================================================================
// Relationship Types
// ============================================================================

/**
 * Relationship types organized by category
 * Determines visual styling and message tone
 */
export const RELATIONSHIP_TYPES = {
  family: [
    { value: "parents" as RelationshipType, label: "Parents" },
    { value: "siblings" as RelationshipType, label: "Siblings" },
    { value: "spouse" as RelationshipType, label: "Spouse" },
    { value: "children" as RelationshipType, label: "Children" },
    { value: "relatives" as RelationshipType, label: "Relatives" },
  ],
  friends: [
    { value: "friend" as RelationshipType, label: "Friend" },
    { value: "best_friend" as RelationshipType, label: "Best Friend" },
    { value: "neighbor" as RelationshipType, label: "Neighbor" },
  ],
  professional: [
    { value: "boss" as RelationshipType, label: "Boss" },
    { value: "colleague" as RelationshipType, label: "Colleague" },
    { value: "client" as RelationshipType, label: "Client" },
    { value: "mentor" as RelationshipType, label: "Mentor" },
  ],
  romantic: [
    { value: "partner" as RelationshipType, label: "Partner" },
    { value: "fiance" as RelationshipType, label: "Fiancé(e)" },
    { value: "crush" as RelationshipType, label: "Crush" },
  ],
} as const;

/**
 * All relationship types flattened for validation
 */
export const ALL_RELATIONSHIP_TYPES: RelationshipType[] = (
  Object.values(RELATIONSHIP_TYPES) as unknown as {
    value: RelationshipType;
    label: string;
  }[][]
)
  .flat()
  .map((r) => r.value);

/**
 * Relationship category display names
 */
export const RELATIONSHIP_CATEGORIES: Record<RelationshipCategory, string> = {
  family: "Family",
  friends: "Friends",
  professional: "Professional",
  romantic: "Romantic",
};

// ============================================================================
// Relationship Context Mapping
// ============================================================================

/**
 * Maps relationship types to visual context (tone, intensity, animation)
 * Used by context engine to personalize templates
 */
export const RELATIONSHIP_CONTEXT_MAP: Record<
  RelationshipType,
  {
    category: RelationshipCategory;
    visualTone: VisualTone;
    colorIntensity: "muted" | "moderate" | "vibrant";
    animationSpeed: "slow" | "medium" | "fast";
    messageTone: "formal" | "casual" | "intimate" | "professional";
  }
> = {
  // Family - Warm & Traditional
  parents: {
    category: "family",
    visualTone: "respectful",
    colorIntensity: "moderate",
    animationSpeed: "slow",
    messageTone: "formal",
  },
  siblings: {
    category: "family",
    visualTone: "playful",
    colorIntensity: "vibrant",
    animationSpeed: "fast",
    messageTone: "casual",
  },
  spouse: {
    category: "family",
    visualTone: "intimate",
    colorIntensity: "moderate",
    animationSpeed: "medium",
    messageTone: "intimate",
  },
  children: {
    category: "family",
    visualTone: "playful",
    colorIntensity: "vibrant",
    animationSpeed: "fast",
    messageTone: "casual",
  },
  relatives: {
    category: "family",
    visualTone: "warm",
    colorIntensity: "moderate",
    animationSpeed: "medium",
    messageTone: "formal",
  },

  // Friends - Casual & Fun
  friend: {
    category: "friends",
    visualTone: "playful",
    colorIntensity: "vibrant",
    animationSpeed: "fast",
    messageTone: "casual",
  },
  best_friend: {
    category: "friends",
    visualTone: "playful",
    colorIntensity: "vibrant",
    animationSpeed: "fast",
    messageTone: "casual",
  },
  neighbor: {
    category: "friends",
    visualTone: "warm",
    colorIntensity: "moderate",
    animationSpeed: "medium",
    messageTone: "casual",
  },

  // Professional - Formal & Restrained
  boss: {
    category: "professional",
    visualTone: "formal",
    colorIntensity: "muted",
    animationSpeed: "slow",
    messageTone: "professional",
  },
  colleague: {
    category: "professional",
    visualTone: "formal",
    colorIntensity: "moderate",
    animationSpeed: "medium",
    messageTone: "professional",
  },
  client: {
    category: "professional",
    visualTone: "formal",
    colorIntensity: "muted",
    animationSpeed: "slow",
    messageTone: "professional",
  },
  mentor: {
    category: "professional",
    visualTone: "respectful",
    colorIntensity: "moderate",
    animationSpeed: "medium",
    messageTone: "professional",
  },

  // Romantic - Intimate & Personalized
  partner: {
    category: "romantic",
    visualTone: "intimate",
    colorIntensity: "moderate",
    animationSpeed: "medium",
    messageTone: "intimate",
  },
  fiance: {
    category: "romantic",
    visualTone: "intimate",
    colorIntensity: "vibrant",
    animationSpeed: "medium",
    messageTone: "intimate",
  },
  crush: {
    category: "romantic",
    visualTone: "playful",
    colorIntensity: "moderate",
    animationSpeed: "medium",
    messageTone: "casual",
  },
};

// ============================================================================
// Color Palette Adjustments by Context
// ============================================================================

/**
 * Color intensity multipliers for relationship context
 * Applied to festival color palettes
 */
export const COLOR_INTENSITY_MULTIPLIERS = {
  muted: 0.7,
  moderate: 1.0,
  vibrant: 1.3,
} as const;

/**
 * Animation speed multipliers for relationship context
 * Applied to base animation duration
 */
export const ANIMATION_SPEED_MULTIPLIERS = {
  slow: 1.3,
  medium: 1.0,
  fast: 0.8,
} as const;

// ============================================================================
// Validation Constraints
// ============================================================================

/**
 * Field length constraints for greeting creation
 */
export const VALIDATION_CONSTRAINTS = {
  RECIPIENT_NAME_MIN: 1,
  RECIPIENT_NAME_MAX: 50,
  SENDER_NAME_MIN: 1,
  SENDER_NAME_MAX: 50,
  CUSTOM_MESSAGE_MIN: 0,
  CUSTOM_MESSAGE_MAX: 150,
  SHAREABLE_ID_LENGTH: 8,
} as const;

// ============================================================================
// Performance Configuration
// ============================================================================

/**
 * Performance targets and thresholds
 */
export const PERFORMANCE_CONFIG = {
  TARGET_FPS: 60,
  MAX_PAGE_WEIGHT_MB: 2,
  MAX_LOAD_TIME_MS: 3000,
  ANIMATION_DURATION_RANGE: {
    MIN: 5,
    MAX: 15,
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAYS_MS: [0, 500, 1500],
} as const;

// ============================================================================
// WhatsApp Integration
// ============================================================================

/**
 * WhatsApp deep link configuration
 */
export const WHATSAPP_CONFIG = {
  BASE_URL: "https://wa.me/",
  SHARE_MESSAGE_TEMPLATE:
    "🎉 Check out this personalized festival greeting I created for you! {{url}}",
  URL_BASE: process.env.NEXT_PUBLIC_APP_URL || "https://wysh.app",
} as const;

// ============================================================================
// Template Configuration
// ============================================================================

/**
 * Number of templates per festival (MVP)
 */
export const TEMPLATES_PER_FESTIVAL = {
  diwali: 3,
  holi: 3,
  christmas: 3,
  newyear: 3,
  pongal: 3,
  generic: 2,
} as const;

/**
 * Template complexity levels
 */
export const TEMPLATE_COMPLEXITY = ["simple", "moderate", "complex"] as const;

// ============================================================================
// Sample Greetings for Landing Page
// ============================================================================

/**
 * Sample greetings to showcase on landing page
 * Displays variety of festivals and relationship contexts
 */
export const SAMPLE_GREETINGS = [
  {
    id: "sample-diwali-professional",
    festivalType: "diwali" as const,
    relationshipType: "colleague" as const,
    recipientName: "Team",
    senderName: "Priya",
    message: "",
    label: "Diwali • Professional",
    description: "Warm festival wishes for colleagues",
  },
  {
    id: "sample-christmas-family",
    festivalType: "christmas" as const,
    relationshipType: "parents" as const,
    recipientName: "Mom & Dad",
    senderName: "Sarah",
    message: "",
    label: "Christmas • Family",
    description: "Heartfelt wishes for loved ones",
  },
  {
    id: "sample-newyear-friends",
    festivalType: "newyear" as const,
    relationshipType: "best_friend" as const,
    recipientName: "Alex",
    senderName: "Jordan",
    message: "",
    label: "New Year • Friends",
    description: "Exciting new year wishes with friends",
  },
] as const;
