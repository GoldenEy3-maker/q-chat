import { type Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import {
  BiCheck,
  BiCheckDouble,
  BiLoaderAlt,
  BiPlus,
  BiSearch,
} from "react-icons/bi";
import { api } from "~/libs/api";
import { PagePathMap } from "~/libs/enums";
import { cn } from "~/libs/utils";
import { useOnlineUsersStore } from "~/store/online-users";
import { Avatar } from "./avatar";
import { NavDrawer } from "./navdrawer";
import { NewChatDialogDrawer } from "./new-chat-dialog-drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

export const Sidebar: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const onlineUsersStore = useOnlineUsersStore();

  const [searchValue, setSearchValue] = useState("");

  const getAllConversationsApi = api.messages.getAllConversations.useQuery();

  const getLastMessage = (
    conversation: Prisma.UserGetPayload<{
      include: {
        sendedMessages: { include: { views: true } };
        recievedMessages: { include: { views: true } };
      };
    }>,
  ): Prisma.MessageGetPayload<{ include: { views: true } }> & {
    pending?: boolean;
  } => {
    const messages = conversation.recievedMessages
      .concat(conversation.sendedMessages)
      .sort((a, b) => +b.createdAt - +a.createdAt);

    return messages[0]!;
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
        conversation.recievedMessages.some((message) =>
          message.text?.toLocaleLowerCase().trim().includes(value),
        ),
    );
  }, [getAllConversationsApi, searchValue]);

  return (
    <aside
      className={cn("h-screen border-r md:sticky md:top-0", {
        "hidden md:grid": router.asPath.includes(PagePathMap.Chat),
      })}
    >
      <div className="grid h-full grid-rows-[auto_1fr]">
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
        <ScrollArea className="px-4 py-3">
          {!getAllConversationsApi.isLoading ? (
            filteredConversations.length > 0 ? (
              filteredConversations
                .sort((a, b) => {
                  const aLastMessage = getLastMessage(a);
                  const bLastMessage = getLastMessage(b);

                  return (
                    +bLastMessage.createdAt.getTime() -
                    +aLastMessage.createdAt.getTime()
                  );
                })
                .map((conversation) => {
                  const lastMessage = getLastMessage(conversation);
                  const isMyLastMessage =
                    lastMessage.senderId === session?.user.id;

                  const isViewedLastMessage = lastMessage.views.some(
                    (v) => v.id === lastMessage.recipientId,
                  );

                  const newMessages = conversation.sendedMessages.filter(
                    (message) => message.views.length === 0,
                  );

                  return (
                    <Button
                      key={conversation.id}
                      asChild
                      className="grid h-auto flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                      variant="ghost"
                    >
                      <Link href={PagePathMap.Chat + conversation.id}>
                        <Avatar
                          fallback={conversation?.name?.at(0)}
                          src={conversation?.image}
                          isOnline={onlineUsersStore.members.includes(
                            conversation.id,
                          )}
                          className="row-span-2 h-12 w-12"
                        />
                        <div className="flex items-center gap-2 overflow-hidden">
                          <strong className="flex-grow truncate">
                            {conversation?.name}
                          </strong>
                          {isMyLastMessage ? (
                            lastMessage.pending ? (
                              <BiLoaderAlt className="text-primary" />
                            ) : isViewedLastMessage ? (
                              <BiCheckDouble className="text-primary" />
                            ) : (
                              <BiCheck className="text-primary" />
                            )
                          ) : null}
                          <time
                            className="opacity-50"
                            dateTime={lastMessage?.createdAt.toISOString()}
                          >
                            {dayjs(lastMessage?.createdAt).format("HH:mm")}
                          </time>
                        </div>
                        <div className="flex items-center gap-2 overflow-hidden">
                          <p className="flex-1 truncate text-muted-foreground">
                            {lastMessage?.text}
                          </p>
                          {newMessages.length > 0 ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                              {newMessages.length}
                            </span>
                          ) : null}
                        </div>
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
                className="grid h-auto flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                variant="ghost"
              >
                <Skeleton className="row-span-2 h-12 w-12 rounded-full" />
                <Skeleton className="col-start-2 row-start-1 h-2 w-[10rem]" />
                <Skeleton className="col-start-2 row-start-2 h-2 w-[7rem]" />
              </Button>
              <Button
                className="grid h-auto flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                variant="ghost"
              >
                <Skeleton className="row-span-2 h-12 w-12 rounded-full" />
                <Skeleton className="col-start-2 row-start-1 h-2 w-[10rem]" />
                <Skeleton className="col-start-2 row-start-2 h-2 w-[7rem]" />
              </Button>
              <Button
                className="grid h-auto flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                variant="ghost"
              >
                <Skeleton className="row-span-2 h-12 w-12 rounded-full" />
                <Skeleton className="col-start-2 row-start-1 h-2 w-[10rem]" />
                <Skeleton className="col-start-2 row-start-2 h-2 w-[7rem]" />
              </Button>
              <Button
                className="grid h-auto flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                variant="ghost"
              >
                <Skeleton className="row-span-2 h-12 w-12 rounded-full" />
                <Skeleton className="col-start-2 row-start-1 h-2 w-[10rem]" />
                <Skeleton className="col-start-2 row-start-2 h-2 w-[7rem]" />
              </Button>
              <Button
                className="grid h-auto flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
                variant="ghost"
              >
                <Skeleton className="row-span-2 h-12 w-12 rounded-full" />
                <Skeleton className="col-start-2 row-start-1 h-2 w-[10rem]" />
                <Skeleton className="col-start-2 row-start-2 h-2 w-[7rem]" />
              </Button>
              <Button
                className="grid h-auto flex-shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
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
      </div>
    </aside>
  );
};
