import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  BiCog,
  BiGroup,
  BiLogOut,
  BiMenu,
  BiMessage,
  BiMoon,
  BiX,
} from "react-icons/bi";
import { Avatar } from "./avatar";
import { SignOutAlertDrawer } from "./sign-out-alert-drawer";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "./ui/drawer";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";

export const NavDrawer: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (router.isReady) setIsDrawerOpen(false);
  }, [router]);

  return (
    <Drawer
      direction="left"
      onOpenChange={setIsDrawerOpen}
      shouldScaleBackground={false}
      open={isDrawerOpen}
    >
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="inline-flex md:hidden">
          <BiMenu className="text-xl" />
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className="grid h-full grid-rows-[auto_1fr]"
        isNotchDisabled
      >
        <DrawerHeader className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-4 gap-y-0 border-b px-4 py-6">
          {session?.user ? (
            <>
              <Avatar
                fallback={session?.user?.name?.at(0)}
                className="col-start-1 row-span-2 h-14 w-14"
                src={session?.user?.image ?? undefined}
                alt="Аватар"
              />
              <header className="col-start-2 row-start-1 flex items-center gap-4 overflow-hidden">
                <strong className="flex-grow truncate text-left">
                  {session.user.name}
                </strong>
                <Button asChild className="h-8 w-8 p-0" variant="ghost">
                  <DrawerClose>
                    <BiX className="shrink-0 text-xl" />
                  </DrawerClose>
                </Button>
              </header>
              <span className="col-start-2 row-start-2 truncate text-left text-muted-foreground">
                {session.user.email}
              </span>
            </>
          ) : (
            <>
              <Skeleton className="col-start-1 row-span-2 h-14 w-14 rounded-full" />
              <Skeleton className="col-start-2 row-start-1 h-4 w-28 rounded-xl" />
              <Skeleton className="col-start-2 row-start-2 h-4 w-36 rounded-xl" />
            </>
          )}
        </DrawerHeader>
        <ScrollArea>
          <nav className="flex h-full flex-col gap-2 p-4">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-normal gap-4 px-4"
              draggable={false}
              size="lg"
            >
              <Link href="#">
                <BiMessage className="text-xl" />
                <span>Сообщения</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-normal gap-4 px-4"
              draggable={false}
              size="lg"
            >
              <Link href="#">
                <BiGroup className="text-xl" />
                <span>Люди</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-normal gap-4 px-4"
              draggable={false}
              size="lg"
            >
              <Link href="#">
                <BiCog className="text-xl" />
                <span>Настройки</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-between gap-4 px-4"
              draggable={false}
              size="lg"
              onClick={() => {
                console.log("clicked");
                setTheme(theme === "light" ? "dark" : "light");
              }}
            >
              <div>
                <Label
                  htmlFor="dark-theme"
                  className="pointer-events-none flex items-center gap-4"
                >
                  <BiMoon className="text-xl" />
                  <span>Темная тема</span>
                </Label>
                <Switch id="dark-theme" checked={theme === "dark"} />
              </div>
            </Button>
            <SignOutAlertDrawer>
              <Button
                variant="destructive"
                className="mt-auto w-full justify-normal gap-4 px-4"
                size="lg"
              >
                <BiLogOut className="text-xl" />
                <span>Выйти</span>
              </Button>
            </SignOutAlertDrawer>
          </nav>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
