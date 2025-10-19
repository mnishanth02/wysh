import { LoadingState } from "@/components/shared/LoadingState";

/**
 * Festival selection loading state
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingState message="Loading festivals..." size="md" />
    </div>
  );
}
