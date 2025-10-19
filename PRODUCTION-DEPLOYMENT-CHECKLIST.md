# 🚀 Production Deployment Checklist

## Pre-Deployment Setup

### 1. Environment Variables ✅
**Critical**: Set up environment variables in your hosting platform (Vercel/Netlify/etc.)

```bash
# Required Variables
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
NEXT_PUBLIC_SITE_URL=https://wysh.app
CONVEX_DEPLOYMENT=prod:your-deployment-name

# Optional Variables
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-code
```

**Where to set**:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Railway/Render**: Environment tab

### 2. Convex Backend Setup ✅
```bash
# Deploy Convex to production
npx convex deploy --prod

# Verify deployment
npx convex env get NEXT_PUBLIC_CONVEX_URL
```

### 3. Build Validation ✅
```bash
# Test production build locally
bun run build

# Check for errors
bun run lint

# Test production server
bun run start
```

## Post-Deployment Verification

### 1. Core Functionality ✅
- [ ] Homepage loads correctly
- [ ] Festival selection works
- [ ] Relationship selector works
- [ ] Personalization form validates correctly
- [ ] Template previews render
- [ ] Greeting creation succeeds
- [ ] Shareable links work (`/g/[id]`)
- [ ] WhatsApp sharing opens with pre-filled message
- [ ] View count increments

### 2. SEO & Metadata ✅
- [ ] Open Graph image appears in link previews (test on WhatsApp/Twitter/LinkedIn)
- [ ] `robots.txt` accessible at `/robots.txt`
- [ ] `sitemap.xml` accessible at `/sitemap.xml`
- [ ] Meta tags appear correctly (view page source)
- [ ] Favicon loads (check browser tab)
- [ ] Web manifest loads at `/manifest.webmanifest`

### 3. Performance ✅
- [ ] Lighthouse score >90 (Performance, Accessibility, Best Practices, SEO)
- [ ] First Contentful Paint <1.5s
- [ ] Largest Contentful Paint <2.5s
- [ ] Total Blocking Time <300ms
- [ ] Cumulative Layout Shift <0.1
- [ ] Images load in WebP/AVIF format
- [ ] Animations run at 60fps on mobile

### 4. Mobile Testing ✅
- [ ] Test on real Android device (mid-range)
- [ ] Test on iPhone (Safari)
- [ ] Touch targets ≥44px
- [ ] Forms work on mobile keyboards
- [ ] Animations smooth on 3G network
- [ ] Page weight <2MB
- [ ] WhatsApp sharing works on mobile

### 5. Security Headers ✅
Check at https://securityheaders.com or https://observatory.mozilla.org
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Content-Security-Policy (if applicable)

### 6. Error Handling ✅
- [ ] 404 page renders for invalid URLs
- [ ] Invalid greeting IDs show proper error
- [ ] Network errors show user-friendly messages
- [ ] Rate limiting triggers correctly (test by rapid API calls)
- [ ] Form validation shows clear error messages

## Domain & SSL Setup

### Custom Domain (Optional)
If using custom domain instead of `wysh.app`:

1. **Update environment variables**:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

2. **DNS Configuration**:
   - Add A/CNAME records pointing to hosting provider
   - Enable SSL certificate (auto on Vercel/Netlify)

3. **Update Convex**:
   ```bash
   # Update CORS if needed
   ```

### SSL Certificate ✅
- [ ] HTTPS enabled
- [ ] Certificate valid and trusted
- [ ] HTTP redirects to HTTPS
- [ ] Mixed content warnings resolved

## Monitoring & Analytics (Post-MVP)

### Error Tracking
- [ ] Set up Sentry or similar (optional for MVP)
- [ ] Configure error reporting

### Analytics
- [ ] Google Analytics (optional)
- [ ] PostHog (optional)
- [ ] Server logs monitoring

## Backup & Recovery

### Database Backups ✅
Convex handles automatic backups, but verify:
- [ ] Convex dashboard accessible
- [ ] Can view production data
- [ ] Understand recovery process

### Code Backups ✅
- [ ] Code pushed to GitHub
- [ ] Branch protection rules set
- [ ] CI/CD pipeline configured

## Performance Budget

### Page Weight Limits
- Homepage: <500KB
- Greeting viewer: <1MB
- Total assets: <2MB

### Load Time Targets
- First Load (3G): <3s
- Subsequent Loads: <1s
- Animation Start: <500ms

## Common Issues & Solutions

### Issue: Convex connection fails
**Solution**: Check `NEXT_PUBLIC_CONVEX_URL` is set correctly and Convex deployment is active

### Issue: OG images not loading
**Solution**: Verify `/og-default.png` exists and `opengraph-image.tsx` is deployed

### Issue: 404 on greeting links
**Solution**: Ensure `app/g/[id]/page.tsx` is deployed and Convex functions are working

### Issue: Rate limiting too aggressive
**Solution**: Adjust rate limits in `convex/rateLimiter.ts` and redeploy Convex

### Issue: Slow animations on mobile
**Solution**: Check GSAP settings, reduce particle count, test on real device

## Final Pre-Launch Checklist

- [ ] All environment variables set
- [ ] Convex deployed to production
- [ ] DNS configured (if custom domain)
- [ ] SSL certificate active
- [ ] Build succeeds without errors
- [ ] Linting passes
- [ ] Core user flows tested
- [ ] Mobile devices tested
- [ ] SEO metadata verified
- [ ] Performance benchmarks met
- [ ] Error handling tested
- [ ] Rate limiting tested
- [ ] WhatsApp sharing tested
- [ ] Backup plan in place
- [ ] Monitoring set up (optional)

## Launch Day Tasks

1. **Deploy to production**
   ```bash
   git push origin main
   # Or trigger manual deploy on hosting platform
   ```

2. **Smoke test**
   - Create a greeting end-to-end
   - Share via WhatsApp
   - Verify view count increments

3. **Monitor logs**
   - Watch for errors
   - Check Convex dashboard
   - Monitor hosting platform logs

4. **Document any issues**
   - Create GitHub issues for bugs
   - Note performance problems
   - Track user feedback

## Post-Launch

### Week 1
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Fix critical bugs

### Month 1
- [ ] Analyze usage patterns
- [ ] Optimize based on data
- [ ] Plan feature improvements
- [ ] Update documentation

---

## Support & Resources

- **Convex Dashboard**: https://dashboard.convex.dev
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Google Search Console**: https://search.google.com/search-console
- **Next.js Docs**: https://nextjs.org/docs
- **Project Specs**: `/specs/001-festival-greeting-mvp/`

---

**Last Updated**: 2025-10-19
**Version**: 1.0.0
**Status**: Production Ready ✅
