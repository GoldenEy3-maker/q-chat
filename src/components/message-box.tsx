import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { BiCheck, BiCheckDouble, BiTimeFive } from "react-icons/bi";
import { useInView } from "react-intersection-observer";
import { api } from "~/libs/api";
import { cn } from "~/libs/utils";

type MessageBoxProps = {
  id: string;
  isMyMessage: boolean;
  text: string | null;
  createdAt: Date;
  isViewed: boolean;
  recipientId: string;
  pending?: boolean;
} & React.ComponentProps<"div">;

export const MessageBox: React.FC<MessageBoxProps> = ({
  id,
  isMyMessage,
  text,
  createdAt,
  className,
  isViewed,
  recipientId,
  pending,
  ...props
}) => {
  const router = useRouter();
  const { data: session } = useSession();

  const utils = api.useUtils();

  const viewMessageApi = api.messages.viewMessage.useMutation({
    async onMutate(variables) {
      await utils.messages.getAllConversations.cancel();

      const prevDataConversations =
        utils.messages.getAllConversations.getData();

      utils.messages.getAllConversations.setData(undefined, (old) => {
        if (!old) return;

        return old.map((conversation) => {
          if (conversation.id === router.query.userId) {
            return {
              ...conversation,
              sendedMessages: conversation.sendedMessages.map((message) => {
                if (message.id === variables.messageId) {
                  return {
                    ...message,
                    views: [
                      ...message.views,
                      {
                        ...session!.user,
                        emailVerified: null,
                        password: null,
                      },
                    ],
                  };
                }

                return message;
              }),
            };
          }

          return conversation;
        });
      });

      return { prevDataConversations };
    },
    onSettled() {
      void utils.messages.getAllConversations.invalidate();
    },
  });

  const { ref } = useInView({
    triggerOnce: true,
    onChange(inView) {
      if (!isViewed && inView && !isMyMessage) {
        viewMessageApi.mutate({ messageId: id, recipientId });
      }
    },
  });

  return (
    <div
      ref={ref}
      className={cn(
        "flex max-w-[80%] flex-wrap items-end gap-x-2 rounded-lg bg-secondary p-2",
        {
          "bg-primary text-background": isMyMessage,
        },
        className,
      )}
      {...props}
    >
      <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">{text}</p>
      <div className="flex flex-1 items-center justify-end gap-2">
        <span className="text-xs">{dayjs(createdAt).format("HH:mm")}</span>
        {isMyMessage ? (
          pending ? (
            <BiTimeFive className="flex-shrink-0" />
          ) : isViewed ? (
            <BiCheckDouble className="flex-shrink-0" />
          ) : (
            <BiCheck className="flex-shrink-0" />
          )
        ) : null}
      </div>
    </div>
  );
};
