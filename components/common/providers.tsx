"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";
import { Toaster } from "../ui/sonner";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
    throw new Error(
        "Environment variable NEXT_PUBLIC_CONVEX_URL is not defined. Please set it in your environment."
    );
}

const convex = new ConvexReactClient(convexUrl);

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ConvexProvider client={ convex }>
            <NextThemesProvider
                attribute="class"
                defaultTheme="system"
                disableTransitionOnChange
                enableColorScheme
                enableSystem
            >

                { children }
                <Toaster
                    duration={ 3000 }
                    position="top-center"
                    richColors
                    toastOptions={ { style: { textAlign: "center" } } }
                />
            </NextThemesProvider>
        </ConvexProvider>
    );
}