import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { BiCheckDouble, BiPlus, BiSearch } from "react-icons/bi";
import { api } from "~/libs/api";
import { PagePathMap } from "~/libs/enums";
import { cn } from "~/libs/utils";
import { Avatar } from "./avatar";
import { NavDrawer } from "./navdrawer";
import { NewChatDialogDrawer } from "./new-chat-dialog-drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchValue, setSearchValue] = useState("");
  // const getAllConversationsApi = api.conversation.getAll.useQuery();

  // const filteredConversations = useMemo(() => {
  //   if (getAllConversationsApi.isLoading || !getAllConversationsApi.data)
  //     return [];

  //   const value = searchValue.toLocaleLowerCase().trim();

  //   return getAllConversationsApi.data.filter(
  //     (conversation) =>
  //       conversation.creator.name?.toLocaleLowerCase().trim().includes(value) ||
  //       conversation.member.name?.toLocaleLowerCase().trim().includes(value) ||
  //       conversation.messages.some((message) =>
  //         message.text?.toLocaleLowerCase().trim().includes(value),
  //       ),
  //   );
  // }, [getAllConversationsApi, searchValue]);

  return (
    <aside
      className={cn(
        "grid max-h-dvh grid-rows-[auto_1fr] overflow-hidden border-r md:sticky md:left-0 md:top-0",
        {
          "hidden md:grid": router.asPath.includes(PagePathMap.Chat),
        },
      )}
    >
      <header className="mb-1 mt-4 grid grid-cols-[auto_1fr] gap-2 px-4 md:grid-cols-[1fr]">
        <NavDrawer />
        <div className="relative">
          <Input
            placeholder="Поиск"
            className="pl-9"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <span className="pointer-events-none absolute inset-y-0 ml-3 flex items-center justify-center">
            <BiSearch />
          </span>
        </div>
      </header>
      <ScrollArea className="relative px-4 py-3">
        {/* {!getAllConversationsApi.isLoading ? (
          filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              const member =
                session?.user.id === conversation.memberId
                  ? conversation.creator
                  : conversation.member;
              const lastMessage = conversation.messages.at(-1);

              return (
                <Button
                  key={conversation.id}
                  asChild
                  className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                  variant="ghost"
                >
                  <Link href="#">
                    <Avatar
                      fallback={member?.name?.at(0)}
                      src={member?.image}
                      isOnline
                      className="row-span-2 h-12 w-12"
                    />
                    <div className="flex items-center gap-2 overflow-hidden">
                      <strong className="flex-grow truncate">
                        {member?.name}
                      </strong>
                      <BiCheckDouble className="text-xl text-primary" />
                      <time
                        className="opacity-50"
                        dateTime={
                          lastMessage?.createdAt.toISOString() ??
                          conversation.createdAt.toISOString()
                        }
                      >
                        {dayjs(
                          lastMessage?.createdAt ?? conversation.createdAt,
                        ).format("HH:mm")}
                      </time>
                    </div>
                    <p className="truncate text-muted-foreground">
                      {lastMessage?.text ?? lastMessage?.images
                        ? "Фото"
                        : "Вы начали диалог"}
                    </p>
                  </Link>
                </Button>
              );
            })
          ) : (
            <p className="py-4 text-center">Ничего не найдено</p>
          )
        ) : ( */}
        <>
          <Button
            className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
            variant="ghost"
          >
            <Skeleton className="row-span-2 h-12 w-12 rounded-full" />
            <Skeleton className="col-start-2 row-start-1 h-2 w-[10rem]" />
            <Skeleton className="col-start-2 row-start-2 h-2 w-[7rem]" />
          </Button>
          <Button
            className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
            variant="ghost"
          >
            <Skeleton className="row-span-2 h-12 w-12 rounded-full" />
            <Skeleton className="col-start-2 row-start-1 h-2 w-[10rem]" />
            <Skeleton className="col-start-2 row-start-2 h-2 w-[7rem]" />
          </Button>
          <Button
            className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
            variant="ghost"
          >
            <Skeleton className="row-span-2 h-12 w-12 rounded-full" />
            <Skeleton className="col-start-2 row-start-1 h-2 w-[10rem]" />
            <Skeleton className="col-start-2 row-start-2 h-2 w-[7rem]" />
          </Button>
          <Button
            className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
            variant="ghost"
          >
            <Skeleton className="row-span-2 h-12 w-12 rounded-full" />
            <Skeleton className="col-start-2 row-start-1 h-2 w-[10rem]" />
            <Skeleton className="col-start-2 row-start-2 h-2 w-[7rem]" />
          </Button>
          <Button
            className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
            variant="ghost"
          >
            <Skeleton className="row-span-2 h-12 w-12 rounded-full" />
            <Skeleton className="col-start-2 row-start-1 h-2 w-[10rem]" />
            <Skeleton className="col-start-2 row-start-2 h-2 w-[7rem]" />
          </Button>
          <Button
            className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
            variant="ghost"
          >
            <Skeleton className="row-span-2 h-12 w-12 rounded-full" />
            <Skeleton className="col-start-2 row-start-1 h-2 w-[10rem]" />
            <Skeleton className="col-start-2 row-start-2 h-2 w-[7rem]" />
          </Button>
        </>
        {/* )} */}
        <NewChatDialogDrawer>
          <Button
            className="absolute bottom-8 right-8 z-10 h-12 w-12 rounded-full md:h-10 md:w-10"
            size="icon"
          >
            <BiPlus className="text-xl" />
          </Button>
        </NewChatDialogDrawer>
      </ScrollArea>
    </aside>
  );
};
