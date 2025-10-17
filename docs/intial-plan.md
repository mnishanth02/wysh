## Project Brainstorming: Personalized Festival Greeting Web App

### Suggested Project Names

Based on your concept of context-aware, animated greetings for Indian festivals, here are some name suggestions:

**Top Recommendations:**
- **Sanskar** (सस्कार) - Meaning "tradition/culture", simple and memorable
- **Shubh** (शुभ) - Meaning "auspicious", perfect for celebrations
- **Ritu** (ऋतु) - Meaning "season/occasion", covers all festivals
- **Tyohar** (त्यौहार) - Meaning "festival", direct and relatable
- **Namaskar** - Combines tradition with greeting context
- **Maitri** (मैत्री) - Meaning "friendship", emphasizes connection

**My Pick: Sanskar or Shubh** - Both are short, culturally resonant, easy to spell, and have good domain availability potential.

***

## MVP (Minimum Viable Product) - Simple & Focused[1][2][3]

### Core Features

**1. Festival Selection**
- Dropdown/grid of popular Indian festivals:[4][5][6]
  - Diwali, Holi, Raksha Bandhan, Ganesh Chaturthi
  - Eid, Christmas, New Year
  - Republic Day, Independence Day
  - Regional festivals (Pongal, Onam, Baisakhi)
- Simple category filtering (Religious, National, Cultural)

**2. Relationship Context Engine** (The Differentiator)[7][8]
- When creating greeting, user selects recipient relationship:
  - **Family**: Parents, Siblings, Spouse, Children, Extended Family
  - **Friends**: Close Friend, Colleague-Friend, School/College Friend
  - **Professional**: Boss, Colleague, Client, Business Partner
  - **Romantic**: Partner, Crush

**Context determines:**
- Visual style (formal vs playful)[9][10][11]
- Animation intensity (subtle for professional, vibrant for friends)
- Color palette selection based on festival + relationship
- Default message tone (respectful vs casual)

**3. Visual Generation**[3][12][13]
- **3-4 pre-designed animated templates per festival**
- Each template has relationship variants (color/animation tweaks)
- Built with GSAP/Framer Motion for smooth animations[14][15]
- Key elements:
  - Festival-appropriate colors (Diwali: orange/gold, Holi: vibrant multi-color)[10][16][9]
  - Cultural symbols (diyas, rangoli, flowers, fireworks)
  - Text overlay area
  - Subtle particle effects or parallax scrolling[14]

**4. Personalization**[17][12]
- Recipient name input
- Sender name input
- Optional: Add custom message (150 character limit for MVP)
- System generates contextual message if user skips

**5. Share Functionality**[2][18][19][17]
- Generate unique shareable link
- **WhatsApp direct share** (primary)[19][20][21]
- Copy link button
- Preview before sharing
- Mobile-responsive viewer page

***

## Technical Architecture

### Frontend: Next.js + React[22][23][24]

```
/app
  /(auth)           - Optional for enhancements
  /create           - Greeting creation flow
  /preview/[id]     - View shared greeting
  /api              - API routes if needed

/components
  /ui               - ShadCN components
  /greeting         - Card templates
  /animations       - GSAP/Framer Motion wrappers
```

**Key Libraries:**
- **GSAP** for timeline-based animations[15][25][14]
- **Framer Motion** for scroll triggers and gesture animations[14]
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **Next.js Image** for optimized festival assets

### Backend: Convex Database[23][24][26][22]

**Schema Design:**

```typescript
// greetings table
{
  festivalType: string,       // "diwali", "holi", etc.
  relationshipType: string,   // "parent", "friend", etc.
  recipientName: string,
  senderName: string,
  customMessage?: string,
  templateId: string,         // which design template used
  shareableId: string,        // unique URL identifier
  viewCount: number,
  createdAt: timestamp,
  // For future enhancements
  userId?: Id<"users">,
}

// festivals table (reference data)
{
  name: string,
  displayName: string,
  category: string,
  colorPalette: array,
  defaultSymbols: array,
  season: string,
}
```

**Convex Functions:**[22][23]
- `createGreeting` (mutation) - Save new greeting
- `getGreeting` (query) - Fetch by shareableId
- `incrementViewCount` (mutation) - Track views
- `getFestivals` (query) - Get festival list

**Best Practices Applied:**[26][22]
- Use indexes for shareableId lookups
- Avoid `.filter()` on large queries
- Implement proper error handling
- Use internal functions for sensitive operations

***

## MVP User Flow

### Creator Flow (Mobile-First)[2][3][17]

1. **Landing Page**
   - "Create Your Festival Greeting"
   - Show sample animated cards (auto-playing)
   - CTA button

2. **Festival Selection**
   - Visual grid with festival cards
   - Each shows representative color/icon

3. **Relationship Selection**
   - Icon-based selection grid
   - Brief description per category

4. **Personalization Form**
   - Recipient name
   - Your name
   - Optional: Custom message
   - Real-time preview updates below

5. **Template Selection**
   - 3-4 animated options
   - Preview plays on tap
   - Shows how it looks with their data

6. **Generate & Share**
   - Processing animation (1-2 seconds)
   - Success screen with:
     - Preview button
     - WhatsApp share button (primary)[20][19]
     - Copy link button
     - "Create Another" button

### Recipient Flow[17][2]

1. **Opens shared link** (from WhatsApp)[18][27]
2. **Animated greeting loads**
   - Auto-plays once
   - Shows personalized message
   - Festival-appropriate music/sound (optional toggle)
3. **Call-to-action at end**
   - "Create Your Own Greeting" button
   - Drives user acquisition

***

## Animation Strategy (GSAP + Framer Motion)[15][14]

### Card Entry Animation (GSAP)[14]
```javascript
// Example: Diwali card with diyas
gsap.timeline()
  .from('.diya', {
    scale: 0,
    rotation: 360,
    stagger: 0.1,
    duration: 0.8,
    ease: 'back.out'
  })
  .from('.text-name', {
    opacity: 0,
    y: 50,
    duration: 0.5
  })
  .to('.particles', {
    opacity: 1,
    y: -100,
    duration: 2,
    stagger: 0.05
  });
```

### Scroll-Based Effects (Framer Motion)[14]
```javascript
// For longer greeting cards
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  {/* Greeting content */}
</motion.div>
```

**Keep It Simple for MVP:**
- 1 main animation sequence per card (5-8 seconds)
- No complex parallax for MVP
- Focus on smooth, delightful micro-interactions

***

## Enhancements (Post-MVP)

### Phase 2: User Accounts & History
- Save created greetings[28]
- View analytics (who opened your greeting)
- Re-share previous greetings
- Favorite templates

### Phase 3: Advanced Personalization[29][30][7]
- **AI-powered message generation**[31][32][29]
  - Based on festival + relationship context
  - Multiple tone options (formal, funny, heartfelt)
- **Photo upload** for personalized cards[12][2]
- **Voice message attachment**[17]
- **Video greetings** (recorded or template-based)

### Phase 4: Social & Community[28]
- Template marketplace (user-created designs)
- Most popular greetings feed
- Trending festivals countdown
- Group greeting cards (multiple people contribute)

### Phase 5: Premium Features
- **Custom branding** for businesses[33][1]
  - Add company logo to greetings
  - Bulk corporate greeting creation
  - Employee/client databases integration
- **Advanced animations**
  - 3D effects
  - Custom music upload
  - Longer video-style greetings
- **Scheduling** (send greetings at specific time)[34][17]
- **Reminder system** for upcoming festivals[1]

### Phase 6: Monetization
- **Freemium Model:**
  - Free: 5 greetings/month, basic templates
  - Premium: Unlimited greetings, all templates, no watermark, analytics
- **Business Plans:** Bulk creation, team collaboration
- **Template Sales:** Allow creators to sell custom templates

***

## Design Considerations

### Color Strategy[11][16][9][10]

**Festival Color Palettes:**

| Festival | Primary Colors | Symbolism |
|----------|---------------|-----------|
| Diwali | Orange, Gold, Red | Prosperity, celebration, divine light[16] |
| Holi | Pink, Yellow, Blue, Green, Purple | Joy, love, friendship, rebirth[10] |
| Eid | Green, Gold, White | Peace, prosperity, purity[35] |
| Christmas | Red, Green, Gold | Love, life, royalty |
| Raksha Bandhan | Red, Yellow | Love, protection[36] |
| Ganesh Chaturthi | Orange, Yellow, Red | Devotion, new beginnings[11] |

**Relationship-Based Adjustments:**[8]
- **Professional:** Muted tones, minimal animation
- **Family:** Traditional, warm colors
- **Friends:** Vibrant, playful combinations
- **Romantic:** Softer pastels, elegant animations

### Typography
- Primary: Inter or Poppins (modern, readable)
- Festival-specific: Devanagari fonts for Hindi text
- Avoid overly decorative fonts for MVP

### Mobile-First Approach[3][18]
- **WhatsApp is primarily mobile**[27][18][20]
- Design cards in 9:16 (story format) or 1:1 (square)
- Optimize animations for mobile performance
- Keep file sizes under 2MB for fast loading

***

## Development Roadmap

### Week 1-2: Foundation
- Set up Next.js + Convex project[24][37][23]
- Create database schema
- Build basic UI with Tailwind
- Implement festival selection flow

### Week 3-4: Core Features
- Build 2-3 festival templates (Diwali, Holi, Generic)
- Implement GSAP animations[15][14]
- Create relationship context selector
- Form handling and validation

### Week 5-6: Sharing & Polish
- Generate shareable links
- WhatsApp share integration[21][19][20]
- Recipient viewing page
- Mobile responsiveness testing
- Performance optimization

### Week 7: Beta Testing
- Test with real users
- Gather feedback
- Fix bugs
- Refine animations

### Week 8: Launch
- Deploy to Vercel
- Create demo video for YouTube channel
- Launch announcement
- Monitor usage and iterate

***

## Key Technical Decisions

### Why Convex?[38][23][22]
- **Real-time by default** - Perfect for view counts, analytics[24]
- **Built-in authentication** support for future enhancements[23]
- **TypeScript-first** - Better DX for solo developer
- **Serverless** - No infrastructure management
- **Free tier** is generous for MVP phase

### Why GSAP + Framer Motion?[14]
- **GSAP** for complex timeline animations and precise control[25][15]
- **Framer Motion** for React-friendly scroll animations and gestures[14]
- **Performance** - Hardware accelerated
- **Community** - Excellent documentation and examples

### Image Handling
- Use Next.js Image component for optimization
- Store template assets in `/public/festivals/`
- Consider Cloudinary/Uploadcare for user uploads (post-MVP)

***

## Success Metrics (MVP)

**Primary:**
- 100+ greetings created in first month
- 70%+ WhatsApp share rate
- 30%+ of recipients click "Create Your Own"

**Secondary:**
- Average time on site: 2-3 minutes
- Mobile traffic: 80%+
- Greeting completion rate: 60%+

***

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Animation performance on low-end phones | High | Implement progressive enhancement, simpler animations for older devices |
| WhatsApp link format changes | Medium | Use official WhatsApp API documentation, monitor changes[20][39] |
| Context engine feels gimmicky | High | User testing early, iterate based on feedback |
| Festival template creation is time-intensive | Medium | Start with 3-5 most popular festivals, expand gradually |
| Database costs scale unexpectedly | Low | Convex free tier covers ~100k reads/writes, monitor usage[22] |

***

---
