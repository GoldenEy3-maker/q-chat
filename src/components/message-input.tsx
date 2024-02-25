/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { BiPaperclip, BiSolidSend } from "react-icons/bi";
import { toast } from "sonner";
import { api } from "~/libs/api";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type MessageInputProps = {
  recipient:
    | Prisma.UserGetPayload<{
        select: {
          email: true;
          id: true;
          image: true;
          name: true;
          lastOnlineAt: true;
          username: true;
        };
      }>
    | undefined;
  lastListElRef: React.RefObject<HTMLParagraphElement>;
};

export const MessageInput: React.FC<MessageInputProps> = ({
  recipient,
  lastListElRef,
}) => {
  const { data: session } = useSession();
  const [textAreaValue, setTextAreaValue] = useState("");

  const utils = api.useUtils();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const sendToRecipientApi = api.messages.sendToRecipient.useMutation({
    async onMutate(newMessage) {
      if (!recipient || !session?.user) return;

      await utils.messages.getByRecipientId.cancel();
      const prevData = utils.messages.getByRecipientId.getData();

      utils.messages.getByRecipientId.setData({ id: recipient.id }, (old) => [
        // @ts-ignore
        ...old,
        {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          images: newMessage.images,
          text: newMessage.text,
          isEdited: false,
          isRecipientReaded: false,
          recipientId: recipient.id,
          senderId: session.user.id,
          sender: session.user,
          recipient: recipient,
        },
      ]);

      setTimeout(() => {
        lastListElRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 0);

      setTextAreaValue("");
      if (textAreaRef.current) textAreaRef.current.style.height = "2.25rem";

      return { prevData };
    },
    onError(error) {
      toast.error(error.message);
      console.error(error);
    },
    onSettled() {
      // Sync with server once mutation has settled
      void utils.messages.getByRecipientId.invalidate();
    },
  });

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!recipient?.id) return;

    sendToRecipientApi.mutate({
      id: recipient.id,
      images: [],
      text: textAreaValue,
    });
  };

  return (
    <form
      className="full-width sticky bottom-0 border-t bg-background"
      onSubmit={submitHandler}
      encType="multipart/form-data"
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-end gap-2 py-2">
        <input
          type="file"
          className="peer absolute h-0 w-0 opacity-0"
          id="attachment"
          name="files"
        />
        <Button
          asChild
          type="button"
          variant="ghost"
          size="icon"
          className="cursor-pointer peer-focus-visible:outline-none peer-focus-visible:ring-1 peer-focus-visible:ring-ring"
        >
          <label htmlFor="attachment">
            <BiPaperclip className="text-xl" />
          </label>
        </Button>
        <Textarea
          className="no-scrollbar flex h-9 max-h-40 min-h-full resize-none items-center justify-center border-none py-2"
          name="text"
          placeholder="Написать сообщение..."
          ref={textAreaRef}
          value={textAreaValue}
          onChange={(event) => {
            setTextAreaValue(event.target.value);

            event.currentTarget.style.height = "2.25rem";
            event.currentTarget.style.height =
              event.currentTarget.scrollHeight + "px";
          }}
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="text-primary hover:text-primary"
        >
          <BiSolidSend className="text-xl" />
        </Button>
      </div>
    </form>
  );
};
