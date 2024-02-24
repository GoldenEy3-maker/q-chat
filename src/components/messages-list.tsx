import { type Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { BiMessageSquareX } from "react-icons/bi";
import { cn } from "~/libs/utils";
import { Avatar } from "./avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

type MessagesListProps = {
  messages: Prisma.MessageGetPayload<{
    include: {
      sender: {
        select: {
          email: true;
          id: true;
          image: true;
          name: true;
          lastOnlineAt: true;
          username: true;
        };
      };
      recipient: {
        select: {
          email: true;
          id: true;
          image: true;
          name: true;
          lastOnlineAt: true;
          username: true;
        };
      };
    };
  }>[];
  isLoading: boolean;
};

const useAutoScrollToBottom = (
  ref: React.RefObject<HTMLDivElement>,
  isLoading: boolean,
) => {
  useEffect(() => {
    if (ref.current && !isLoading) {
      ref.current.scrollIntoView();
    }
  }, [isLoading, ref]);
};

export const MessagesList = forwardRef<HTMLParagraphElement, MessagesListProps>(
  ({ messages, isLoading }, ref) => {
    const { data: sesssion } = useSession();
    const lastListElRef = useRef<HTMLParagraphElement>(null);

    const groupMessages = () => {
      const firstMsg = messages[0];

      if (!firstMsg) return [];

      const newMessages = messages.slice(1).reduce(
        (acc, m) => {
          const lastMessages = acc.at(-1)!;
          const lastMsg = lastMessages.at(-1);

          if (
            (lastMsg?.senderId === m.senderId ||
              lastMsg?.recipientId === m.recipientId) &&
            dayjs(m.createdAt).diff(lastMsg?.createdAt, "minute") < 5
          ) {
            lastMessages?.push(m);
            acc[acc.length - 1] = lastMessages;
          } else {
            acc.push([m]);
          }

          return acc;
        },
        [[firstMsg]],
      );

      const groups = newMessages.reduce<Record<number, typeof messages>>(
        (acc, m) => {
          const message = m.at(-1)!;

          acc[message.createdAt.getTime()] = m;
          return acc;
        },
        {},
      );

      return groups;
    };

    useImperativeHandle(ref, () => {
      return lastListElRef.current!;
    });

    useAutoScrollToBottom(lastListElRef, isLoading);

    return (
      <>
        <ScrollArea
          className="py-3"
          fullWidthContainer
          isScrollLock={isLoading}
        >
          {!isLoading ? (
            messages.length > 0 ? (
              Object.entries(groupMessages()).map(([key, messages]) => {
                const isMyMessage = sesssion?.user.id === messages[0]?.senderId;

                return (
                  <div
                    key={key}
                    className={cn("flex items-end gap-2", {
                      "justify-end": isMyMessage,
                    })}
                  >
                    <Avatar
                      src={
                        isMyMessage
                          ? messages[0]?.sender.image
                          : messages[0]?.recipient?.image
                      }
                      alt="Аватар пользователя"
                      fallback={
                        isMyMessage
                          ? messages[0]?.sender.name?.at(0)
                          : messages[0]?.recipient?.name?.at(0)
                      }
                      className={cn("sticky bottom-0 left-0 flex-shrink-0", {
                        "order-2": isMyMessage,
                      })}
                    />
                    <div
                      className={cn("flex flex-col gap-1 overflow-hidden", {
                        "items-end": isMyMessage,
                      })}
                    >
                      {messages.map((m) => (
                        <p
                          key={m.id}
                          ref={lastListElRef}
                          className={cn(
                            "w-max whitespace-pre-wrap rounded-lg bg-secondary p-2 [overflow-wrap:break-word]",
                            {
                              "bg-primary text-background": isMyMessage,
                            },
                          )}
                        >
                          {isMyMessage ? (
                            <>
                              {m.text}{" "}
                              <sub>{dayjs(m.createdAt).format("HH:mm")}</sub>
                            </>
                          ) : (
                            <>
                              <sub>{dayjs(m.createdAt).format("HH:mm")}</sub>{" "}
                              {m.text}
                            </>
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="m-auto flex flex-col items-center justify-center">
                <BiMessageSquareX className="mb-2 text-7xl" />
                <p className="text-center text-xl">
                  У вас пока нет сообщений с этим пользователем!
                </p>
              </div>
            )
          ) : (
            <>
              <div className="flex items-end gap-2">
                <Skeleton className="sticky bottom-0 left-0 h-10 w-10 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-14 w-[13rem]" />
                  <Skeleton className="h-6 w-[8rem]" />
                </div>
              </div>
              <div className="ml-auto flex items-end gap-2">
                <Skeleton className="sticky bottom-0 left-0 order-2 h-10 w-10 rounded-full" />
                <div className="flex flex-col items-end gap-2">
                  <Skeleton className="h-6 w-[8rem]" />
                  <Skeleton className="h-14 w-[13rem]" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <Skeleton className="sticky bottom-0 left-0 h-10 w-10 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-14 w-[13rem]" />
                </div>
              </div>
              <div className="ml-auto flex items-end gap-2">
                <Skeleton className="sticky bottom-0 left-0 order-2 h-10 w-10 rounded-full" />
                <div className="flex flex-col items-end gap-2">
                  <Skeleton className="h-14 w-[13rem]" />
                  <Skeleton className="h-6 w-[10rem]" />
                  <Skeleton className="h-6 w-[6rem]" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <Skeleton className="sticky bottom-0 left-0 h-10 w-10 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-6 w-[10rem]" />
                  <Skeleton className="h-6 w-[6rem]" />
                </div>
              </div>
              <div className="ml-auto flex items-end gap-2">
                <Skeleton className="sticky bottom-0 left-0 order-2 h-10 w-10 rounded-full" />
                <div className="flex flex-col items-end gap-2">
                  <Skeleton className="h-8 w-[10rem]" />
                  <Skeleton className="h-8 w-[6rem]" />
                </div>
              </div>
            </>
          )}
        </ScrollArea>
      </>
    );
  },
);

MessagesList.displayName = "MessagesList";
