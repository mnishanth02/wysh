# Festival Images Setup

## Required Images

Place the following images in the `/public/festivals/` directory:

### Image Files Needed:

1. **diwali-festival.png** - Image showing Diwali diyas (lamps) and fireworks
2. **christmas-festival.png** - Image showing Christmas tree, ornaments, and warm lighting
3. **newyear-festival.png** - Image showing fireworks and celebration
4. **pongal-festival.png** - Image showing traditional pongal pot and harvest theme
5. **holi-festival.png** - Image showing colorful powder and celebrations
6. **generic-festival.png** - Generic celebration image (optional fallback)

### Image Specifications:

- **Format**: PNG or JPEG (PNG preferred for transparency)
- **Dimensions**: Minimum 1200x800px (16:9 or 3:2 aspect ratio)
- **Size**: Maximum 200KB per image (optimized for web)
- **Quality**: High quality but compressed for web delivery
- **Subject**: Festival-themed imagery with text overlay space at bottom

### Recommended Sources:

1. **Unsplash** (https://unsplash.com/) - Free high-quality images
2. **Pexels** (https://www.pexels.com/) - Free stock photos
3. **Pixabay** (https://pixabay.com/) - Free images and videos

### Search Keywords:

- **Diwali**: "diwali lights", "diya lamps", "diwali celebration", "deepavali"
- **Christmas**: "christmas tree lights", "christmas ornaments", "cozy christmas"
- **New Year**: "new year fireworks", "celebration", "champagne toast"
- **Pongal**: "pongal festival", "harvest celebration", "kolam", "sugarcane"
- **Holi**: "holi colors", "color powder festival", "holi celebration"

### Image Placement:

```
/public/
  /festivals/
    diwali-festival.png
    christmas-festival.png
    newyear-festival.png
    pongal-festival.png
    holi-festival.png
    generic-festival.png (optional)
```

### Current Implementation:

The `FestivalSelector` component now uses Next.js Image component for optimized loading:

```tsx
<Image
  src={FESTIVAL_IMAGES[festivalId]}
  alt={festival.displayName}
  fill
  className="object-cover transition-transform duration-500 group-hover:scale-110"
  priority={festivalId === "diwali" || festivalId === "christmas"}
/>
```

### Image Optimization Features:

- **Automatic WebP/AVIF conversion** - Next.js converts images to modern formats
- **Lazy loading** - Images load as they enter viewport (except priority images)
- **Responsive sizes** - Different sizes served based on device
- **Blur placeholder** - Smooth loading experience (can be added)

### Adding Blur Placeholders:

To add blur placeholders, update the Image component:

```tsx
<Image
  src={FESTIVAL_IMAGES[festivalId]}
  alt={festival.displayName}
  fill
  className="object-cover transition-transform duration-500 group-hover:scale-110"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Add base64 blur data
/>
```

### Fallback Handling:

If an image fails to load, the component will show:
1. Alt text for accessibility
2. Gradient background (can be added as fallback)

### Testing Checklist:

- [ ] All festival images placed in `/public/festivals/`
- [ ] Images optimized for web (<200KB each)
- [ ] Images display correctly on mobile (320px width)
- [ ] Images display correctly on desktop (1920px width)
- [ ] Hover effects work smoothly (scale animation)
- [ ] Text overlays are readable on all images
- [ ] Loading performance is acceptable (<3s on 3G)

## Temporary Development:

For development, you can use placeholder images or gradients. The component will work with missing images but will show broken image icons until real images are added.

## Performance Notes:

- Use `priority` prop for above-the-fold images (Diwali, Christmas)
- Keep image file sizes under 200KB
- Consider using `.webp` format for smaller file sizes
- Test on actual mobile devices for performance validation
