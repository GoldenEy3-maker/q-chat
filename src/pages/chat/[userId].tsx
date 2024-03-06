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
import { type NextPageWithLayout } from "../_app";

const ChatPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const scrollDownAnchorRef = useRef<HTMLDivElement>(null);

  const utils = api.useUtils();

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

  useEffect(() => {
    if (!getUserByIdApi.data || !scrollDownAnchorRef.current) return;

    const scrollAnchor = scrollDownAnchorRef.current;

    const channel = pusher.subscribe(`user-${session?.user.id}`);

    channel.bind(
      PusherChannelEventMap.IncomingMessage,
      async (newMessage: RouterOutputs["messages"]["sendToRecipient"]) => {
        await utils.messages.getByRecipientId.invalidate();
        await utils.messages.getAllConversations.invalidate();

        if (router.query.userId === newMessage.senderId) {
          setTimeout(() => {
            scrollAnchor.scrollIntoView({
              behavior: "smooth",
            });
          }, 0);
        }
      },
    );

    return () => channel.unbind().unsubscribe();
  }, [
    getUserByIdApi.data,
    router.query.userId,
    session?.user.id,
    scrollDownAnchorRef.current,
  ]);

  return (
    <main className="container-grid grid h-dvh grid-rows-[auto_1fr_auto]">
      <ChatHeader
        fallback={getUserByIdApi.data?.name?.at(0)}
        title={getUserByIdApi.data?.name ?? undefined}
        src={getUserByIdApi.data?.image}
        alt="Аватар пользователя"
        subtitle="Онлайн"
        isOnline
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
