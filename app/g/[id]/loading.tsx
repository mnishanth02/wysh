import { LoadingState } from "@/components/shared/LoadingState";

/**
 * Individual greeting loading state
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingState message="Loading your greeting..." size="lg" />
    </div>
  );
}
