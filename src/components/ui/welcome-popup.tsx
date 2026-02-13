"use client";

import { useEffect, useState } from "react";
import { X } from "phosphor-react";
import { cn } from "@/lib/utils";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

interface WelcomePopupProps {
  className?: string;
}

const WelcomePopup = ({ className }: WelcomePopupProps) => {
  const [visible, setVisible] = useState(false);
  const [render, setRender] = useState(false);
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user has already seen the welcome popup or subscribed
    const hasSeenPopup = localStorage.getItem("welcome-popup-seen");
    const hasSubscribed = localStorage.getItem("newsletter-email");

    if (!hasSeenPopup && !hasSubscribed) {
      // Show popup after a short delay
      setTimeout(() => {
        setRender(true);
        requestAnimationFrame(() => setVisible(true));
      }, 1500);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("welcome-popup-seen", "true");
    setVisible(false);
    setTimeout(() => setRender(false), 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !agreed) return;

    setLoading(true);
    setError("");

    try {
      const result = await subscribeToNewsletter(email);

      if (result.success) {
        // Store email in localStorage to prevent popup from showing again
        localStorage.setItem("newsletter-email", email);
        localStorage.setItem("welcome-popup-seen", "true");
        setSuccess(true);
        // Don't close immediately to show the success message
      } else {
        setError(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setError("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!render) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 z-[9999] backdrop-blur-sm",
          visible
            ? "animate-in fade-in duration-300"
            : "animate-out fade-out duration-300"
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Popup */}
      <div
        role="dialog"
        aria-live="polite"
        aria-label="Welcome popup"
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "z-[10000] w-[90vw] max-w-[500px]",
          visible
            ? "animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            : "animate-out fade-out zoom-out-95 slide-out-to-bottom-4 duration-300"
        )}
      >
        <div
          className={cn(
            "relative bg-card rounded-2xl shadow-2xl overflow-hidden",
            className
          )}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-background/80 hover:bg-background shadow-lg cursor-pointer transition-colors"
            aria-label="Close welcome popup"
          >
            <X className="size-5 text-foreground" weight="bold" />
          </button>

          <div className="px-8 py-10 md:px-12 md:py-12">
            {success ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-4 animate-in fade-in zoom-in">
                <div className="text-4xl">🎉</div>
                <h2 className="text-2xl md:text-3xl font-bold text-center text-card-foreground">Thank You!</h2>
                <p className="text-center text-muted-foreground text-sm md:text-base">
                  You have successfully subscribed to our newsletter.
                </p>
                <div className="bg-secondary/20 p-4 rounded-lg border border-border mt-4 w-full text-center">
                  <p className="text-xs text-muted-foreground mb-1">Your discount code:</p>
                  <p className="text-xl font-bold tracking-wider text-primary">WELCOME10</p>
                </div>
                <button
                  onClick={handleClose}
                  className={cn(
                    "mt-6 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md",
                    "hover:bg-primary/90 transition-colors text-sm hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-card-foreground">
                  A Welcome Gift For You
                </h2>

                {/* Description */}
                <p className="text-center text-muted-foreground mb-6 text-sm md:text-base leading-relaxed">
                  Subscribe and instantly receive a discount code for your first purchase.
                  Be the first to know about our news and exclusive offers.
                </p>

                {/* Form converted to div to strictly prevent default submission issues during debug */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your Email (*)"
                      className="flex-1 px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e as any)}
                      disabled={!agreed || !email || loading}
                      className={cn(
                        "w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md",
                        "hover:bg-primary/90 transition-colors text-sm whitespace-nowrap",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      {loading ? "..." : "GET MY DISCOUNT"}
                    </button>
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agree-terms"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 size-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="agree-terms" className="text-xs text-muted-foreground cursor-pointer">
                      I agree to the{" "}
                      <a
                        href="/pages/privacy-policy"
                        className="underline hover:text-card-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        terms and conditions
                      </a>
                    </label>
                  </div>
                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm text-center">
                      {error}
                    </div>
                  )}

                  {/* Spam notice */}
                  <p className="text-[11px] text-muted-foreground italic text-center">
                    We will never send you spam. You can unsubscribe at any time.
                  </p>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export { WelcomePopup };
