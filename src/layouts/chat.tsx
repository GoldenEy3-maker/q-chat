import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Navbar } from "~/components/navbar";
import { OnlineIndicator } from "~/components/online-indicator";
import { Sidebar } from "~/components/sidebar";
import { api } from "~/libs/api";
import { PusherChannelEventMap } from "~/libs/enums";
import { pusher } from "~/libs/pusher";

const useSubscribeToIncomingMessage = () => {
  const { data: session } = useSession();
  const utils = api.useUtils();

  useEffect(() => {
    if (!session?.user) return;

    const channel = pusher.subscribe(`user-${session.user.id}`);

    channel.bind(PusherChannelEventMap.IncomingMessage, async () => {
      await utils.messages.getAllConversations.invalidate();
    });

    return () => channel.unbind().unsubscribe();
  }, [session, utils.messages.getAllConversations]);
};

export const ChatLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  useSubscribeToIncomingMessage();

  return (
    <div className="grid grid-cols-[1fr] md:grid-cols-[auto_19rem_1fr]">
      <Navbar />
      <Sidebar />
      {children}
      <OnlineIndicator />
    </div>
  );
};
