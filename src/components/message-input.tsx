import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { BiPaperclip, BiSolidSend } from "react-icons/bi";
import { toast } from "sonner";
import { api, type RouterOutputs } from "~/libs/api";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type MessageInputProps = {
  recipient: RouterOutputs["user"]["getById"] | undefined;
  lastListElRef: React.RefObject<HTMLDivElement>;
};

export const MessageInput: React.FC<MessageInputProps> = ({
  recipient,
  lastListElRef,
}) => {
  const { data: session } = useSession();
  const [textAreaValue, setTextAreaValue] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const utils = api.useUtils();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const sendToRecipientApi = api.messages.sendToRecipient.useMutation({
    async onMutate(newMessage) {
      if (!recipient || !session?.user) return;

      await utils.messages.getByRecipientId.cancel();
      await utils.messages.getAllConversations.cancel();
      const prevDataMessages = utils.messages.getByRecipientId.getData();
      const prevDataConversations =
        utils.messages.getAllConversations.getData();

      utils.messages.getAllConversations.setData(undefined, (old) => {
        if (!old) return;

        return old.map((conversation) => {
          if (conversation.id === recipient.id) {
            return {
              ...conversation,
              recievedMessages: [
                ...conversation.recievedMessages,
                {
                  id: crypto.randomUUID(),
                  createdAt: new Date(),
                  images: newMessage.images,
                  text: newMessage.text!,
                  isEdited: false,
                  isRecipientReaded: false,
                  recipientId: recipient.id,
                  senderId: session.user.id,
                  channelId: null,
                  groupId: null,
                  views: [],
                  pending: true,
                },
              ],
            };
          }

          return conversation;
        });
      });

      utils.messages.getByRecipientId.setData({ id: recipient.id }, (old) => {
        if (!old) return;

        return [
          ...old,
          {
            id: crypto.randomUUID(),
            createdAt: new Date(),
            images: newMessage.images,
            text: newMessage.text!,
            isEdited: false,
            isRecipientReaded: false,
            recipientId: recipient.id,
            senderId: session.user.id,
            sender: session.user,
            recipient: recipient,
            channelId: null,
            groupId: null,
            views: [],
            pending: true,
          },
        ];
      });

      setTimeout(() => {
        lastListElRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 0);

      setTextAreaValue("");
      if (textAreaRef.current) textAreaRef.current.style.height = "2.25rem";

      return { prevDataMessages, prevDataConversations };
    },
    onError(error) {
      toast.error(error.message);
      console.error(error);
    },
    onSettled() {
      // Sync with server once mutation has settled
      void utils.messages.getByRecipientId.invalidate();
      void utils.messages.getAllConversations.invalidate();
    },
  });

  const mutateHandler = () => {
    if (!recipient?.id || !textAreaValue) return;

    sendToRecipientApi.mutate({
      id: recipient.id,
      images: [],
      text: textAreaValue,
    });
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    mutateHandler();
  };

  return (
    <form
      className="full-width sticky top-[100dvh] border-t bg-background"
      onSubmit={submitHandler}
      ref={formRef}
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
          className="no-scrollbar flex h-9 max-h-40 min-h-full resize-none items-center justify-center border-none py-2 shadow-none"
          name="text"
          placeholder="Написать сообщение..."
          ref={textAreaRef}
          value={textAreaValue}
          onKeyDown={(event) => {
            if (event.code === "Enter" && !event.shiftKey) {
              event.preventDefault();
              mutateHandler();
            }
          }}
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
