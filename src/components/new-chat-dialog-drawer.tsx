import { useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useMediaQuery } from "usehooks-ts";
import { api } from "~/libs/api";
import { cn } from "~/libs/utils";
import { Avatar } from "./avatar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

export const NewChatDialogDrawer: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [snap, setSnap] = useState<number | string | null>("500px");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const getAllUsersApi = api.user.getAll.useQuery(undefined, {
    enabled: isOpen,
  });

  const filteredUsers = useMemo(() => {
    if (getAllUsersApi.isLoading || !getAllUsersApi.data) return [];

    const value = searchValue.toLocaleLowerCase().trim();

    return getAllUsersApi.data.filter(
      (user) =>
        user.name?.toLocaleLowerCase().trim().includes(value) ||
        user.email?.toLocaleLowerCase().trim().includes(value),
    );
  }, [getAllUsersApi, searchValue]);

  if (isDesktop)
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Новый собеседник</DialogTitle>
            <DialogDescription>
              Выберите, с кем вы бы хотели начать общение
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Input
              placeholder="Поиск"
              className="pl-9"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <span className="absolute inset-y-0 ml-3 flex items-center justify-center">
              <BiSearch />
            </span>
          </div>
          <div className="grid gap-2">
            {!getAllUsersApi.isLoading ? (
              filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="ghost"
                    className="grid h-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
                  >
                    <Avatar
                      className="row-span-2"
                      fallback={user.name?.at(0)}
                      src={user.image}
                      alt="Аватар пользователя"
                      isOnline
                    />
                    <strong className="truncate">{user.name}</strong>
                    <span className="truncate text-muted-foreground">
                      Онлайн
                    </span>
                  </Button>
                ))
              ) : (
                <p className="py-4 text-center">Ничего не найдено</p>
              )
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="grid h-14 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                >
                  <Skeleton className="row-span-2 h-10 w-10 rounded-full" />
                  <Skeleton className="h-2 w-[10rem]" />
                  <Skeleton className="h-2 w-[7rem]" />
                </Button>
                <Button
                  variant="ghost"
                  className="grid h-14 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                >
                  <Skeleton className="row-span-2 h-10 w-10 rounded-full" />
                  <Skeleton className="h-2 w-[10rem]" />
                  <Skeleton className="h-2 w-[7rem]" />
                </Button>
                <Button
                  variant="ghost"
                  className="grid h-14 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                >
                  <Skeleton className="row-span-2 h-10 w-10 rounded-full" />
                  <Skeleton className="h-2 w-[10rem]" />
                  <Skeleton className="h-2 w-[7rem]" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      // snapPoints={["500px", 1]}
      // activeSnapPoint={snap}
      // setActiveSnapPoint={setSnap}
      shouldScaleBackground={false}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="grid max-h-[95%] grid-rows-[auto_auto_1fr]">
        <DrawerHeader>
          <DrawerTitle>Новый собеседник</DrawerTitle>
          <DrawerDescription>
            Выберите, с кем вы бы хотели начать общение
          </DrawerDescription>
        </DrawerHeader>
        <div className="relative p-4">
          <Input
            placeholder="Поиск"
            className="pl-9"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <span className="absolute inset-y-0 ml-3 flex items-center justify-center">
            <BiSearch />
          </span>
        </div>
        <div className={"grid gap-2 overflow-auto px-4 pb-4"}>
          {!getAllUsersApi.isLoading ? (
            <ScrollArea>
              <Button
                variant="ghost"
                className="grid h-max w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
              >
                <Avatar
                  className="row-span-2"
                  fallback="D"
                  alt="Аватар пользователя"
                  isOnline
                />
                <strong className="truncate">Danil</strong>
                <span className="truncate text-muted-foreground">Онлайн</span>
              </Button>
              <Button
                variant="ghost"
                className="grid h-max w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
              >
                <Avatar
                  className="row-span-2"
                  fallback="D"
                  alt="Аватар пользователя"
                  isOnline
                />
                <strong className="truncate">Danil</strong>
                <span className="truncate text-muted-foreground">Онлайн</span>
              </Button>
              <Button
                variant="ghost"
                className="grid h-max w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
              >
                <Avatar
                  className="row-span-2"
                  fallback="D"
                  alt="Аватар пользователя"
                  isOnline
                />
                <strong className="truncate">Danil</strong>
                <span className="truncate text-muted-foreground">Онлайн</span>
              </Button>
              <Button
                variant="ghost"
                className="grid h-max w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
              >
                <Avatar
                  className="row-span-2"
                  fallback="D"
                  alt="Аватар пользователя"
                  isOnline
                />
                <strong className="truncate">Danil</strong>
                <span className="truncate text-muted-foreground">Онлайн</span>
              </Button>
              <Button
                variant="ghost"
                className="grid h-max w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
              >
                <Avatar
                  className="row-span-2"
                  fallback="D"
                  alt="Аватар пользователя"
                  isOnline
                />
                <strong className="truncate">Danil</strong>
                <span className="truncate text-muted-foreground">Онлайн</span>
              </Button>
              <Button
                variant="ghost"
                className="grid h-max w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
              >
                <Avatar
                  className="row-span-2"
                  fallback="D"
                  alt="Аватар пользователя"
                  isOnline
                />
                <strong className="truncate">Danil</strong>
                <span className="truncate text-muted-foreground">Онлайн</span>
              </Button>
              <Button
                variant="ghost"
                className="grid h-max w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
              >
                <Avatar
                  className="row-span-2"
                  fallback="D"
                  alt="Аватар пользователя"
                  isOnline
                />
                <strong className="truncate">Danil</strong>
                <span className="truncate text-muted-foreground">Онлайн</span>
              </Button>
              <Button
                variant="ghost"
                className="grid h-max w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
              >
                <Avatar
                  className="row-span-2"
                  fallback="D"
                  alt="Аватар пользователя"
                  isOnline
                />
                <strong className="truncate">Danil</strong>
                <span className="truncate text-muted-foreground">Онлайн</span>
              </Button>
              <Button
                variant="ghost"
                className="grid h-max w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
              >
                <Avatar
                  className="row-span-2"
                  fallback="D"
                  alt="Аватар пользователя"
                  isOnline
                />
                <strong className="truncate">Danil</strong>
                <span className="truncate text-muted-foreground">Онлайн</span>
              </Button>
              <Button
                variant="ghost"
                className="grid h-max w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
              >
                <Avatar
                  className="row-span-2"
                  fallback="D"
                  alt="Аватар пользователя"
                  isOnline
                />
                <strong className="truncate">Danil</strong>
                <span className="truncate text-muted-foreground">Онлайн</span>
              </Button>
              <Button
                variant="ghost"
                className="grid h-max w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
              >
                <Avatar
                  className="row-span-2"
                  fallback="D"
                  alt="Аватар пользователя"
                  isOnline
                />
                <strong className="truncate">Danil</strong>
                <span className="truncate text-muted-foreground">Онлайн</span>
              </Button>
              <Button
                variant="ghost"
                className="grid h-max w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
              >
                <Avatar
                  className="row-span-2"
                  fallback="D"
                  alt="Аватар пользователя"
                  isOnline
                />
                <strong className="truncate">Danil</strong>
                <span className="truncate text-muted-foreground">Онлайн</span>
              </Button>
              <Button
                variant="ghost"
                className="grid h-max w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
              >
                <Avatar
                  className="row-span-2"
                  fallback="D"
                  alt="Аватар пользователя"
                  isOnline
                />
                <strong className="truncate">Danil</strong>
                <span className="truncate text-muted-foreground">Онлайн</span>
              </Button>
              <Button
                variant="ghost"
                className="grid h-max w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
              >
                <Avatar
                  className="row-span-2"
                  fallback="D"
                  alt="Аватар пользователя"
                  isOnline
                />
                <strong className="truncate">Danil</strong>
                <span className="truncate text-muted-foreground">Онлайн</span>
              </Button>
            </ScrollArea>
          ) : (
            // filteredUsers.length > 0 ? (
            //   filteredUsers.map((user) => (
            //     <Button
            //       key={user.id}
            //       variant="ghost"
            //       className="grid h-full grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
            //     >
            //       <Avatar
            //         className="row-span-2"
            //         fallback={user.name?.at(0)}
            //         src={user.image}
            //         alt="Аватар пользователя"
            //         isOnline
            //       />
            //       <strong className="truncate">{user.name}</strong>
            //       <span className="truncate text-muted-foreground">Онлайн</span>
            //     </Button>
            //   ))
            // ) : (
            //   <p className="py-4 text-center">Ничего не найдено</p>
            // )
            <>
              <Button
                variant="ghost"
                className="grid h-14 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
              >
                <Skeleton className="row-span-2 h-10 w-10 rounded-full" />
                <Skeleton className="h-2 w-[10rem]" />
                <Skeleton className="h-2 w-[7rem]" />
              </Button>
              <Button
                variant="ghost"
                className="grid h-14 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
              >
                <Skeleton className="row-span-2 h-10 w-10 rounded-full" />
                <Skeleton className="h-2 w-[10rem]" />
                <Skeleton className="h-2 w-[7rem]" />
              </Button>
              <Button
                variant="ghost"
                className="grid h-14 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
              >
                <Skeleton className="row-span-2 h-10 w-10 rounded-full" />
                <Skeleton className="h-2 w-[10rem]" />
                <Skeleton className="h-2 w-[7rem]" />
              </Button>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
