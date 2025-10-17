# Convex API Contracts: Wysh Greetings

**Created**: 2025-10-17
**Phase**: Phase 1 Design
**Format**: TypeScript (Convex SDK)

## Overview

Wysh uses Convex for all backend operations. These contracts define mutations (write operations) and queries (read operations) exposed to the Next.js frontend.

## Mutations

### createGreeting

**Purpose**: Create a new festival greeting with personalization data.

**Location**: `convex/greetings.ts`

**Input**:

```typescript
{
  festivalType: string;           // "diwali" | "holi" | "christmas" | "newyear" | "pongal" | "generic"
  relationshipType: string;       // "parents" | "siblings" | "spouse" | "boss" | "colleague" | "friend" | "partner" | etc.
  recipientName: string;          // 1-50 characters
  senderName: string;             // 1-50 characters
  customMessage?: string;         // 0-150 characters, optional
  templateId: string;             // e.g., "diwali-template-1"
}
```

**Output**:

```typescript
{
  greetingId: Id<"greetings">;   // Convex generated ID
  shareableId: string;            // 8-char unique URL ID
}
```

**Error Cases**:

| Scenario | Error | Status |
|----------|-------|--------|
| Invalid festival type | "Invalid festival selected" | 400 |
| Invalid relationship type | "Invalid relationship type" | 400 |
| Recipient name empty or >50 chars | "Recipient name invalid" | 400 |
| Sender name empty or >50 chars | "Sender name invalid" | 400 |
| Custom message >150 chars | "Message too long" | 400 |
| Database write failure | "Failed to create greeting. Please try again." | 500 |
| Unique ID collision (extremely rare) | Retry mutation | 500 |

**Side Effects**:

- Inserts new document into `greetings` table
- Generates system message if `customMessage` not provided (via `generateContextualMessage()`)
- Initializes `viewCount = 0`, `createdAt = now()`

**Retry Logic**:

Frontend implements exponential backoff: 0ms → 500ms → 1500ms (max 3 attempts)

**Example Request/Response**:

```typescript
// Request
{
  festivalType: "diwali",
  relationshipType: "parents",
  recipientName: "Amma",
  senderName: "Ravi",
  customMessage: "",
  templateId: "diwali-template-1"
}

// Response
{
  greetingId: "jb88dhk2...",
  shareableId: "a7x9k2m1"
}
```

---

### incrementViewCount

**Purpose**: Atomically increment view count when greeting is viewed.

**Location**: `convex/greetings.ts`

**Input**:

```typescript
{
  greetingId: Id<"greetings">;   // Convex ID from greeting document
}
```

**Output**:

```typescript
{
  success: boolean;               // true on success
}
```

**Error Cases**:

| Scenario | Error | Status |
|----------|-------|--------|
| Greeting not found | null (silent failure acceptable) | 200 |
| Database write failure | Log to server; silent to client | 500 |

**Side Effects**:

- Atomically increments `viewCount` field by 1
- No update to `updatedAt` (greeting is immutable post-creation)

**Retry Logic**:

None needed (fire-and-forget from frontend; view tracking is non-critical)

**Performance**:

- Should complete in <100ms; client does not wait for response

**Example**:

```typescript
// Request
{
  greetingId: "jb88dhk2..."
}

// Response
{
  success: true
}
```

---

## Queries

### getGreetingByShareableId

**Purpose**: Fetch greeting data for display on view page.

**Location**: `convex/greetings.ts`

**Input**:

```typescript
{
  shareableId: string;            // 8-char URL ID
}
```

**Output**:

```typescript
{
  _id: Id<"greetings">;
  festivalType: string;
  relationshipType: string;
  recipientName: string;
  senderName: string;
  customMessage?: string;
  generatedMessage?: string;
  templateId: string;
  shareableId: string;
  viewCount: number;              // Not exposed to recipient
  createdAt: number;
  status: string;
} | null
```

**Error Cases**:

| Scenario | Error | Status |
|----------|-------|--------|
| Greeting not found | null | 200 |
| Invalid shareableId format | null | 200 |
| Database read failure | Retry on client | 500 |

**Caching**:

- Convex caches queries for reactive updates (automatic)
- Greeting data is immutable (safe to cache indefinitely)

**Performance**:

- Should complete in <50ms (indexed lookup by `shareableId`)

**Example**:

```typescript
// Request
{
  shareableId: "a7x9k2m1"
}

// Response
{
  _id: "jb88dhk2...",
  festivalType: "diwali",
  relationshipType: "parents",
  recipientName: "Amma",
  senderName: "Ravi",
  customMessage: "",
  generatedMessage: "Wishing you a Diwali full of light and prosperity!",
  templateId: "diwali-template-1",
  shareableId: "a7x9k2m1",
  viewCount: 5,
  createdAt: 1729190400000,
  status: "active"
}
```

---

### listFestivals

**Purpose**: Fetch all available festivals for creation flow.

**Location**: `convex/festivals.ts`

**Input**:

```typescript
{}
```

**Output**:

```typescript
[
  {
    _id: Id<"festivals">;
    festivalId: string;
    displayName: string;
    category: string;
    colorPalette: string[];
    symbols: string[];
    animationStyle: string;
    isActive: boolean;
  }
]
```

**Error Cases**:

| Scenario | Error | Status |
|----------|-------|--------|
| Database read failure | [] (empty array) | 200 |

**Caching**:

- Convex caches; refetch on manual refresh
- Festivals are static (changes require code deploy)

**Performance**:

- Should complete in <10ms (small dataset)
- Load all festivals at app startup; no pagination needed

**Example Response**:

```typescript
[
  {
    _id: "festival_001",
    festivalId: "diwali",
    displayName: "Diwali (Deepavali)",
    category: "religious",
    colorPalette: ["#FF6B35", "#FFA500", "#8B0000", "#FFFFFF"],
    symbols: ["diya", "rangoli", "fireworks", "lotus"],
    animationStyle: "sequential",
    isActive: true
  },
  {
    _id: "festival_002",
    festivalId: "holi",
    displayName: "Holi - Festival of Colors",
    category: "religious",
    colorPalette: ["#FF1493", "#FFD700", "#1E90FF", "#32CD32", "#9370DB"],
    symbols: ["color_powder", "water_balloon", "hands", "flowers"],
    animationStyle: "burst",
    isActive: true
  }
  // ... 4 more festivals
]
```

---

## Client-Side Usage Examples

### Creating a Greeting

```typescript
// In React component (e.g., /create/success/page.tsx)
const { mutate: createGreeting, pending } = useMutation(api.greetings.createGreeting);

const handleCreate = async () => {
  try {
    const response = await createGreeting({
      festivalType: "diwali",
      relationshipType: "parents",
      recipientName: "Amma",
      senderName: "Ravi",
      customMessage: "",
      templateId: "diwali-template-1"
    });

    // Redirect to success with shareableId
    router.push(`/create/success?id=${response.shareableId}`);
  } catch (error) {
    setError("Failed to create greeting. Please try again.");
    // Implement exponential backoff retry here
  }
};
```

### Fetching a Greeting for View

```typescript
// In React component (e.g., /g/[id]/page.tsx)
const greeting = useQuery(api.greetings.getGreetingByShareableId, {
  shareableId: params.id
});

// Increment view count (fire-and-forget)
const { mutate: incrementView } = useMutation(api.greetings.incrementViewCount);

useEffect(() => {
  if (greeting?._id) {
    incrementView({ greetingId: greeting._id });
  }
}, [greeting?._id, incrementView]);
```

### Loading Festival Data

```typescript
// In React component (e.g., /create/festival/page.tsx)
const festivals = useQuery(api.festivals.listFestivals);

return (
  <div>
    {festivals?.map(festival => (
      <FestivalCard key={festival.festivalId} festival={festival} />
    ))}
  </div>
);
```

---

## Authentication & Authorization (MVP)

**No authentication in MVP**:
- All queries and mutations are public
- Anyone can create greetings and view any greeting
- Mutations have input validation only (no user ownership)

**Post-MVP Considerations**:

Future versions may add:
- User authentication (Clerk, Auth0, or Convex auth)
- Creator ID tracking: Add `creatorId` to greeting document
- Creator-only queries: `getMyGreetings()`, `getAnalytics()`
- Rate limiting: Max 10 greetings per IP per hour

---

## Performance & Reliability

### Latency Targets

| Operation | Target | Notes |
|-----------|--------|-------|
| `createGreeting()` | <2s | Includes ID generation, DB write, client overhead |
| `getGreetingByShareableId()` | <100ms | Indexed query; cached by Convex |
| `listFestivals()` | <10ms | Small dataset; cached |
| `incrementViewCount()` | <100ms | Fire-and-forget; async |

### Error Recovery

| Failure | Recovery |
|---------|----------|
| Network timeout | Client retries with exponential backoff |
| Database unavailable | Mutation fails after 3 retries; user sees error message |
| Unique ID collision | Retry mutation (collision probability negligible) |
| Greeting not found | Render "Greeting not found" page with CTA to create |

---

## Observability

### Logging (Post-MVP)

Consider adding Convex Observability for:
- Mutation failure rates
- Query latency percentiles
- Database error tracking
- Request volume trends

### Metrics (Post-MVP)

Track:
- Greetings created per day
- Average view count per greeting
- Most popular festivals
- Most popular relationships
