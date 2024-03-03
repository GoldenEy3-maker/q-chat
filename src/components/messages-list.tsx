import { type Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { BiMessageSquareX } from "react-icons/bi";
import { type RouterOutputs } from "~/libs/api";
import { cn } from "~/libs/utils";
import DateBadge from "./date-badge";
import { MessageBox } from "./message-box";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

type MessagesListProps = {
  messages: RouterOutputs["messages"]["getByRecipientId"];
  isLoading: boolean;
};

const useAutoScrollToBottom = (
  ref: React.RefObject<HTMLDivElement>,
  isLoading: boolean,
) => {
  const router = useRouter();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, [isLoading, ref, router]);
};

export const MessagesList = forwardRef<HTMLDivElement, MessagesListProps>(
  ({ messages, isLoading }, ref) => {
    const { data: session } = useSession();

    const [isScrollIdle, setIsScrollIdle] = useState(false);

    const scrollIdleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastListElRef = useRef<HTMLDivElement>(null);

    const groupMessages = () => {
      const firstMsg = messages[0];

      if (!firstMsg) return [];

      const newMessages = messages.slice(1).reduce(
        (acc, m) => {
          const lastDay = acc.at(-1)!;
          const lastMessages = lastDay.at(-1)!;
          const lastMsg = lastMessages.at(-1);

          if (
            m.createdAt.toDateString() === lastMsg?.createdAt.toDateString()
          ) {
            if (
              lastMsg?.senderId === m.senderId &&
              dayjs(m.createdAt).diff(lastMsg?.createdAt, "minute") < 5
            ) {
              lastMessages.push(m);
              lastDay[lastDay.length - 1] = lastMessages;
              acc[acc.length - 1] = lastDay;
            } else {
              lastDay.push([m]);
              acc[acc.length - 1] = lastDay;
            }
          } else {
            acc.push([[m]]);
          }

          return acc;
        },
        [[[firstMsg]]],
      );

      const groups = newMessages.reduce<Record<string, (typeof messages)[]>>(
        (acc, day) => {
          const lastGroupMessages = day.at(-1)!;
          const lastMessage = lastGroupMessages.at(-1)!;

          acc[lastMessage.createdAt.getTime()] = day;
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
          className="pb-2"
          fullWidthContainer
          isScrollLock={isLoading}
          onScroll={() => {
            if (isScrollIdle) setIsScrollIdle(false);

            if (scrollIdleTimerRef.current) {
              clearTimeout(scrollIdleTimerRef.current);
              scrollIdleTimerRef.current = null;
            }

            scrollIdleTimerRef.current = setTimeout(
              () => setIsScrollIdle(true),
              1000,
            );
          }}
        >
          {!isLoading ? (
            messages.length > 0 ? (
              Object.entries(groupMessages()).map(([key, days]) => {
                const date = days.at(-1)!.at(-1)!.createdAt;

                return (
                  <div key={key}>
                    <DateBadge date={date} isScrollIdle={isScrollIdle} />
                    {days.map((group, idx) => {
                      const isMyMessage =
                        session?.user.id === group[0]?.senderId;

                      return (
                        <div
                          key={idx}
                          className={cn(
                            "flex flex-col items-start gap-[0.1rem]",
                            {
                              // "justify-end": isMyMessage,
                              "items-end": isMyMessage,
                            },
                          )}
                        >
                          {/* <Avatar
                      src={messages[0]?.sender.image}
                      alt="Аватар пользователя"
                      fallback={messages[0]?.sender.name?.at(0)}
                      className={cn("sticky bottom-0 left-0 flex-shrink-0", {
                        "order-2": isMyMessage,
                      })}
                    /> */}
                          {/* <div
                      className={cn(
                        "flex flex-col gap-[0.1rem] overflow-hidden",
                        {
                          "items-end": isMyMessage,
                        },
                      )}
                    > */}
                          {group.map((m) => (
                            <MessageBox
                              key={m.id}
                              id={m.id}
                              text={m.text}
                              isMyMessage={isMyMessage}
                              createdAt={m.createdAt}
                              isViewed={m.views.some(
                                (v) => v.id === m.recipientId,
                              )}
                              pending={
                                // TODO: need to fix this type
                                (
                                  m as Prisma.MessageGetPayload<{
                                    include: {
                                      sender: true;
                                      recipient: true;
                                      views: true;
                                    };
                                  }> & { pending?: boolean }
                                ).pending
                              }
                              recipientId={m.recipientId!}
                            />
                          ))}
                          <div ref={lastListElRef} />
                          {/* </div> */}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            ) : (
              <div className="m-auto flex flex-col items-center justify-center">
                <BiMessageSquareX className="mb-2 text-6xl" />
                <p className="text-center">
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
