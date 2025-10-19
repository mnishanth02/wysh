# Feature Specification: Production-Ready Enhancements for Wysh

**Feature Branch**: `003-production-ready-enhancements`
**Created**: October 19, 2025
**Status**: Draft
**Input**: User description: "Enhance Wysh (https://wysh-five.vercel.app/) to production-ready standards by auditing and fixing shadcn/ui theme consistency, implementing rate limiting, comprehensive SEO optimization, performance improvements, and mobile-first enhancements."

## Clarifications *(Session 2025-10-19)*

### shadcn/ui Consistency Clarifications

1. **Q: What specific pages/components have the most color inconsistencies?**
   **A**: Festival templates (DiwaliTemplate, HoliTemplate, etc.) and form components (FestivalSelector, RelationshipSelector) are primary targets. Systematic audit needed via grep script for hex values, Tailwind color scales, and inline styles.

2. **Q: Should festival themes override shadcn/ui primary colors, or extend them?**
   **A**: Extend, not override. Festival colors should be applied as additional CSS variables (e.g., `--festival-diwali-primary`) that work within the shadcn/ui theme hierarchy. Base components always use `bg-background`, `text-foreground`, primary buttons use `bg-primary`, then festival-specific variants use festival variables.

3. **Q: Are there custom color schemes that should be preserved?**
   **A**: Yes, festival-specific color palettes in `lib/constants.ts` (defined per festival type) should remain. These are cultural/intentional customizations, not inconsistencies. They must be converted from hardcoded hex to CSS variable references.

4. **Q: Are there third-party components incompatible with shadcn/ui theming?**
   **A**: No known incompatibilities. All components in `components/ui/` are shadcn/ui (CSS variable compatible). Custom components use Tailwind classes referencing CSS variables. GSAP animations use computed styles (compatible).

---

### Homepage Statistics Clarifications

5. **Q: Should stats counter animate every time into viewport, or only once per session?**
   **A**: Only once per session. Use `useIntersectionObserver` hook with `hasTriggered` state to ensure animation fires on first scroll into view, then remains static for performance and avoid animation spam if user scrolls repeatedly.

6. **Q: What's the fallback if Convex query fails?**
   **A**: Hide section gracefully with error logged to console. Do not show static placeholder (misleading). If query fails, entire stats section (`display: none`) to prevent user confusion about data accuracy. Log error for monitoring.

7. **Q: Should stats update in real-time (subscription) or page reload only?**
   **A**: Page reload only (MVP). Real-time subscriptions deferred to post-MVP. Current approach: Initial load via query, data cached for session. Users refresh page to see updated counts. Aligns with MVP-First Delivery principle.

8. **Q: Privacy concerns with displaying total greeting count publicly?**
   **A**: No. Aggregate counts (total greetings, total views, festival count) don't reveal individual user data. Sharing this demonstrates platform usage/viability without privacy violations. Consistent with public, no-auth design.

---

### Rate Limiting Clarifications

9. **Q: How should rate limit errors be communicated (toast, modal, inline)?**
   **A**: Toast notification + inline form feedback. When rate limit hit: (1) Toast appears with countdown timer and explanation, (2) Submit button disabled with tooltip showing retry time. Prevents form re-submission anxiety.

10. **Q: Do we need CAPTCHA integration after repeated violations?**
    **A**: Not for MVP. CAPTCHA deferred to post-MVP ("future phases" section). Current approach: Log violations, monitor via admin dashboard (future). If patterns detected manually, can block IP server-side. Automated CAPTCHA trigger adds complexity not justified for launch.

11. **Q: Should there be a whitelist for trusted IPs (demo purposes)?**
    **A**: Yes, simple whitelist mechanism via environment variable: `RATE_LIMIT_WHITELIST_IPS=127.0.0.1,staging.ip`. Check whitelist before applying rate limits in mutation. Useful for internal testing and demo scenarios without hitting limits.

12. **Q: What happens to greetings created just before user hits rate limit?**
    **A**: Greetings succeed up to limit, then next request rejected. No rollback or partial failures. If user creates 3 greetings (limit is 3/min), all 3 save successfully. 4th request in same minute returns 429. Clean state—no orphaned data.

---

### SEO Clarifications

13. **Q: Should greeting view pages (/g/[id]) be indexed by search engines, or noindex for privacy?**
    **A**: Noindex via robots.txt (`disallow: /g/*`). Rationale: (1) Greeting URLs are meant for WhatsApp sharing, not organic search, (2) Indexing individual greetings could cause duplicate content issues, (3) Prioritize public routes (homepage, creation flow) for SEO. Private by default.

14. **Q: What's the target audience geography for SEO keywords?**
    **A**: India-focused (primary), Global secondary. Keywords: "festival greeting", "diwali greeting card", "holi wishes", "indian festival cards". Tailor meta descriptions with festival names relevant to Indian audience. Language: English (no i18n MVP).

15. **Q: Are there specific keywords/search terms to rank for?**
    **A**: Primary targets: "create diwali greeting", "holi greeting card online", "personalized festival wishes", "animated festival greeting". Secondary: "free festival cards", "whatsapp greeting maker". Use in homepage title, meta description, H1, and body content naturally.

16. **Q: Should we implement hreflang tags for multi-language support?**
    **A**: No, not for MVP (English only). Hreflang deferred to i18n phase. If multi-language support added later, hreflang implementation required then.

---

### Performance Clarifications

17. **Q: What's the acceptable Lighthouse score target?**
    **A**: Mobile ≥90, Desktop ≥95. Report to stakeholders: LCP <2.5s, FID <100ms, CLS <0.1. Bundle size <300KB (compressed, initial load). Measure before/after optimization to justify effort.

18. **Q: Should we implement service worker/PWA features?**
    **A**: No for MVP. PWA deferred to "future phases". Focus on core performance (loading states, code splitting, image optimization) first. No offline support required for launch.

19. **Q: Maximum acceptable bundle size?**
    **A**: Initial load <300KB gzipped. Breakdown: React + Next.js ~200KB, shadcn/ui components ~50KB, custom code ~50KB. Use `next/dynamic` for festival templates (loaded on-demand). Verify with `npm bundle-analyzer` or similar.

20. **Q: Should animations auto-reduce quality on low-end devices, or require user toggle?**
    **A**: Auto-detect via device capabilities or use CSS media query `prefers-reduced-motion`. No user toggle needed (complexity). Default: reduce particles 60% on mobile, respect `prefers-reduced-motion` always. Provide manual fallback in accessibility settings (future).

---

### Mobile Optimization Clarifications

21. **Q: What's the minimum supported device year/model?**
    **A**: 2018+ devices (iPhone 6S+, Samsung Galaxy A6+). Android 9+, iOS 14+. Test on mid-range Android (Snapdragon 600 series, e.g., Samsung Galaxy A21). Support modern browsers (Chrome 90+, Safari 14+, Firefox 88+, Edge 90+).

22. **Q: Should we detect device performance and adapt animation quality automatically?**
    **A**: Partial. Use CSS media query `prefers-reduced-motion` + simple device-class detection (mobile vs tablet vs desktop via viewport width). Don't implement complex performance profiling (adds overhead). Fallback: manual reduction if animations stutter (observed via testing).

23. **Q: Are there specific mobile browsers to support (UC Browser, Opera Mini)?**
    **A**: No. Focus on mainstream browsers: Chrome, Safari, Firefox, Edge. UC Browser and Opera Mini not supported (MVP). If analytics show significant traffic, revisit. Aim for 95%+ browser coverage with standard support.

24. **Q: Should we implement specific optimizations for iOS vs Android?**
    **A**: Minimal platform-specific code. Both use same React components. iOS-specific: Ensure 16px+ base font size (prevents auto-zoom). Android-specific: Test on physical devices (performance varies). No platform-specific UI (consistency goal).

---

### Template Clarifications

25. **Q: Are any festival templates currently incomplete or broken?**
    **A**: No. All 7 templates (Diwali, Holi, Christmas, New Year, Pongal, Generic, FireworksTemplate) are functional. Audit for hardcoded colors only. No structural changes needed.

26. **Q: Do all templates follow the relationship context pattern correctly?**
    **A**: Yes. All templates use `getRelationshipContext()` from context engine. Verified in codebase. Enhance: Ensure message tone and animation pacing vary correctly for "boss" (formal, fast), "parents" (respectful, moderate), "friends" (casual, playful).

27. **Q: Are there templates needing cultural review before production?**
    **A**: Yes. Diwali (gold/saffron colors accuracy), Holi (rainbow vibrancy), Pongal (rangoli authenticity) should be reviewed by someone familiar with each festival. Flag for QA gate per constitution.

28. **Q: Should each template have multiple variants (Traditional vs Modern)?**
    **A**: No for MVP. Single variant per template. Variants deferred to post-MVP ("future phases"). Focus on single, high-quality design per festival.

---

### Images & Assets Clarifications

29. **Q: What's the source for festival icons/assets?**
    **A**: Lucide React (already installed) for generic icons. Festival-specific symbols (diyas, rangoli, snowflakes) from: (1) Custom SVG designs (preferred), (2) Heroicons (if needed), (3) Public domain assets. AI-generated images NOT used (cultural sensitivity).

30. **Q: Should we use AI-generated images, or only illustrations?**
    **A**: Illustrations only. No AI-generated imagery for cultural/authenticity reasons (constitution: Cultural Authenticity principle). Use custom SVG, hand-drawn, or licensed illustration assets only.

31. **Q: What's the brand color palette and logo specification?**
    **A**: Primary palette defined in `globals.css` (oklch values, already correct). Logo: Not specified in scope. Use Wysh wordmark (text-based). Visual identity relies on shadcn/ui theming + festival-specific color extensions.

32. **Q: Are there licensing concerns with current image assets?**
    **A**: Verify all assets have proper licenses (CC0, MIT, or commercial license). Document in `public/ATTRIBUTION.md` if using third-party assets. For MVP: Use only custom or CC0 assets to avoid licensing issues.

---

### Error Handling Clarifications

33. **Q: How should we handle Convex connection errors (offline mode)?**
    **A**: Show error boundary component: "Connection lost. Please check your internet and try again." with retry button. No offline mode (not in scope). Log errors for monitoring. Convex client-side error handling built-in.

34. **Q: What should happen if greeting creation fails mid-process?**
    **A**: Rollback via Convex transaction (built-in). Display error toast: "Greeting creation failed. Please try again." Button re-enabled. User can retry without data loss. Store no partial state.

35. **Q: Should we implement automatic retry logic for failed operations?**
    **A**: Yes, max 3 retries with exponential backoff (1s, 2s, 4s) for transient failures. Fail after 3 attempts and show error to user. Jitter (randomize) retry timing to prevent thundering herd (rate limiter pattern).

36. **Q: How should we communicate errors to users?**
    **A**: Toast notifications + form inline errors. Transient errors (network timeouts): Toast with retry button. Validation errors (form): Inline below input field with red text. Rate limit: Toast with countdown timer. Never silent failures.

---

### Analytics & Monitoring Clarifications

37. **Q: Should we implement analytics tracking (Google Analytics, Plausible, etc.)?**
    **A**: Yes, basic analytics for MVP. Google Analytics (GA4) recommended for cost/feature balance. Track: page views, greeting created (event), greeting shared (event). Privacy: Anonymize, no PII tracking (constitution: Privacy by Design).

38. **Q: Which user actions should be tracked?**
    **A**: (1) Page views (all routes), (2) Greeting created (event with festival type), (3) Greeting shared (event with platform: WhatsApp), (4) Error events (rate limit, network failures). NOT tracked: Individual names, messages, IP addresses (privacy).

39. **Q: Should we track rate limit violations?**
    **A**: Yes, server-side only (not GA). Log violations to monitoring system (error logs) for abuse pattern detection. Include: timestamp, IP, endpoint, violation type. Never expose violation data to users (privacy). Admin-only access.

40. **Q: Do we need error logging/monitoring (Sentry, LogRocket)?**
    **A**: Yes, Sentry recommended for error tracking. Capture: unhandled errors, Convex failures, rate limit violations (server-side). Do NOT log user PII. Enable on production, optional on staging. Budget <$100/month tier sufficient for MVP.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent Visual Experience Across All Screens (Priority: P1)

As a Wysh user, I want the entire application to have a cohesive, professional design that respects my theme preferences (light/dark mode) consistently across all screens, so that the experience feels polished and trustworthy.

**Why this priority**: Visual consistency is the foundation of user trust and perceived quality. Inconsistent colors or broken themes signal a lack of polish and can erode confidence in the platform. This directly impacts user retention and brand perception.

**Independent Test**: Can be fully tested by navigating through all application screens (landing, festival selection, relationship selection, personalization, template selection, success page, greeting view) in both light and dark modes, verifying that all colors use the proper theme variables and transitions are smooth.

**Acceptance Scenarios**:

1. **Given** a user is on any page in light mode, **When** they toggle to dark mode, **Then** all colors, backgrounds, text, and UI components adapt correctly using the dark theme palette without visual glitches.
2. **Given** a user navigates from the landing page through the entire greeting creation flow, **When** they observe the visual design, **Then** all pages use consistent button styles, card layouts, typography, and spacing that follow shadcn/ui standards.
3. **Given** a user is viewing a festival-specific template, **When** the template displays, **Then** festival colors extend (not replace) the shadcn/ui theme, maintaining readability and proper contrast ratios.
4. **Given** a developer inspects the codebase, **When** they search for color usage, **Then** no hardcoded hex values or inline color styles are found outside of festival-specific configuration files.

---

### User Story 2 - Trust Through Social Proof (Priority: P1)

As a potential user visiting the homepage, I want to see social proof that many people have used Wysh successfully, so that I feel confident creating my own greeting.

**Why this priority**: Social proof is critical for converting visitors into users, especially for a new platform. Statistics showing active usage reduce hesitation and demonstrate product viability, directly impacting conversion rates.

**Independent Test**: Can be fully tested by loading the homepage and verifying that a statistics section displays with real-time counts of greetings created, total views, and festivals supported, with animated counters that trigger on scroll into view.

**Acceptance Scenarios**:

1. **Given** a new visitor lands on the homepage, **When** the page loads, **Then** they see a prominent statistics section displaying the total number of greetings created, total views, and supported festivals.
2. **Given** a user scrolls to the statistics section, **When** the section enters the viewport, **Then** the numbers animate from zero to their current values with a smooth counting effect.
3. **Given** the statistics section is loading data, **When** data hasn't loaded yet, **Then** skeleton loaders display in place of the numbers maintaining the layout.
4. **Given** someone creates a new greeting elsewhere, **When** the homepage user refreshes, **Then** the greeting count updates to reflect the new total.

---

### User Story 3 - Protection from Service Abuse (Priority: P1)

As a legitimate user, I want to create greetings without interruption, while the platform prevents abuse that could increase costs or degrade service for everyone.

**Why this priority**: Without rate limiting, the free service is vulnerable to abuse (spam, scrapers, automated attacks) that could make the platform financially unsustainable or cause service degradation for legitimate users. This is essential for production stability.

**Independent Test**: Can be fully tested by attempting to create greetings at different rates and verifying that reasonable usage proceeds normally, while excessive requests receive clear error messages with retry guidance, and limits reset after the appropriate time period.

**Acceptance Scenarios**:

1. **Given** a legitimate user creates 2 greetings in one minute, **When** they submit each request, **Then** both succeed without any rate limit warnings.
2. **Given** a user has created 3 greetings in rapid succession within one minute, **When** they attempt a 4th greeting immediately, **Then** they receive a friendly error message explaining the limit, showing a countdown timer, and suggesting they wait before trying again.
3. **Given** a user hit the rate limit 30 seconds ago, **When** they wait for the countdown to complete and try again, **Then** their request succeeds normally.
4. **Given** malicious activity is detected from an IP address, **When** that IP makes requests, **Then** the system logs the violation for monitoring without affecting other users.

---

### User Story 4 - Discoverable Through Search Engines (Priority: P2)

As a user searching for "create diwali greeting card", I want to find Wysh in top search results with a clear, compelling preview, so that I can quickly discover and use the platform.

**Why this priority**: Organic search traffic is critical for sustainable growth. Without proper SEO, the platform remains invisible to the majority of potential users actively searching for the solution it provides.

**Independent Test**: Can be fully tested by inspecting page metadata (title, description, Open Graph tags), validating sitemap and robots.txt files, checking structured data, and verifying that shared greeting links display rich previews on WhatsApp, Twitter, and Facebook.

**Acceptance Scenarios**:

1. **Given** a greeting has been created and shared, **When** the shareable link is posted on WhatsApp, **Then** a rich preview appears showing the sender's name, festival type, and a visual preview image with proper dimensions (1200x630).
2. **Given** a search engine crawler visits the homepage, **When** it parses the metadata, **Then** it finds unique, descriptive title and description tags, proper heading hierarchy (single H1, logical H2-H6), and structured JSON-LD data identifying the site type.
3. **Given** a user shares a greeting link on Twitter, **When** Twitter fetches the Open Graph data, **Then** it displays a Twitter Card with summary_large_image, showing the personalized greeting preview and sender information.
4. **Given** a search engine requests the sitemap, **When** it accesses /sitemap.xml, **Then** it receives a valid XML file listing all public routes except API endpoints and private greeting pages.

---

### User Story 5 - Fast and Responsive Experience (Priority: P2)

As a user on a mid-range mobile device with 4G connection, I want Wysh to load quickly and provide clear feedback for every action, so that I never wonder if something is loading or broken.

**Why this priority**: Performance directly impacts user satisfaction, conversion rates, and SEO rankings. Slow-loading pages cause abandonment, especially on mobile devices where most users access the application.

**Independent Test**: Can be fully tested by running Lighthouse audits, measuring Core Web Vitals (LCP, FID, CLS), monitoring page load times on simulated 4G connections, and verifying that all async operations show appropriate loading states.

**Acceptance Scenarios**:

1. **Given** a user visits the homepage on a 4G mobile connection, **When** the page loads, **Then** the First Contentful Paint occurs within 1.5 seconds and the Largest Contentful Paint within 2.5 seconds.
2. **Given** a user is viewing a greeting list that's loading from the database, **When** data is being fetched, **Then** skeleton loaders appear matching the exact layout of the actual content to prevent layout shifts.
3. **Given** a user clicks "Create Greeting" button, **When** the form is processing, **Then** the button shows a loading spinner, becomes disabled, and displays "Creating..." text.
4. **Given** a user navigates between pages, **When** page transitions occur, **Then** loading states appear smoothly without blank screens or content flashing.

---

### User Story 6 - Optimized Mobile Experience (Priority: P2)

As a mobile user, I want Wysh to work perfectly on my phone with easy-to-tap buttons and fast loading, so that I can create greetings on-the-go without frustration.

**Why this priority**: The majority of users access greeting platforms from mobile devices, especially when sharing during festivals. A poor mobile experience directly translates to lost users and negative reviews.

**Independent Test**: Can be fully tested by using real mobile devices (iPhone SE, Android mid-range) to navigate the entire flow, verifying touch target sizes, tap feedback, scroll smoothness, animation performance, and layout responsiveness at various screen widths (320px to 768px).

**Acceptance Scenarios**:

1. **Given** a user on a 320px wide device (iPhone SE), **When** they view any page, **Then** all content fits within the viewport without horizontal scrolling, text is readable at minimum 16px font size, and buttons are at least 44x44px tap targets.
2. **Given** a user on a mobile device taps a button, **When** the tap occurs, **Then** they receive immediate visual feedback (active state or ripple effect) confirming their action.
3. **Given** a user views a template animation on a mid-range Android device, **When** the animation plays, **Then** it maintains 60fps throughout with reduced particle counts compared to desktop.
4. **Given** a user fills out a form on mobile, **When** they focus on input fields, **Then** the mobile keyboard appears without causing layout shifts or hiding the active input.

---

### User Story 7 - Unique and Authentic Festival Templates (Priority: P3)

As a creator, I want each festival template to look authentic and unique, so that my greeting truly represents the festival's spirit and my recipient feels the cultural connection.

**Why this priority**: Cultural authenticity differentiates Wysh from generic greeting platforms. Unique templates ensure users don't feel they're receiving duplicate or generic content, enhancing emotional impact and shareability.

**Independent Test**: Can be fully tested by reviewing each festival template for visual distinctiveness, cultural accuracy, relationship context implementation, animation smoothness, and consistency with the design system.

**Acceptance Scenarios**:

1. **Given** a user creates a Diwali greeting, **When** they view the template, **Then** it displays culturally authentic symbols (diyas, rangoli), uses gold/orange festival colors that extend shadcn/ui theme variables, and includes smooth animations running at 60fps.
2. **Given** a user selects the "parents" relationship context for Holi, **When** the greeting renders, **Then** the colors are warm and vibrant, animation pacing is respectful, and message tone is affectionate but respectful.
3. **Given** a developer compares all festival templates, **When** they analyze the designs, **Then** each template is visually distinct with unique layouts, animation patterns, and symbol usage (not just color swaps).
4. **Given** a user views a greeting on a mobile device, **When** the animation plays, **Then** the template maintains its visual quality and animations remain smooth regardless of screen size.

---

### User Story 8 - Accessible to All Users (Priority: P3)

As a user with disabilities, I want to navigate Wysh using only my keyboard and screen reader, so that I can create and share greetings independently.

**Why this priority**: Accessibility is both a legal requirement and moral imperative. Making the platform accessible expands the potential user base and ensures compliance with WCAG standards, reducing legal risk.

**Independent Test**: Can be fully tested by navigating the entire application using only keyboard controls, testing with screen readers (NVDA, VoiceOver), verifying color contrast ratios with automated tools, and checking reduced motion preferences.

**Acceptance Scenarios**:

1. **Given** a keyboard-only user navigates the site, **When** they press Tab, **Then** focus moves through all interactive elements in a logical order with visible focus indicators (ring outline).
2. **Given** a screen reader user encounters a button, **When** the screen reader announces the element, **Then** it provides clear, descriptive labels (e.g., "Share greeting on WhatsApp" not just "Share").
3. **Given** a user with prefers-reduced-motion enabled, **When** they view a greeting, **Then** animations are simplified to static or fade-in transitions instead of complex particle effects.
4. **Given** a user checks text color contrast, **When** they use a contrast checker tool, **Then** all text meets WCAG AA standards with minimum 4.5:1 ratio for body text and 3:1 for large text.

---

### Edge Cases

- What happens when the rate limit data store is temporarily unavailable during a greeting creation request?
- How does the system handle a user trying to view a greeting while the Open Graph image generation fails?
- What occurs when a user lands on the homepage and the statistics query returns zero or fails?
- How does dark mode transition work mid-animation on a greeting page?
- What happens when a mobile keyboard covers form validation messages during input?
- How does the system behave when a user tries to share a greeting on a platform not yet supported with metadata?
- What occurs when animation performance drops below 30fps on older mobile devices?
- How does the application handle a user with JavaScript disabled?
- What happens when a user's theme preference conflicts with festival-specific color requirements?
- How does the system respond to a user rapidly switching between light and dark modes?

## Requirements *(mandatory)*

### Functional Requirements

#### Theme Consistency and shadcn/ui Compliance

- **FR-001**: System MUST use shadcn/ui CSS variables exclusively for all color definitions across all pages and components (background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring variants).
- **FR-002**: System MUST eliminate all hardcoded hex color values, RGB values, and inline color styles from components except within festival-specific theme configuration files that extend the base theme.
- **FR-003**: System MUST support both light and dark modes seamlessly across all routes with instant theme switching using CSS variables.
- **FR-004**: System MUST apply consistent component patterns: Button variants (default, destructive, outline, secondary, ghost, link), Card components (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter), and Form components (Input, Select, Textarea) from shadcn/ui library.
- **FR-005**: System MUST maintain consistent spacing (using Tailwind's 4, 6, 8, 12, 16, 24, 32, 48, 64 scale), typography (H1: text-3xl font-bold, H2: text-2xl font-semibold, H3: text-xl font-semibold, body: text-base, small: text-sm), and border-radius (using shadcn/ui CSS variables).
- **FR-006**: Festival-specific color schemes MUST extend shadcn/ui theme variables rather than replace them, maintaining proper contrast ratios and readability in both light and dark modes.

#### Homepage Statistics

- **FR-007**: System MUST display a statistics section on the homepage showing total greetings created, total views across all greetings, and number of supported festivals.
- **FR-008**: Statistics MUST animate with a counting effect when the section enters the viewport for the first time during a page visit.
- **FR-009**: System MUST fetch statistics data from the backend (total greeting count via database query, total view count via sum aggregation).
- **FR-010**: System MUST display skeleton loading placeholders matching the stats layout while data is being fetched.
- **FR-011**: System MUST handle statistics query failures gracefully by hiding the section with error logged to console without breaking the page layout.
- **FR-012**: Statistics section MUST be responsive: single column on mobile (≤640px), two columns on tablet (640px-1024px), three columns on desktop (≥1024px).

#### Rate Limiting and Abuse Prevention

- **FR-013**: System MUST implement IP-based rate limiting for greeting creation operations without requiring user authentication.
- **FR-014**: System MUST enforce configurable multi-tier rate limits: maximum 3 greetings per minute, 20 greetings per hour, and 50 greetings per day per IP address.
- **FR-015**: System MUST extract the real client IP address from request headers (checking x-forwarded-for, x-real-ip, cf-connecting-ip in that order) when deployed on Vercel.
- **FR-016**: Rate limit configuration values MUST be externalized via environment variables or database settings for runtime adjustment without code changes.
- **FR-017**: System MUST return HTTP 429 (Too Many Requests) status code when rate limits are exceeded, including Retry-After header indicating when the client can retry.
- **FR-018**: System MUST provide user-friendly error messages when rate limits are hit, including: current limit explanation, countdown timer showing when they can retry, and educational message about why limits exist.
- **FR-019**: System MUST log all rate limit violations with timestamp, IP address, endpoint, and request details for monitoring and abuse pattern detection.
- **FR-020**: System MUST implement separate rate limits for greeting viewing (100 views per minute per IP) to prevent scraping while allowing legitimate sharing.
- **FR-021**: Rate limiting implementation MUST use a sliding window or token bucket algorithm to allow reasonable burst traffic while maintaining overall limits.

#### SEO and Metadata Optimization

- **FR-022**: Every route MUST have unique, descriptive metadata (title, description) using Next.js Metadata API with appropriate character limits (title 50-60 chars, description 150-160 chars).
- **FR-023**: Homepage MUST include comprehensive metadata: title "Wysh - Create Beautiful Personalized Festival Greetings | Free", relevant keywords, and Open Graph image.
- **FR-024**: Greeting view pages (app/g/[id]/page.tsx) MUST generate dynamic metadata using generateMetadata function, including sender name, festival type, and personalized preview text.
- **FR-025**: System MUST implement Open Graph tags for all shareable pages, including og:title, og:description, og:image (1200x630 resolution), og:type, og:url, and og:site_name.
- **FR-026**: System MUST implement Twitter Card metadata (twitter:card as summary_large_image, twitter:title, twitter:description, twitter:image) for optimal Twitter sharing.
- **FR-027**: System MUST generate a sitemap.xml file listing all public routes (homepage, creation flow pages) while excluding API routes and individual greeting pages.
- **FR-028**: System MUST provide a robots.txt file allowing crawling of public pages while disallowing /api/* and /g/* paths to protect user privacy.
- **FR-029**: System MUST implement proper heading hierarchy on every page: single H1 per page, logical H2-H6 structure, no skipped levels.
- **FR-030**: All images MUST include descriptive alt text, and decorative images must have empty alt="" attributes.
- **FR-031**: System MUST implement JSON-LD structured data for homepage: WebSite schema with SearchAction, Organization schema with brand information.
- **FR-032**: System MUST set canonical URLs on all pages to prevent duplicate content issues.
- **FR-033**: System MUST include meta viewport tag, theme-color meta tag, and language declaration (lang="en") in the HTML head.

#### Loading States and Performance

- **FR-034**: Every asynchronous data fetch operation MUST display skeleton loaders that match the final content layout to prevent Cumulative Layout Shift.
- **FR-035**: All button actions that trigger async operations MUST show loading state: disabled state, loading spinner icon, and updated button text (e.g., "Creating..." instead of "Create").
- **FR-036**: Route segments MUST implement loading.tsx files for automatic loading UI during navigation.
- **FR-037**: Form submissions MUST disable the entire form and show loading indicators while processing.
- **FR-038**: Images MUST use Next.js Image component with proper width, height, blur placeholders, and priority loading for above-the-fold images.
- **FR-039**: System MUST lazy load festival template components using dynamic imports with loading fallback components.
- **FR-040**: System MUST implement code splitting at route level and component level for heavy UI elements (modals, dialogs, animation libraries).
- **FR-041**: System MUST use React.memo for expensive components, useMemo for expensive calculations, and useCallback for event handlers to prevent unnecessary re-renders.
- **FR-042**: Convex queries MUST use stable query patterns to prevent flashing between undefined and loaded states.
- **FR-043**: System MUST compress all images to WebP/AVIF formats with JPEG/PNG fallbacks, maximum 128KB per asset.
- **FR-044**: System MUST minimize JavaScript bundle size: initial load <300KB, use tree-shaking, and optimize package imports.

#### Mobile-First Optimization

- **FR-045**: System MUST be designed and built mobile-first, starting with 320px viewport width (iPhone SE, small Android) with progressive enhancement for larger screens.
- **FR-046**: All interactive elements (buttons, links, tap targets) MUST be minimum 44x44 pixels for touch accessibility.
- **FR-047**: Base font size MUST be minimum 16px to prevent iOS automatic zoom on input focus.
- **FR-048**: System MUST use mobile-appropriate navigation patterns: hamburger menu or bottom sheet for mobile, expanded nav for desktop.
- **FR-049**: Form inputs MUST use proper input types (email, tel, url) and autocomplete attributes for optimal mobile keyboard support.
- **FR-050**: System MUST prevent layout shifts when mobile keyboard appears by using proper viewport calculations.
- **FR-051**: System MUST reduce animation complexity on mobile: 50% fewer particles, simpler effects, prioritizing 60fps performance over visual complexity.
- **FR-052**: All gestures MUST provide immediate feedback: active states on tap, visual confirmation of swipe gestures.
- **FR-053**: System MUST support both portrait and landscape orientations without breaking layouts.
- **FR-054**: System MUST prevent horizontal scrolling on any screen size from 320px to 2560px width.

#### Template Quality and Validation

- **FR-055**: Each festival template MUST have a unique visual identity distinct from other templates, not just color variations.
- **FR-056**: Festival templates MUST use culturally authentic symbols and motifs appropriate to each celebration.
- **FR-057**: Templates MUST implement relationship context to adjust colors, animation intensity, and message tone based on recipient relationship.
- **FR-058**: All animations MUST run smoothly at 60fps on mid-range Android devices (tested on devices with Snapdragon 600 series or equivalent).
- **FR-059**: Template animations MUST respect prefers-reduced-motion media query, providing static or simple fade-in alternatives.
- **FR-060**: Templates MUST use shadcn/ui CSS variables for base theming, with festival-specific colors implemented as extensions.
- **FR-061**: All template text (recipient name, message) MUST meet WCAG AA contrast ratios: 4.5:1 for body text, 3:1 for large text.

#### Accessibility

- **FR-062**: System MUST support full keyboard navigation with logical tab order through all interactive elements.
- **FR-063**: All focusable elements MUST display visible focus indicators using shadcn/ui ring styles (ring-2 ring-ring ring-offset-2).
- **FR-064**: All interactive elements without visible text MUST include aria-label attributes with descriptive labels.
- **FR-065**: Dynamic content changes MUST use aria-live regions to announce updates to screen readers.
- **FR-066**: Modal dialogs MUST trap focus within the dialog while open and return focus to the trigger element on close.
- **FR-067**: Escape key MUST close open modals and dialogs.
- **FR-068**: All form inputs MUST have associated labels with proper for/id relationships or aria-labelledby attributes.
- **FR-069**: Color contrast MUST meet WCAG AA standards: 4.5:1 for normal text, 3:1 for large text and UI components.
- **FR-070**: System MUST respect prefers-reduced-motion preference, disabling complex animations and providing simple alternatives.

### Key Entities

- **Rate Limit Record**: Tracks request counts per IP address with time windows, remaining quota, reset timestamps, and violation counts. Includes metadata for IP address, endpoint accessed, and algorithm parameters (window size, token count).

- **Statistics Aggregate**: Represents platform-wide metrics including total greeting count, total view count, greetings created per festival type, and date of last update. Computed from greeting and view count data across all greetings.

- **SEO Metadata Configuration**: Defines page-specific metadata including title templates, description templates, Open Graph image URLs, Twitter Card types, structured data schemas, and canonical URL patterns. Varies per route type (static vs dynamic).

- **Performance Budget**: Defines maximum allowable metrics for page loads including bundle size limits, LCP threshold, FID threshold, CLS threshold, image size limits, and lighthouse score minimums. Used for automated performance testing.

- **Accessibility Test Case**: Represents specific accessibility requirements including WCAG level (AA), success criterion number, test description, validation method, and pass/fail status. Used for compliance tracking.

## Success Criteria *(mandatory)*

### Measurable Outcomes

#### Visual Consistency and Theme

- **SC-001**: 100% of color usage across all pages uses shadcn/ui CSS variables with zero hardcoded hex/RGB values in production code (verified via automated code scanning).
- **SC-002**: Theme switching between light and dark modes completes in under 100ms with zero visual flicker or layout shifts.
- **SC-003**: All pages pass manual visual inspection in both light and dark modes with consistent component styling and proper color contrast.

#### User Engagement and Trust

- **SC-004**: Homepage statistics section displays correctly with accurate data on 100% of page loads within 500ms.
- **SC-005**: Animated counter effect triggers reliably when scrolling statistics into viewport on 99% of user sessions.
- **SC-006**: 90% of first-time visitors scroll to view the statistics section, indicating effective placement and visual appeal.

#### Service Reliability and Security

- **SC-007**: Rate limiting successfully blocks 100% of requests exceeding configured limits without false positives blocking legitimate users.
- **SC-008**: Zero successful abuse attempts result in service degradation or cost overruns after rate limiting implementation.
- **SC-009**: 95% of users who hit rate limits successfully retry after the cooldown period without contacting support.
- **SC-010**: Average rate limit false positive rate remains below 0.1% of legitimate traffic.

#### Search Engine Visibility

- **SC-011**: All pages have unique metadata with 100% of pages including required Open Graph and Twitter Card tags (verified via automated testing).
- **SC-012**: Shared greeting links display rich previews correctly on WhatsApp, Twitter, and Facebook in 98% of share attempts.
- **SC-013**: Google Search Console reports zero indexing errors for public pages within 30 days of deployment.
- **SC-014**: Organic search traffic increases by 50% within 90 days of SEO optimization deployment.
- **SC-015**: Homepage achieves top 10 search ranking for at least 3 target keywords within 6 months.

#### Performance and Load Times

- **SC-016**: Homepage achieves Lighthouse Performance score above 90 on mobile and above 95 on desktop.
- **SC-017**: First Contentful Paint occurs within 1.5 seconds for 90% of mobile users on 4G connections.
- **SC-018**: Largest Contentful Paint occurs within 2.5 seconds for 95% of all page loads.
- **SC-019**: Cumulative Layout Shift remains below 0.1 for 95% of page loads.
- **SC-020**: First Input Delay remains below 100ms for 98% of user interactions.
- **SC-021**: Total JavaScript bundle size for initial page load remains below 300KB compressed.
- **SC-022**: Zero instances of blank screens or content flashing during navigation between pages.

#### Mobile Experience

- **SC-023**: 95% of mobile users successfully complete the greeting creation flow without encountering usability issues.
- **SC-024**: All interactive elements pass touch target size validation (minimum 44x44px) on screens from 320px to 768px width.
- **SC-025**: Template animations maintain 60fps on 90% of mid-range Android devices tested.
- **SC-026**: Mobile task completion time is within 15% of desktop task completion time for creating greetings.

#### Template Quality

- **SC-027**: User surveys indicate 90% satisfaction with template authenticity and cultural appropriateness across all festivals.
- **SC-028**: Each festival template receives positive visual uniqueness ratings from 85% of users who view multiple templates.
- **SC-029**: Template animations achieve 60fps on 95% of target devices during performance testing.

#### Accessibility Compliance

- **SC-030**: 100% of pages pass WCAG 2.1 Level AA automated accessibility testing.
- **SC-031**: All color combinations meet minimum contrast ratios: 4.5:1 for normal text, 3:1 for large text.
- **SC-032**: Manual keyboard navigation successfully reaches and activates 100% of interactive elements across all pages.
- **SC-033**: Screen reader testing validates clear and descriptive labels for 100% of interactive elements.
- **SC-034**: Zero user complaints related to accessibility barriers in the first 90 days after launch.

## Assumptions *(optional)*

### Infrastructure and Deployment

- Application is deployed on Vercel with serverless functions and edge runtime capabilities.
- Convex backend is already configured and operational with existing schema for greetings and festivals.
- DNS and domain configuration are already in place for production deployment.
- SSL/TLS certificates are managed automatically by Vercel.

### Technology Stack

- Next.js 15+ App Router is the current framework version.
- shadcn/ui components are already integrated with cssVariables mode enabled.
- Tailwind CSS is configured with proper content paths and shadcn/ui theme integration.
- GSAP or Framer Motion is available for animations (will use existing library from templates).

### Rate Limiting Implementation

- Upstash Redis or similar key-value store is available for rate limit data storage (recommended approach).
- Alternative: Convex database can be used for rate limiting if external store is not preferred.
- Vercel Edge Runtime supports necessary request header access for IP extraction.
- Cookie-based fallback for rate limit tracking is acceptable for clients behind shared IPs.

### SEO and Open Graph

- Dynamic Open Graph image generation via API route is feasible using next/og or similar library.
- Image generation API supports text rendering with custom fonts for greeting previews.
- Vercel ISR (Incremental Static Regeneration) is available for optimal sitemap generation.
- Google Search Console and Bing Webmaster Tools accounts are available for sitemap submission.

### Performance Optimization

- Existing template components can be refactored for code splitting without breaking functionality.
- Current animation libraries (GSAP) support tree-shaking and selective imports.
- Vercel Analytics or similar tool is available for Core Web Vitals monitoring in production.
- WebP and AVIF format support is acceptable across target browser versions (95%+ modern browsers).

### Mobile and Device Support

- Target devices include: iPhone SE (320px width minimum), iPhone 14/15, mid-range Android (Snapdragon 600 series or equivalent), Samsung Galaxy A series.
- Browser support: Chrome, Safari, Firefox, Edge latest 2 versions (covers 95%+ of users).
- Minimum iOS version: iOS 14+, Minimum Android version: Android 9+.

### Accessibility

- Screen reader testing will primarily use NVDA (Windows), VoiceOver (Mac/iOS), TalkBack (Android).
- Automated accessibility testing will use axe-core or similar WCAG validation tools.
- Manual accessibility testing will be conducted by QA team or accessibility consultant.

### Cultural and Content

- Festival template content and symbols are already culturally accurate and appropriate.
- No additional legal review is required for cultural representation.
- Existing relationship context definitions (family, friends, professional, romantic, boss, parents, etc.) are comprehensive.

### Scope Boundaries

- User authentication system is explicitly out of scope (all greetings remain public).
- Payment processing and premium features are out of scope.
- Native mobile app development is out of scope (web app only).
- Email/SMS delivery of greetings is out of scope (WhatsApp sharing only).
- Multi-language support is out of scope (English only).
- A/B testing infrastructure is out of scope (manual variant testing acceptable).

## Out of Scope *(optional)*

### Explicitly Excluded from This Feature

The following items are **explicitly not included** in this enhancement and should not be implemented:

- **User authentication system**: All greetings remain public by shareable link. No login, signup, or user accounts.
- **User dashboards**: No "My Greetings" list, no greeting management interface, no user profiles.
- **Payment processing**: No premium templates, no paid features, no subscription system.
- **Native mobile apps**: Web application only (iOS/Android native apps excluded).
- **Email/SMS delivery**: WhatsApp sharing only. No email greeting delivery, no SMS notifications.
- **Photo uploads**: Text-only personalization. No user-uploaded images in greetings.
- **Greeting deletion**: Indefinite retention of all greetings. No user-initiated deletion.
- **Analytics dashboard**: No user-facing analytics. Internal metrics only.
- **A/B testing infrastructure**: No automated variant testing system (manual testing acceptable).
- **Multi-language support**: English language only. No i18n implementation.
- **Advanced template customization**: No template builder, no font selection, no layout editing by users.
- **Social media auto-posting**: Manual sharing only. No direct posting to Facebook, Twitter, Instagram.
- **Calendar integration**: No automatic festival reminders or scheduled sending.
- **Contact book integration**: Manual recipient name entry only. No address book import.
- **Video greetings**: Static and animated images only. No video templates or uploads.
- **Music or audio**: Silent greetings only. No background music, no voice messages.
- **Collaborative greetings**: Single creator only. No group greeting creation.
- **Greeting analytics for users**: Users cannot see view counts or analytics for their greetings.
- **Custom domain for greetings**: All greetings use wysh.zealer.in domain. No custom branding.
- **API for third-party integrations**: No public API for external services to create greetings.

### May Be Considered for Future Phases

The following items are **out of scope** for this phase but may be considered in future enhancements:

- Progressive Web App (PWA) features with offline capability and install prompts.
- Advanced rate limiting with CAPTCHA challenge for suspicious activity.
- Internationalization (i18n) support for Hindi, Tamil, Telugu, and other Indian languages.
- User accounts with optional greeting history and favorites.
- Template preview before personalization in the creation flow.
- Greeting expiration feature allowing creators to set time limits.
- Additional sharing platforms: Facebook Messenger, Telegram, Instagram Stories.
- Remix feature allowing users to customize existing greetings with new names/messages.
- Trending greetings showcase on homepage based on view counts.
- Creator attribution for popular greeting templates.
- Downloadable greeting cards in PNG or PDF format.
- Accessibility features beyond WCAG AA (e.g., sign language videos).
