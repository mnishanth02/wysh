import { LoadingState } from "@/components/shared/LoadingState";

/**
 * Template selection loading state
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingState message="Loading templates..." size="md" />
    </div>
  );
}
