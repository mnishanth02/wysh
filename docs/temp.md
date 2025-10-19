speckit.clarify

Clarify underspecified areas in the Wysh production enhancement specification:

SHADCN/UI CONSISTENCY:

What specific pages or components currently have the most color inconsistencies?

Are there any custom color schemes that should be preserved (e.g., festival-specific accent colors)?

Should festival themes override shadcn/ui primary colors, or extend them?

Are there any third-party components that might not be compatible with shadcn/ui theming?

HOMEPAGE STATS:

Should the stats counter animate every time the section comes into viewport, or only once per session?

What should be the fallback if Convex query fails? Hide section or show static placeholder?

Should stats update in real-time as new greetings are created (subscription), or on page reload only?

Are there privacy concerns with displaying total greeting count publicly?

RATE LIMITING:



Should rate limit errors be shown as toast notifications, modal dialogs, or inline errors?

Do we need CAPTCHA integration after repeated rate limit violations?

Should there be a "whitelist" mechanism for trusted IPs (e.g., demo purposes)?

What should happen to greetings created just before user hits rate limit?

SEO:

Should greeting view pages (/ g/[id]) be indexed by search engines, or set to noindex for privacy?

What is the target audience geography for SEO keywords (India-focused, or global)?

Should we implement hreflang tags for multi-language support (future consideration)?

Are there specific keywords or search terms we want to rank for?

PERFORMANCE:

What is the acceptable Lighthouse score target (mobile and desktop)?

Should we implement service worker for offline support or PWA features?

What is the maximum acceptable bundle size for initial page load?

Should animations automatically reduce quality on low-end devices, or require user toggle?

MOBILE OPTIMIZATION:

What is the minimum supported device year/model (e.g., 2020+ devices)?

Should we detect device performance and adapt animation quality automatically?

Are there specific mobile browsers we need to support (UC Browser, Opera Mini)?

Should we implement specific optimizations for iOS vs Android?

TEMPLATES:

Are any festival templates currently incomplete or broken?

Do all templates follow the relationship context pattern correctly?

Are there any templates that need cultural review before production?

Should each template have multiple variants (e.g., "Traditional" vs "Modern" Diwali)?

IMAGES & ASSETS:

What is the source for festival icons (custom design, icon library, or to be created)?

Should we use AI-generated images for any sections, or only illustrations?

What is the brand color palette and logo specification?

Are there any licensing concerns with current image assets?

ERROR HANDLING:

How should we handle Convex connection errors (offline mode)?

What should happen if greeting creation fails mid-process?

Should we implement automatic retry logic for failed operations?

How should we communicate errors to users (toast, modal, inline)?

ANALYTICS & MONITORING:

Should we implement analytics tracking (Google Analytics, Plausible, etc.)?

What user actions should be tracked (page views, greeting creates, shares)?

Should we track rate limit violations for abuse monitoring?

Do we need error logging/monitoring (Sentry, LogRocket)?