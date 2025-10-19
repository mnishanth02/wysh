/**
 * Skeleton loader for Statistics Section
 * Matches final layout to prevent layout shifts
 */
export function StatsSkeleton() {
    return (
        <section className="bg-muted/30 py-16 sm:py-20">
            <div className="container mx-auto px-4">
                {/* Title skeleton */ }
                <div className="mb-12 flex justify-center">
                    <div className="h-10 w-3/4 animate-pulse rounded-lg bg-muted sm:w-1/2" />
                </div>

                {/* Stats grid skeleton */ }
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    { [1, 2, 3].map((i) => (
                        <div key={ i } className="text-center">
                            {/* Number skeleton */ }
                            <div className="mb-2 flex justify-center">
                                <div className="h-12 w-32 animate-pulse rounded-lg bg-muted sm:h-14 sm:w-40 md:h-16" />
                            </div>
                            {/* Label skeleton */ }
                            <div className="flex justify-center">
                                <div className="h-4 w-40 animate-pulse rounded bg-muted/60 sm:h-5 sm:w-48" />
                            </div>
                        </div>
                    )) }
                </div>
            </div>
        </section>
    );
}
