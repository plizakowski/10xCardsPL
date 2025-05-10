import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

interface NavigationItemProps extends React.HTMLAttributes<HTMLLIElement> {
  href: string;
  active?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const navigationVariants = {
  horizontal: "flex flex-row items-center",
  vertical: "flex flex-col",
};

const navigationSizes = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

const Navigation = forwardRef<HTMLElement, NavigationProps>(
  ({ variant = "horizontal", size = "md", className, children, ...props }, ref) => {
    return (
      <nav ref={ref} className={cn(navigationVariants[variant], navigationSizes[size], className)} {...props}>
        <ul className={cn("list-none", navigationVariants[variant], navigationSizes[size])}>{children}</ul>
      </nav>
    );
  }
);

const NavigationItem = forwardRef<HTMLLIElement, NavigationItemProps>(
  ({ href, active, icon, disabled, className, children, ...props }, ref) => {
    return (
      <li ref={ref} className={cn("relative", disabled && "pointer-events-none opacity-50", className)} {...props}>
        <a
          href={href}
          className={cn(
            "flex items-center px-4 py-2 text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            active && "bg-accent text-accent-foreground",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
          {children}
        </a>
      </li>
    );
  }
);

Navigation.displayName = "Navigation";
NavigationItem.displayName = "NavigationItem";

export { Navigation, NavigationItem };
