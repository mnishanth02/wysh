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
import { ArrowRight, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FESTIVALS, RELATIONSHIP_TYPES } from "@/lib/constants";
import { generateContextualMessage } from "@/lib/context-engine";
import { sanitizeMessage, sanitizeName } from "@/lib/sanitize";
import { greetingParsers } from "@/lib/url-state-parsers";
import type { FestivalType, RelationshipType } from "@/types";

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
    .max(500, "Message must be 500 characters or less")
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

  // Generate default message based on festival and relationship
  // This needs to be calculated before the useForm hook to use in defaultValues
  const defaultMessage =
    urlState.festival && urlState.relationship
      ? generateContextualMessage(
        urlState.festival as FestivalType,
        urlState.relationship as RelationshipType,
      )
      : "";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PersonalizationFormData>({
    resolver: zodResolver(personalizationSchema),
    // URL state is single source of truth - read once on mount
    // Pre-populate custom message with default message if not already set in URL
    defaultValues: {
      recipientName: urlState.recipientName,
      senderName: urlState.senderName,
      customMessage: urlState.customMessage ?? defaultMessage,
    },
  });

  // Watch form fields for clearing functionality and validation
  const customMessage = watch("customMessage") || "";
  const senderName = watch("senderName") || "";
  const recipientName = watch("recipientName") || "";

  // Track the previous default message to detect when festival/relationship changes
  const prevDefaultMessageRef = useRef(defaultMessage);
  const isInitializedRef = useRef(false);

  // Update default message only when festival/relationship changes, not on every render
  useEffect(() => {
    // Only update if:
    // 1. There's a new default message (festival/relationship changed)
    // 2. User hasn't provided a custom URL message
    // 3. The current textarea is empty or contains the OLD default message
    if (
      defaultMessage !== prevDefaultMessageRef.current &&
      !urlState.customMessage
    ) {
      // Festival or relationship changed, update to new default
      setValue("customMessage", defaultMessage, { shouldDirty: false });
    }
    prevDefaultMessageRef.current = defaultMessage;
  }, [defaultMessage, urlState.customMessage, setValue]);

  // Initialize textarea with default message on mount if not already set
  useEffect(() => {
    // Only run this once per component mount
    if (!isInitializedRef.current && defaultMessage && !customMessage) {
      setValue("customMessage", defaultMessage, { shouldDirty: false });
      isInitializedRef.current = true;
    }
  }, [defaultMessage, customMessage, setValue]);

  // ...existing code...

  // Get festival and relationship display names for summary
  const festivalName = urlState.festival
    ? FESTIVALS[urlState.festival as keyof typeof FESTIVALS]?.displayName ||
    urlState.festival
    : "";

  // Find relationship label from nested structure
  const getRelationshipLabel = (relationshipValue: string | null): string => {
    if (!relationshipValue) return "";
    for (const category of Object.values(RELATIONSHIP_TYPES)) {
      const found = category.find((r) => r.value === relationshipValue);
      if (found) return found.label;
    }
    return relationshipValue;
  };

  const relationshipName = getRelationshipLabel(urlState.relationship);

  const onSubmit = async (data: PersonalizationFormData) => {
    // Client-side sanitization for defense-in-depth
    // Server also validates, but this prevents malicious input from reaching server
    const sanitizedRecipientName = sanitizeName(data.recipientName);
    const sanitizedSenderName = sanitizeName(data.senderName);
    const sanitizedCustomMessage = data.customMessage
      ? sanitizeMessage(data.customMessage)
      : "";

    // Update nuqs state - this automatically updates the URL for the current page
    // This ensures the browser history entry for the personalize page contains the form data
    // When user clicks back from template, they'll see the filled form with data in URL
    await setQueryStates({
      recipientName: sanitizedRecipientName,
      senderName: sanitizedSenderName,
      customMessage: sanitizedCustomMessage,
    });

    // Build complete URL with all parameters for navigation to template page
    // We need to explicitly pass all params since we're navigating to a new route
    const params = new URLSearchParams({
      festival: urlState.festival || "",
      relationship: urlState.relationship || "",
      recipientName: sanitizedRecipientName,
      senderName: sanitizedSenderName,
      customMessage: sanitizedCustomMessage,
    });

    // Navigate to template selection with all parameters
    router.push(`/create/template?${params.toString()}`);
  };

  return (
    <Card className="p-6 sm:p-8 shadow-lg border-2 bg-card">
      <form onSubmit={ handleSubmit(onSubmit) } className="space-y-4">
        {/* Sender Name */ }
        <div className="space-y-2">
          <Label htmlFor="senderName" className="text-base font-medium">
            Your Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="senderName"
              placeholder="Enter your name"
              autoComplete="name"
              disabled={ isSubmitting }
              { ...register("senderName") }
              className={ `h-12 text-base pr-10 ${errors.senderName ? "border-destructive" : ""}` }
            />
            {/* Clear button for sender name */ }
            { senderName && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={ () =>
                  setValue("senderName", "", { shouldDirty: true })
                }
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                aria-label="Clear name"
                title="Clear name"
              >
                <X className="size-4 text-orange-500" />
              </Button>
            ) }
          </div>
          { errors.senderName && (
            <p className="text-sm text-destructive">
              { errors.senderName.message }
            </p>
          ) }
        </div>

        {/* Recipient Name */ }
        <div className="space-y-2">
          <Label htmlFor="recipientName" className="text-base font-medium">
            Recipient's Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="recipientName"
              placeholder="Enter recipient's name"
              autoComplete="name"
              disabled={ isSubmitting }
              { ...register("recipientName") }
              className={ `h-12 text-base pr-10 ${errors.recipientName ? "border-destructive" : ""}` }
            />
            {/* Clear button for recipient name */ }
            { recipientName && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={ () =>
                  setValue("recipientName", "", { shouldDirty: true })
                }
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                aria-label="Clear recipient name"
                title="Clear recipient name"
              >
                <X className="size-4 text-orange-500" />
              </Button>
            ) }
          </div>
          { errors.recipientName && (
            <p className="text-sm text-destructive">
              { errors.recipientName.message }
            </p>
          ) }
        </div>

        {/* Custom Message */ }
        <div className="space-y-2">
          <Label htmlFor="customMessage" className="text-base font-medium">
            Custom Message{ " " }
            <span className="text-muted-foreground font-normal">
              (Optional - Emojis welcome!)
            </span>
          </Label>
          <p className="text-sm text-muted-foreground">
            Review and edit the default message below, or write your own. You
            can use emojis to add more personality! 🎉
          </p>
          <div className="relative">
            <Textarea
              id="customMessage"
              placeholder="Your custom message here... You can use emojis like 🎉 ✨ 🎊"
              rows={ 8 }
              disabled={ isSubmitting }
              { ...register("customMessage") }
              className={ `text-base resize-none pr-12 ${errors.customMessage
                  ? "border-destructive border-2"
                  : "border-2 border-primary/20 focus-visible:border-primary"
                }` }
            />
            {/* Clear button - appears in bottom-right corner of textarea */ }
            { customMessage && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={ () =>
                  setValue("customMessage", "", { shouldDirty: true })
                }
                className="absolute bottom-2 right-2"
                aria-label="Clear message"
                title="Clear message"
              >
                <X className="size-5 text-orange-500" />
              </Button>
            ) }
          </div>
          <div className="flex justify-end">
            <p className="text-sm text-muted-foreground">
              { customMessage.length }/500
            </p>
          </div>
          { errors.customMessage && (
            <p className="text-sm text-destructive">
              { errors.customMessage.message }
            </p>
          ) }
        </div>

        {/* Summary Section */ }
        <Card className="bg-muted/50 p-4 gap-2 space-y-2 border-0">
          <h3 className="font-semibold text-lg">Summary</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Festival:</span>{ " " }
              <span className="font-medium">{ festivalName }</span>
            </p>
            <p>
              <span className="text-muted-foreground">For:</span>{ " " }
              <span className="font-medium capitalize">{ relationshipName }</span>
            </p>
          </div>
        </Card>

        {/* Submit Button - Orange Gradient */ }
        <Button
          type="submit"
          disabled={ isSubmitting }
          className="w-full h-14 text-base font-semibold bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-md transition-all duration-200 hover:shadow-lg"
        >
          { isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin mr-2" />
              Creating Greeting...
            </>
          ) : (
            <>
              Create Greeting
              <ArrowRight className="size-5 ml-2" />
            </>
          ) }
        </Button>
      </form>
    </Card>
  );
}
