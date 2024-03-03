import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";

import { cn } from "~/libs/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    fullWidthContainer?: boolean;
    isScrollLock?: boolean;
  }
>(
  (
    {
      className,
      children,
      fullWidthContainer,
      isScrollLock,
      onScroll,
      ...props
    },
    ref,
  ) => (
    <ScrollAreaPrimitive.Root
      className={cn(
        "relative overflow-hidden",
        {
          "full-width": !!fullWidthContainer,
        },
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        asChild
        className={cn(
          "!flex h-full w-full flex-col gap-y-1 rounded-[inherit]",
          {
            "!overflow-hidden": isScrollLock,
          },
        )}
        ref={ref}
        onScroll={onScroll}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {/* <ScrollAreaPrimitive.Viewport
      className={cn(
        "grid h-full w-full grid-rows-[1fr] rounded-[inherit] [&_>_div]:!flex [&_>_div]:flex-col [&_>_div]:gap-y-2",
      )}
    >
      {children}
    </ScrollAreaPrimitive.Viewport> */}
      <ScrollBar
        className={cn({
          "full-width": !!fullWidthContainer,
        })}
      />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  ),
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
