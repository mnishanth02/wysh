"use client";

/**
 * Personalization Form Component
 * Collects recipient name, sender name, and custom message
 * Validates input and navigates to template selection
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sanitizeMessage, sanitizeName } from "@/lib/sanitize";

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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PersonalizationFormData>({
    resolver: zodResolver(personalizationSchema),
    defaultValues: {
      recipientName: "",
      senderName: "",
      customMessage: "",
    },
  });

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

    // Store sanitized form data in session storage
    sessionStorage.setItem("greeting_recipientName", sanitizedRecipientName);
    sessionStorage.setItem("greeting_senderName", sanitizedSenderName);
    sessionStorage.setItem("greeting_customMessage", sanitizedCustomMessage);

    // Navigate to template selection
    router.push("/create/template");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mobile-gap-4">
      <div className="space-y-2">
        <Label htmlFor="recipientName" className="text-sm sm:text-base">
          Recipient Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="recipientName"
          placeholder="e.g., Amma, John, Sarah"
          {...register("recipientName")}
          className={`touch-target ${errors.recipientName ? "border-destructive" : ""}`}
        />
        <div className="flex justify-between text-xs sm:text-sm">
          {errors.recipientName && (
            <p className="text-destructive">{errors.recipientName.message}</p>
          )}
          <p className="ml-auto text-muted-foreground">
            {recipientName.length}/50
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
          {...register("senderName")}
          className={`touch-target ${errors.senderName ? "border-destructive" : ""}`}
        />
        <div className="flex justify-between text-xs sm:text-sm">
          {errors.senderName && (
            <p className="text-destructive">{errors.senderName.message}</p>
          )}
          <p className="ml-auto text-muted-foreground">
            {senderName.length}/50
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customMessage" className="text-sm sm:text-base">
          Custom Message{" "}
          <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Textarea
          id="customMessage"
          placeholder="Add a personal message (optional)"
          rows={4}
          {...register("customMessage")}
          className={`touch-target ${errors.customMessage ? "border-destructive" : ""}`}
        />
        <div className="flex justify-between text-xs sm:text-sm">
          {errors.customMessage && (
            <p className="text-destructive">{errors.customMessage.message}</p>
          )}
          <p className="ml-auto text-muted-foreground">
            {customMessage.length}/150
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
          onClick={() => router.back()}
          className="flex-1 touch-target-lg"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 touch-target-lg"
        >
          {isSubmitting ? "Saving..." : "Continue to Templates"}
        </Button>
      </div>
    </form>
  );
}
