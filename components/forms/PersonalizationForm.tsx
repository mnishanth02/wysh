"use client";

/**
 * Personalization Form Component
 * Collects recipient name, sender name, and custom message
 * Validates input and navigates to template selection
 *
 * Following nuqs best practices:
 * - URL state is the single source of truth
 * - No redundant useEffect for syncing
 * - Form reads from URL state via defaultValues
 * - Updates happen on submit only
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sanitizeMessage, sanitizeName } from "@/lib/sanitize";
import { greetingParsers } from "@/lib/url-state-parsers";

// Validation schema
const personalizationSchema = z.object({
  recipientName: z
    .string()
    .min(1, "Recipient name is required")
    .max(50, "Recipient name must be 50 characters or less")
    .trim(),
  senderName: z
    .string()
    .min(1, "Your name is required")
    .max(50, "Your name must be 50 characters or less")
    .trim(),
  customMessage: z
    .string()
    .max(150, "Message must be 150 characters or less")
    .trim()
    .optional(),
});

type PersonalizationFormData = z.infer<typeof personalizationSchema>;

export function PersonalizationForm() {
  const router = useRouter();

  // Read and write URL state parameters
  // This hook manages URL state AND allows us to update it
  const [urlState, setQueryStates] = useQueryStates({
    festival: greetingParsers.festival,
    relationship: greetingParsers.relationship,
    recipientName: greetingParsers.recipientName,
    senderName: greetingParsers.senderName,
    customMessage: greetingParsers.customMessage,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PersonalizationFormData>({
    resolver: zodResolver(personalizationSchema),
    // URL state is single source of truth - read once on mount
    defaultValues: {
      recipientName: urlState.recipientName,
      senderName: urlState.senderName,
      customMessage: urlState.customMessage,
    },
  });

  // Watch for character count display only
  const customMessage = watch("customMessage") || "";
  const recipientName = watch("recipientName") || "";
  const senderName = watch("senderName") || "";

  const onSubmit = async (data: PersonalizationFormData) => {
    // Client-side sanitization for defense-in-depth
    // Server also validates, but this prevents malicious input from reaching server
    const sanitizedRecipientName = sanitizeName(data.recipientName);
    const sanitizedSenderName = sanitizeName(data.senderName);
    const sanitizedCustomMessage = data.customMessage
      ? sanitizeMessage(data.customMessage)
      : "";

    // Build the complete URL with all necessary parameters
    // This ensures both current page history and next page can access all parameters
    const params = new URLSearchParams({
      festival: urlState.festival || "",
      relationship: urlState.relationship || "",
      recipientName: sanitizedRecipientName,
      senderName: sanitizedSenderName,
      customMessage: sanitizedCustomMessage,
    });

    // IMPORTANT: Update current page URL FIRST with router.replace()
    // This updates the browser history entry for the personalize page
    // so when user clicks back from template, they'll see the filled form with data in URL
    // We use router.replace() to avoid creating a duplicate history entry
    const personalizationUrl = `/create/personalize?${params.toString()}`;
    router.replace(personalizationUrl);

    // Small delay to ensure router.replace completes before navigation
    // This ensures the browser history is properly updated
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Now update nuqs state to keep it in sync
    await setQueryStates({
      recipientName: sanitizedRecipientName,
      senderName: sanitizedSenderName,
      customMessage: sanitizedCustomMessage,
    });

    // Finally navigate to template with full parameters
    router.push(`/create/template?${params.toString()}`);
  };

  return (
    <form onSubmit={ handleSubmit(onSubmit) } className="space-y-6 mobile-gap-4">
      <div className="space-y-2">
        <Label htmlFor="recipientName" className="text-sm sm:text-base">
          Recipient Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="recipientName"
          placeholder="e.g., Amma, John, Sarah"
          { ...register("recipientName") }
          className={ `touch-target ${errors.recipientName ? "border-destructive" : ""}` }
        />
        <div className="flex justify-between text-xs sm:text-sm">
          { errors.recipientName && (
            <p className="text-destructive">{ errors.recipientName.message }</p>
          ) }
          <p className="ml-auto text-muted-foreground">
            { recipientName.length }/50
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="senderName" className="text-sm sm:text-base">
          Your Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="senderName"
          placeholder="e.g., Ravi, Jane, Mike"
          { ...register("senderName") }
          className={ `touch-target ${errors.senderName ? "border-destructive" : ""}` }
        />
        <div className="flex justify-between text-xs sm:text-sm">
          { errors.senderName && (
            <p className="text-destructive">{ errors.senderName.message }</p>
          ) }
          <p className="ml-auto text-muted-foreground">
            { senderName.length }/50
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customMessage" className="text-sm sm:text-base">
          Custom Message{ " " }
          <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Textarea
          id="customMessage"
          placeholder="Add a personal message (optional)"
          rows={ 4 }
          { ...register("customMessage") }
          className={ `touch-target ${errors.customMessage ? "border-destructive" : ""}` }
        />
        <div className="flex justify-between text-xs sm:text-sm">
          { errors.customMessage && (
            <p className="text-destructive">{ errors.customMessage.message }</p>
          ) }
          <p className="ml-auto text-muted-foreground">
            { customMessage.length }/150
          </p>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Leave blank to use a context-appropriate message
        </p>
      </div>

      <div className="flex gap-3 sm:gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={ () => router.push(`/create/relationship?festival=${urlState.festival}`) }
          className="flex-1 touch-target-lg"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={ isSubmitting }
          className="flex-1 touch-target-lg"
        >
          { isSubmitting ? "Saving..." : "Continue to Templates" }
        </Button>
      </div>
    </form>
  );
}
