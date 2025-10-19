import { LoadingState } from "@/components/shared/LoadingState";

/**
 * Greeting page loading state
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingState message="Loading greeting..." size="lg" />
    </div>
  );
}
