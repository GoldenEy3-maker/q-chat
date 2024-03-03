import dayjs from "dayjs";
import React from "react";
import { BiCheck, BiCheckDouble, BiLoader, BiLoaderAlt } from "react-icons/bi";
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
  const viewMessageApi = api.messages.viewMessage.useMutation();

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
            <BiLoaderAlt className="flex-shrink-0" />
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
