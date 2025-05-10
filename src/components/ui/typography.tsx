import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "small" | "tiny";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  weight?: "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
}

const variantStyles = {
  h1: "text-4xl font-semibold tracking-tight",
  h2: "text-3xl font-semibold tracking-tight",
  h3: "text-2xl font-semibold tracking-tight",
  h4: "text-xl font-semibold tracking-tight",
  h5: "text-lg font-semibold tracking-tight",
  h6: "text-base font-semibold tracking-tight",
  p: "text-base leading-7",
  small: "text-sm leading-6",
  tiny: "text-xs leading-5",
};

const weightStyles = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const alignStyles = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ variant = "p", as, weight = "normal", align = "left", className, children, ...props }, ref) => {
    const Component = as || variant;

    return (
      <Component
        ref={ref}
        className={cn(variantStyles[variant], weightStyles[weight], alignStyles[align], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";

export { Typography };
