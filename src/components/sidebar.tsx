import { type Prisma } from "@prisma/client";
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

  const getAllConversationsApi = api.messages.getAllConversations.useQuery();

  const getLastMessage = (
    conversation: Prisma.UserGetPayload<{
      include: { sendedMessages: true; recivedMessages: true };
    }>,
  ) => {
    const messages = [
      ...conversation.sendedMessages,
      ...conversation.recivedMessages,
    ].sort((a, b) => +b.createdAt - +a.createdAt);

    return messages[0];
  };

  const filteredConversations = useMemo(() => {
    if (getAllConversationsApi.isLoading || !getAllConversationsApi.data)
      return [];

    const value = searchValue.toLocaleLowerCase().trim();

    return getAllConversationsApi.data.filter(
      (conversation) =>
        conversation.name?.toLocaleLowerCase().trim().includes(value) ||
        conversation.username?.toLocaleLowerCase().trim().includes(value) ||
        conversation.email?.toLocaleLowerCase().trim().includes(value) ||
        conversation.sendedMessages.some((message) =>
          message.text?.toLocaleLowerCase().trim().includes(value),
        ) ||
        conversation.recivedMessages.some((message) =>
          message.text?.toLocaleLowerCase().trim().includes(value),
        ),
    );
  }, [getAllConversationsApi, searchValue]);

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
        {!getAllConversationsApi.isLoading ? (
          filteredConversations.length > 0 ? (
            filteredConversations
              .sort((a, b) => {
                const aLastMessage = getLastMessage(a)!;
                const bLastMessage = getLastMessage(b)!;

                return (
                  +bLastMessage.createdAt.getTime() -
                  +aLastMessage.createdAt.getTime()
                );
              })
              .map((conversation) => {
                const lastMessage = getLastMessage(conversation)!;

                return (
                  <Button
                    key={conversation.id}
                    asChild
                    className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                    variant="ghost"
                  >
                    <Link href={PagePathMap.Chat + conversation.id}>
                      <Avatar
                        fallback={conversation?.name?.at(0)}
                        src={conversation?.image}
                        isOnline
                        className="row-span-2 h-12 w-12"
                      />
                      <div className="flex items-center gap-2 overflow-hidden">
                        <strong className="flex-grow truncate">
                          {conversation?.name}
                        </strong>
                        <BiCheckDouble className="text-xl text-primary" />
                        <time
                          className="opacity-50"
                          dateTime={lastMessage?.createdAt.toISOString()}
                        >
                          {dayjs(lastMessage?.createdAt).format("HH:mm")}
                        </time>
                      </div>
                      <p className="truncate text-muted-foreground">
                        {lastMessage?.text}
                      </p>
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
        )}
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
