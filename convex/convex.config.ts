// Convex Configuration
// Purpose: Configure Convex app with components (rate limiter)

import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(rateLimiter);

export default app;
