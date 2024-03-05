import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { PagePathMap } from "~/libs/enums";
import { cn } from "~/libs/utils";
import { Avatar } from "./avatar";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

type ChatHeaderProps = {
  title: string | undefined;
  subtitle: string | null;
  actions: React.ReactNode;
  fallback: string | undefined;
  src?: string | null;
  alt?: string;
  isOnline?: boolean;
  isLoading?: boolean;
} & React.ComponentProps<"header">;

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  subtitle,
  actions,
  className,
  fallback,
  src,
  alt,
  isOnline,
  isLoading,
  ...props
}) => {
  return (
    <header
      className={cn(
        "full-width sticky top-0 z-10 border-b bg-background",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "grid grid-cols-[auto_auto_1fr_auto] grid-rows-[auto_auto] items-center gap-x-4 overflow-hidden py-1 md:grid-cols-[auto_1fr_auto]",
          {
            "py-2": isLoading,
          },
        )}
      >
        <Button
          asChild
          size="icon"
          variant="ghost"
          className="col-start-1 row-span-2 inline-flex md:hidden"
        >
          <Link href={PagePathMap.Home}>
            <BiArrowBack className="text-xl" />
          </Link>
        </Button>
        {!isLoading ? (
          <>
            <Avatar
              fallback={fallback}
              src={src}
              alt={alt}
              isOnline={isOnline}
              className="col-start-2 row-span-2 md:col-start-1"
            />
            <strong className="col-start-3 row-start-1 truncate md:col-start-2">
              {title}
            </strong>
            <span className="col-start-3 row-start-2 truncate text-muted-foreground md:col-start-2">
              {subtitle}
            </span>
            <div className="col-start-4 row-span-2 flex items-center gap-2 md:col-start-3">
              {actions}
            </div>
          </>
        ) : (
          <>
            <Skeleton className="col-start-2 row-span-2 h-10 w-10 rounded-full md:col-start-1" />
            <Skeleton className="col-start-3 row-start-1 h-3 w-[10rem] md:col-start-2" />
            <Skeleton className="col-start-3 row-start-2 h-3 w-[5rem] md:col-start-2" />
          </>
        )}
      </div>
    </header>
  );
};
