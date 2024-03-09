import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { ChatHeader } from "~/components/chat-header";
import { MessageInput } from "~/components/message-input";
import { MessagesList } from "~/components/messages-list";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChatLayout } from "~/layouts/chat";
import { MainLayout } from "~/layouts/main";
import { api, type RouterOutputs } from "~/libs/api";
import { PusherChannelEventMap } from "~/libs/enums";
import { pusher } from "~/libs/pusher";
import { useOnlineUsersStore } from "~/store/online-users";
import { type NextPageWithLayout } from "../_app";

const useSubscribeToIncomingMessages = (
  scrollDownAnchorRef: React.RefObject<HTMLDivElement>,
) => {
  const router = useRouter();
  const { data: session } = useSession();
  const utils = api.useUtils();

  useEffect(() => {
    if (!scrollDownAnchorRef.current || !session?.user) return;

    const channel = pusher.subscribe(`user-${session.user.id}`);

    channel.bind(
      PusherChannelEventMap.IncomingMessage,
      async (newMessage: RouterOutputs["messages"]["sendToRecipient"]) => {
        await utils.messages.getByRecipientId.invalidate();

        if (router.query.userId === newMessage.senderId) {
          setTimeout(() => {
            scrollDownAnchorRef.current!.scrollIntoView({
              behavior: "smooth",
            });
          }, 0);
        }
      },
    );

    return () => channel.unbind().unsubscribe();
  }, [
    router.query.userId,
    session,
    scrollDownAnchorRef,
    utils.messages.getByRecipientId,
    utils.messages.getAllConversations,
  ]);
};

const useSubscribeToViewingMessage = () => {
  const { data: session } = useSession();
  const utils = api.useUtils();

  useEffect(() => {
    if (!session?.user) return;

    const channel = pusher.subscribe(`user-${session.user.id}`);

    channel.bind(PusherChannelEventMap.ViewingMessage, () => {
      void utils.messages.getAllConversations.invalidate();
      void utils.messages.getByRecipientId.invalidate();
    });

    return () => channel.unbind().unsubscribe();
  }, [
    session,
    utils.messages.getAllConversations,
    utils.messages.getByRecipientId,
  ]);
};

const ChatPage: NextPageWithLayout = () => {
  const router = useRouter();
  const scrollDownAnchorRef = useRef<HTMLDivElement>(null);

  const getUserByIdApi = api.user.getById.useQuery({
    id: router.query.userId as string,
  });

  const getMessagesApi = api.messages.getByRecipientId.useQuery(
    {
      id: getUserByIdApi.data ? getUserByIdApi.data.id : "",
    },
    {
      enabled: !!getUserByIdApi.data,
    },
  );

  const onlineUsersStore = useOnlineUsersStore();
  const isOnline = onlineUsersStore.members.includes(
    getUserByIdApi.data?.id ?? "",
  );

  useSubscribeToIncomingMessages(scrollDownAnchorRef);
  useSubscribeToViewingMessage();

  return (
    <main className="container-grid grid h-dvh grid-rows-[auto_1fr_auto]">
      <ChatHeader
        fallback={getUserByIdApi.data?.name?.at(0)}
        title={getUserByIdApi.data?.name ?? undefined}
        src={getUserByIdApi.data?.image}
        alt="Аватар пользователя"
        subtitle={
          isOnline
            ? "Онлайн"
            : "Был(а) в сети " +
              dayjs(getUserByIdApi.data?.lastOnlineAt).fromNow()
        }
        isOnline={isOnline}
        isLoading={getUserByIdApi.isLoading}
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <BiDotsVerticalRounded className="text-xl" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />
      <MessagesList
        messages={getMessagesApi.data ?? []}
        isLoading={getMessagesApi.isLoading}
        ref={scrollDownAnchorRef}
      />
      <MessageInput
        recipient={getUserByIdApi.data}
        listScrollDownAnchorRef={scrollDownAnchorRef}
      />
    </main>
  );
};

ChatPage.getLayout = (page) => (
  <MainLayout>
    <ChatLayout>{page}</ChatLayout>
  </MainLayout>
);

export default ChatPage;
