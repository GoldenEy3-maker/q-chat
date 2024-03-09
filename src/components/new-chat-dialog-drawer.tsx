import dayjs from "dayjs";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useMediaQuery } from "usehooks-ts";
import { api } from "~/libs/api";
import { PagePathMap } from "~/libs/enums";
import { useOnlineUsersStore } from "~/store/online-users";
import { Avatar } from "./avatar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

export const NewChatDialogDrawer: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const onlineUsersStore = useOnlineUsersStore();

  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
        <DialogContent className="grid grid-rows-[auto_auto_1fr] overflow-hidden p-0 sm:max-w-[425px]">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Новый собеседник</DialogTitle>
            <DialogDescription>
              Выберите, с кем вы бы хотели начать общение
            </DialogDescription>
          </DialogHeader>
          <div className="relative px-6">
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
          <ScrollArea className="px-6 pb-4">
            {!getAllUsersApi.isLoading ? (
              filteredUsers.length > 0 ? (
                filteredUsers
                  .sort((a, b) => {
                    return (
                      +b.lastOnlineAt.getTime() - +a.lastOnlineAt.getTime()
                    );
                  })
                  .map((user) => {
                    const isOnline = onlineUsersStore.members.includes(user.id);

                    return (
                      <Button
                        key={user.id}
                        variant="ghost"
                        className="grid h-max w-full flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href={PagePathMap.Chat + user.id}>
                          <Avatar
                            className="row-span-2"
                            fallback={user.name?.at(0)}
                            src={user.image}
                            alt="Аватар пользователя"
                            isOnline={isOnline}
                          />
                          <strong className="truncate">{user.name}</strong>
                          <span className="truncate text-muted-foreground">
                            {isOnline
                              ? "Онлайн"
                              : "Был(а) в сети " +
                                dayjs(user.lastOnlineAt).fromNow()}
                          </span>
                        </Link>
                      </Button>
                    );
                  })
              ) : (
                <p className="py-4 text-center">Ничего не найдено</p>
              )
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="grid h-14 flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                >
                  <Skeleton className="row-span-2 h-10 w-10 rounded-full" />
                  <Skeleton className="h-2 w-[10rem]" />
                  <Skeleton className="h-2 w-[7rem]" />
                </Button>
                <Button
                  variant="ghost"
                  className="grid h-14 flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                >
                  <Skeleton className="row-span-2 h-10 w-10 rounded-full" />
                  <Skeleton className="h-2 w-[10rem]" />
                  <Skeleton className="h-2 w-[7rem]" />
                </Button>
                <Button
                  variant="ghost"
                  className="grid h-14 flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                >
                  <Skeleton className="row-span-2 h-10 w-10 rounded-full" />
                  <Skeleton className="h-2 w-[10rem]" />
                  <Skeleton className="h-2 w-[7rem]" />
                </Button>
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
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
        <div className={"grid gap-2 overflow-auto pb-4"}>
          <ScrollArea className="px-4">
            {!getAllUsersApi.isLoading ? (
              filteredUsers.length > 0 ? (
                filteredUsers
                  .sort((a, b) => {
                    return (
                      +b.lastOnlineAt.getTime() - +a.lastOnlineAt.getTime()
                    );
                  })
                  .map((user) => {
                    const isOnline = onlineUsersStore.members.includes(user.id);

                    return (
                      <Button
                        key={user.id}
                        variant="ghost"
                        className="grid h-max flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2 text-left"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href={PagePathMap.Chat + user.id}>
                          <Avatar
                            className="row-span-2"
                            fallback={user.name?.at(0)}
                            src={user.image}
                            alt="Аватар пользователя"
                            isOnline={isOnline}
                          />
                          <strong className="truncate">{user.name}</strong>
                          <span className="truncate text-muted-foreground">
                            {isOnline
                              ? "Онлайн"
                              : "Был(а) в сети " +
                                dayjs(user.lastOnlineAt).fromNow()}
                          </span>
                        </Link>
                      </Button>
                    );
                  })
              ) : (
                <p className="py-4 text-center">Ничего не найдено</p>
              )
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="grid h-14 flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                >
                  <Skeleton className="row-span-2 h-10 w-10 rounded-full" />
                  <Skeleton className="h-2 w-[10rem]" />
                  <Skeleton className="h-2 w-[7rem]" />
                </Button>
                <Button
                  variant="ghost"
                  className="grid h-14 flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                >
                  <Skeleton className="row-span-2 h-10 w-10 rounded-full" />
                  <Skeleton className="h-2 w-[10rem]" />
                  <Skeleton className="h-2 w-[7rem]" />
                </Button>
                <Button
                  variant="ghost"
                  className="grid h-14 flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                >
                  <Skeleton className="row-span-2 h-10 w-10 rounded-full" />
                  <Skeleton className="h-2 w-[10rem]" />
                  <Skeleton className="h-2 w-[7rem]" />
                </Button>
              </>
            )}
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
