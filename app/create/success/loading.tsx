import { LoadingState } from "@/components/shared/LoadingState";

/**
 * Success page loading state
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingState message="Preparing your greeting..." size="md" />
    </div>
  );
}
