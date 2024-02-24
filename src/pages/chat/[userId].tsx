import { useRouter } from "next/router";
import { useRef } from "react";
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
import { api } from "~/libs/api";
import { type NextPageWithLayout } from "../_app";

const ChatPage: NextPageWithLayout = () => {
  const lastListElRef = useRef<HTMLParagraphElement>(null);
  const router = useRouter();

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

  return (
    <main className="container-grid grid max-h-svh grid-rows-[auto_1fr_auto]">
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
        ref={lastListElRef}
      />
      <MessageInput
        recipient={getUserByIdApi.data}
        lastListElRef={lastListElRef}
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
