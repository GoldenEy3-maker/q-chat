import { Label } from "@radix-ui/react-label";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  BiCheckDouble,
  BiCog,
  BiGroup,
  BiLogOut,
  BiMenu,
  BiMessage,
  BiMoon,
  BiSearch,
  BiX,
} from "react-icons/bi";
import { PagePathMap } from "~/libs/enums";
import { Avatar } from "./avatar";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";

export const Sidebar: React.FC = () => {
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) setIsDrawerOpen(false);
  }, [router]);

  return (
    <aside className="grid max-h-screen grid-rows-[auto_1fr] overflow-hidden border-r md:sticky md:left-0 md:top-0">
      <header className="mb-1 mt-4 grid grid-cols-[auto_1fr] gap-2 px-4 md:grid-cols-[1fr]">
        <Drawer
          direction="left"
          shouldScaleBackground
          onOpenChange={setIsDrawerOpen}
          open={isDrawerOpen}
        >
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="inline-flex md:hidden"
          >
            <DrawerTrigger>
              <BiMenu className="text-lg" />
            </DrawerTrigger>
          </Button>
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
                        <BiX className="shrink-0 text-lg" />
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
                    <BiMessage className="text-lg" />
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
                    <BiGroup className="text-lg" />
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
                    <BiCog className="text-lg" />
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
                      <BiMoon className="text-lg" />
                      <span>Темная тема</span>
                    </Label>
                    <Switch id="dark-theme" checked={theme === "dark"} />
                  </div>
                </Button>
                <Button
                  variant="destructive"
                  className="mt-auto w-full justify-normal gap-4 px-4"
                  draggable={false}
                  size="lg"
                  disabled={isSignOutLoading}
                  onClick={async () => {
                    setIsSignOutLoading(true);
                    await signOut({
                      callbackUrl: PagePathMap.Auth,
                    });
                    setIsSignOutLoading(false);
                  }}
                >
                  <BiLogOut className="text-lg" />
                  <span>Выйти</span>
                </Button>
              </nav>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
        <div className="relative">
          <Input placeholder="Поиск" className="pl-9" />
          <span className="pointer-events-none absolute inset-y-0 ml-3 flex items-center justify-center">
            <BiSearch />
          </span>
        </div>
      </header>
      <ScrollArea className="px-4 py-3">
        <Button
          asChild
          className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
          variant="ghost"
        >
          <Link href="#">
            <Avatar fallback="US" isOnline className="row-span-2" />
            <div className="flex items-center gap-2 overflow-hidden">
              <strong className="flex-grow truncate">Владислав</strong>
              <BiCheckDouble />
              <time className="opacity-50">12:00</time>
            </div>
            <p className="truncate">Последнее сообщение</p>
          </Link>
        </Button>
      </ScrollArea>
    </aside>
  );
};
