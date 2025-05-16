import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  variant?: "bullet" | "numbered" | "none";
  spacing?: "tight" | "normal" | "relaxed";
  nested?: boolean;
}

interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode;
}

const listVariants = {
  bullet: "list-disc",
  numbered: "list-decimal",
  none: "list-none",
};

const listSpacing = {
  tight: "space-y-1",
  normal: "space-y-2",
  relaxed: "space-y-3",
};

const List = forwardRef<HTMLUListElement, ListProps>(
  ({ variant = "bullet", spacing = "normal", nested = false, className, children, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn(listVariants[variant], listSpacing[spacing], nested ? "ml-6" : "", className)}
        {...props}
      >
        {children}
      </ul>
    );
  }
);

const ListItem = forwardRef<HTMLLIElement, ListItemProps>(({ icon, className, children, ...props }, ref) => {
  return (
    <li ref={ref} className={cn("relative", icon && "pl-6", className)} {...props}>
      {icon && <span className="absolute left-0 top-1/2 -translate-y-1/2">{icon}</span>}
      {children}
    </li>
  );
});

List.displayName = "List";
ListItem.displayName = "ListItem";

export { List, ListItem };
