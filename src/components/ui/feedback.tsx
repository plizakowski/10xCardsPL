import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Typography } from "./typography";

interface FeedbackProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "warning" | "info";
  title?: string;
  showIcon?: boolean;
  closeable?: boolean;
  onClose?: () => void;
}

const feedbackVariants = {
  success: {
    container: "bg-green-50 border-green-200",
    icon: "text-green-500",
    title: "text-green-800",
    content: "text-green-700",
  },
  error: {
    container: "bg-red-50 border-red-200",
    icon: "text-red-500",
    title: "text-red-800",
    content: "text-red-700",
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200",
    icon: "text-yellow-500",
    title: "text-yellow-800",
    content: "text-yellow-700",
  },
  info: {
    container: "bg-blue-50 border-blue-200",
    icon: "text-blue-500",
    title: "text-blue-800",
    content: "text-blue-700",
  },
};

const Feedback = forwardRef<HTMLDivElement, FeedbackProps>(
  ({ variant = "info", title, showIcon = true, closeable = false, onClose, className, children, ...props }, ref) => {
    const styles = feedbackVariants[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn("relative rounded-lg border p-4", styles.container, className)}
        {...props}
      >
        <div className="flex">
          {showIcon && (
            <div className={cn("mr-3 flex-shrink-0", styles.icon)}>
              {variant === "success" && (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {variant === "error" && (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {variant === "warning" && (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {variant === "info" && (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          )}
          <div className="flex-1">
            {title && (
              <Typography variant="h6" className={cn("mb-1", styles.title)}>
                {title}
              </Typography>
            )}
            <div className={styles.content}>{children}</div>
          </div>
          {closeable && (
            <button
              type="button"
              className={cn(
                "absolute right-4 top-4 inline-flex rounded-md p-1.5",
                "hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2",
                styles.icon,
                `hover:bg-${variant}-200`
              )}
              onClick={onClose}
            >
              <span className="sr-only">Zamknij</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

Feedback.displayName = "Feedback";

export { Feedback };
