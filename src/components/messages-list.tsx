import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { BiCheck, BiMessageSquareX } from "react-icons/bi";
import { type RouterOutputs } from "~/libs/api";
import { cn } from "~/libs/utils";
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
    const { data: sesssion } = useSession();
    const lastListElRef = useRef<HTMLDivElement>(null);

    const groupMessages = () => {
      const firstMsg = messages[0];

      if (!firstMsg) return [];

      const newMessages = messages.slice(1).reduce(
        (acc, m) => {
          const lastMessages = acc.at(-1)!;
          const lastMsg = lastMessages.at(-1);

          if (
            lastMsg?.senderId === m.senderId &&
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
                    {/* <Avatar
                      src={messages[0]?.sender.image}
                      alt="Аватар пользователя"
                      fallback={messages[0]?.sender.name?.at(0)}
                      className={cn("sticky bottom-0 left-0 flex-shrink-0", {
                        "order-2": isMyMessage,
                      })}
                    /> */}
                    <div
                      className={cn(
                        "flex flex-col gap-[0.1rem] overflow-hidden",
                        {
                          "items-end": isMyMessage,
                        },
                      )}
                    >
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className={cn(
                            "flex max-w-[85%] flex-wrap items-end gap-x-2 rounded-lg bg-secondary p-2",
                            {
                              "bg-primary text-background": isMyMessage,
                            },
                          )}
                        >
                          <p
                            className={cn(
                              "whitespace-pre-wrap [overflow-wrap:anywhere]",
                            )}
                          >
                            {m.text}
                          </p>
                          <div className="flex flex-1 items-center justify-end gap-2">
                            <span className="text-xs">
                              {dayjs(m.createdAt).format("HH:mm")}
                            </span>
                            {isMyMessage ? (
                              <BiCheck className="flex-shrink-0 text-xl" />
                            ) : null}
                          </div>
                        </div>
                      ))}
                      <div ref={lastListElRef} />
                    </div>
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
