import { LoadingState } from "@/components/shared/LoadingState";

/**
 * Personalization form loading state
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingState message="Loading personalization form..." size="md" />
    </div>
  );
}
