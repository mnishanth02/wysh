# Data Model: Wysh Festival Greeting Platform

**Created**: 2025-10-17
**Phase**: Phase 1 Design
**Status**: Active

## Overview

Wysh uses Convex database with a minimal, normalized schema focused on MVP requirements. Two primary tables store all data needed for greeting creation, viewing, and view count tracking.

## Entity Definitions

### Greeting

**Purpose**: Represents a created festival greeting with all personalization data and sharing metadata.

**Attributes**:

| Field | Type | Required | Max Length | Description | Example |
|-------|------|----------|------------|-------------|---------|
| `_id` | `Id<"greetings">` | Yes | - | Convex auto-generated ID | Auto |
| `festivalType` | `string` | Yes | - | Festival identifier | "diwali", "holi", "christmas", "newyear", "pongal", "generic" |
| `relationshipType` | `string` | Yes | - | Relationship context | "parents", "siblings", "spouse", "boss", "colleague", "client", "friend", "partner" |
| `recipientName` | `string` | Yes | 50 | Name of greeting recipient | "Amma", "Arjun" |
| `senderName` | `string` | Yes | 50 | Name of greeting creator | "Ravi", "Priya" |
| `customMessage` | `string` | No | 150 | User-provided custom message | "Wishing you joy and prosperity!" |
| `generatedMessage` | `string` | No | 150 | System-generated contextual message | Auto-generated if customMessage empty |
| `templateId` | `string` | Yes | - | Identifier for selected template design | "diwali-template-1", "holi-template-2" |
| `shareableId` | `string` | Yes | - | Unique short URL identifier | 8-char nanoid, e.g., "a7x9k2m1" |
| `viewCount` | `number` | Yes | - | Anonymous view count | 0, 1, 42, etc. |
| `createdAt` | `number` | Yes | - | Milliseconds since epoch | 1729190400000 |
| `status` | `string` | Yes | - | Greeting status (MVP always "active") | "active" (reserved for future: "deleted", "expired") |

**Constraints**:

- `shareableId`: Unique index; must not collide (enforced via nanoid cryptographic generation)
- `recipientName` & `senderName`: Trimmed; non-empty; no HTML/script injection (validated with zod)
- `customMessage`: Trimmed; no injection (validated with zod)
- `viewCount`: Never negative; incremented atomically by mutations
- `templateId`: Must exist in templates configuration (validated at template selection)
- `relationshipType`: Must be in predefined list (enforced by frontend selector)

**Indexes**:

- `by_shareable_id`: Query greetings by `shareableId` for view page (primary read path)
- `by_created_at`: Fetch recent greetings for future analytics (post-MVP)

**State Transitions** (MVP):

- Created → Active (on creation, `viewCount = 0`)
- Active → Active (view increments `viewCount`)
- No deletion in MVP (indefinite retention)

**Data Retention**:

- Forever (MVP scope; no auto-cleanup planned)
- Post-MVP: Consider archival after 1+ year

**Privacy**:

- `shareableId`: Public via URL; no authentication needed
- `viewCount`: Private to original creator (visible only in future creator dashboard, not in MVP)
- No PII except user-provided `recipientName`, `senderName`

**Example Document**:

```json
{
  "_id": "jb88dhk2...",
  "festivalType": "diwali",
  "relationshipType": "parents",
  "recipientName": "Amma",
  "senderName": "Ravi",
  "customMessage": "",
  "generatedMessage": "Wishing you a Diwali full of light and prosperity!",
  "templateId": "diwali-template-1",
  "shareableId": "a7x9k2m1",
  "viewCount": 5,
  "createdAt": 1729190400000,
  "status": "active"
}
```

---

### Festival

**Purpose**: Reference data for festival metadata, colors, and symbols (rarely changes; used for template configuration).

**Attributes**:

| Field | Type | Required | Description | Example |
|-------|------|----------|------------|---------|
| `_id` | `Id<"festivals">` | Yes | Convex auto-generated ID | Auto |
| `festivalId` | `string` | Yes | Unique identifier | "diwali", "holi", "christmas", "newyear", "pongal", "generic" |
| `displayName` | `string` | Yes | User-facing name | "Diwali (Deepavali)", "Holi - Festival of Colors" |
| `category` | `string` | Yes | Festival classification | "religious", "cultural", "national" |
| `colorPalette` | `array<string>` | Yes | Hex color codes (ordered by prominence) | `["#FF6B35", "#FFA500", "#8B0000", "#FFFFFF"]` |
| `symbols` | `array<string>` | Yes | Festival-appropriate visual elements | `["diya", "rangoli", "fireworks", "lotus"]` |
| `animationStyle` | `string` | Yes | Animation template to use | "sequential" (for diyas), "burst" (for Holi), "generic" |
| `isActive` | `boolean` | Yes | Whether available for greeting creation | true, false |

**Constraints**:

- `festivalId`: Unique; immutable
- `colorPalette`: Minimum 3 colors; maximum 6
- `symbols`: Minimum 2 symbols; maximum 5
- `displayName`: Human-readable, culturally appropriate

**Indexes**:

- None needed for MVP (infrequent access; load all on startup)

**Data Population** (Static Configuration):

Festivals table pre-populated at deployment with 6 documents (5 festivals + 1 generic). No user creation/modification.

**Example Documents**:

```json
{
  "_id": "festival_001",
  "festivalId": "diwali",
  "displayName": "Diwali (Deepavali)",
  "category": "religious",
  "colorPalette": ["#FF6B35", "#FFA500", "#8B0000", "#FFFFFF"],
  "symbols": ["diya", "rangoli", "fireworks", "lotus"],
  "animationStyle": "sequential",
  "isActive": true
}
```

```json
{
  "_id": "festival_002",
  "festivalId": "holi",
  "displayName": "Holi - Festival of Colors",
  "category": "religious",
  "colorPalette": ["#FF1493", "#FFD700", "#1E90FF", "#32CD32", "#9370DB"],
  "symbols": ["color_powder", "water_balloon", "hands", "flowers"],
  "animationStyle": "burst",
  "isActive": true
}
```

---

## Relationships & Cardinality

```
Festival (1) ←→ (*) Greeting
  - A greeting references one festival (festivalId)
  - A festival has many greetings
  - Relationship: Non-enforced foreign key (MVP has no referential integrity)

RelationshipContext (N) ←→ (M) Greeting
  - A greeting has one relationship type (relationshipType string)
  - Relationship types are static configuration (not a DB table in MVP)
  - Mapping defined in `lib/context-engine.ts`
```

---

## Query Patterns

### Creation Flow

```
GET /create
  → Load festival list (all active festivals)
  → Load relationship categories (from lib/constants.ts)
  → User selects festival + relationship
  → Render context engine for selected combo
  → User enters names + message
  → Template selection (filtered by festival + relationship)
  → Convex mutation: createGreeting(...)
  → Response: { greetingId, shareableId }
```

### View Flow

```
GET /g/[shareableId]
  → Convex query: getGreetingByShareableId(shareableId)
  → Response: Greeting document
  → Render template with greeting data
  → Fire-and-forget: incrementViewCount(greetingId)
  → Animation plays
  → Show replay button
  → Show "Create Your Own Wysh" CTA
```

### Future Analytics (Post-MVP)

```
GET /api/analytics/top-greetings
  → Convex query: greetings ordered by viewCount DESC
  → Response: Top 10 greetings (for future creator dashboard)
```

---

## Validation Rules

### Greeting Creation

| Field | Validation | Error Message |
|-------|-----------|---------------|
| `recipientName` | Non-empty, 1-50 chars, no script tags | "Recipient name required (max 50 characters)" |
| `senderName` | Non-empty, 1-50 chars, no script tags | "Sender name required (max 50 characters)" |
| `customMessage` | Optional, 0-150 chars, no script tags | "Message too long (max 150 characters)" |
| `festivalType` | Must be in Festival table `isActive = true` | "Invalid festival selected" |
| `relationshipType` | Must be in predefined relationship list | "Invalid relationship type" |
| `templateId` | Must match selected festival + relationship | "Invalid template selection" |

**Implementation**: Zod schema in `lib/schemas.ts` (frontend) + Convex mutation validation (backend).

---

## Scalability Considerations

### MVP Load

- **Estimated data size**:
  - 100 greetings × 1KB per greeting = 100KB (first month)
  - 6 festival documents = 2KB
  - Total: ~100KB (negligible)

- **Query patterns**:
  - 1 query per view: `getGreetingByShareableId()`
  - 1 mutation per view: `incrementViewCount()`
  - Very low contention (no concurrent writes to same greeting)

### Future Scaling (Post-MVP)

- **If 10k greetings/month**: Add indexing strategy for time-based queries
- **If view counts become bottleneck**: Consider denormalized view count cache
- **If storage exceeds GB**: Implement archival policy (move old greetings to cold storage)

---

## Migration Strategy (Post-MVP)

### Adding Creator Authentication (Phase 2)

- Add `creatorId` field to greetings table
- Migrate existing greetings: `creatorId = null` (anonymous creators)
- Add creator history queries: filter by `creatorId`
- Add analytics dashboard queries

### Adding Expiration (Phase 2)

- Add `expiresAt` field (optional) to greetings
- Add cleanup mutation for expired greetings
- Update view page query to check expiration

---

## Schema Definition (Convex TypeScript)

See `convex/schema.ts` for TypeScript implementation with validation.

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  greetings: defineTable({
    festivalType: v.string(),
    relationshipType: v.string(),
    recipientName: v.string(),
    senderName: v.string(),
    customMessage: v.optional(v.string()),
    generatedMessage: v.optional(v.string()),
    templateId: v.string(),
    shareableId: v.string(),
    viewCount: v.number(),
    createdAt: v.number(),
    status: v.string(),
  })
    .index("by_shareable_id", ["shareableId"])
    .index("by_created_at", ["createdAt"]),

  festivals: defineTable({
    festivalId: v.string(),
    displayName: v.string(),
    category: v.string(),
    colorPalette: v.array(v.string()),
    symbols: v.array(v.string()),
    animationStyle: v.string(),
    isActive: v.boolean(),
  })
    .index("by_festival_id", ["festivalId"]),
});
```
