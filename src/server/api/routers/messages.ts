import { z } from "zod";
import { PusherChannelEventMap } from "~/libs/enums";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const messagesRouter = createTRPCRouter({
  getByRecipientId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const messages = await opts.ctx.db.message.findMany({
        where: {
          OR: [
            {
              recipientId: opts.input.id,
              senderId: opts.ctx.session.user.id,
            },
            {
              recipientId: opts.ctx.session.user.id,
              senderId: opts.input.id,
            },
          ],
        },
        include: {
          sender: {
            select: {
              email: true,
              id: true,
              image: true,
              name: true,
              lastOnlineAt: true,
              username: true,
            },
          },
          recipient: {
            select: {
              email: true,
              id: true,
              image: true,
              name: true,
              lastOnlineAt: true,
              username: true,
            },
          },
          views: true,
        },
        orderBy: {
          createdAt: "asc",
        },
        // take: 20,
      });

      return messages;
    }),

  sendToRecipient: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string().optional(),
        images: z.array(z.string()),
      }),
    )
    .mutation(async (opts) => {
      const newMessage = await opts.ctx.db.message.create({
        data: {
          senderId: opts.ctx.session.user.id,
          recipientId: opts.input.id,
          text: opts.input.text,
          images: opts.input.images,
        },
        include: {
          sender: true,
          recipient: true,
          views: true,
        },
      });

      await opts.ctx.pusher.trigger(
        `user-${opts.input.id}`,
        PusherChannelEventMap.IncomingMessage,
        newMessage,
      );

      return newMessage;
    }),

  viewMessage: protectedProcedure
    .input(z.object({ messageId: z.string(), recipientId: z.string() }))
    .mutation(async (opts) => {
      const updatedMessage = await opts.ctx.db.message.update({
        where: {
          id: opts.input.messageId,
        },
        data: {
          views: {
            connect: {
              id: opts.input.recipientId,
            },
          },
        },
      });

      await opts.ctx.pusher.trigger(
        `user-${updatedMessage.senderId}`,
        PusherChannelEventMap.ViewingMessage,
        updatedMessage,
      );

      return updatedMessage;
    }),

  getAllConversations: protectedProcedure.query(async (opts) => {
    const users = await opts.ctx.db.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: opts.ctx.session.user.id,
            },
          },
          {
            OR: [
              {
                recievedMessages: {
                  some: {
                    OR: [
                      {
                        recipientId: opts.ctx.session.user.id,
                      },
                      {
                        senderId: opts.ctx.session.user.id,
                      },
                    ],
                  },
                },
              },
              {
                sendedMessages: {
                  some: {
                    OR: [
                      {
                        recipientId: opts.ctx.session.user.id,
                      },
                      {
                        senderId: opts.ctx.session.user.id,
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        sendedMessages: {
          include: {
            views: true,
          },
          where: {
            OR: [
              {
                senderId: opts.ctx.session.user.id,
              },
              {
                recipientId: opts.ctx.session.user.id,
              },
            ],
          },
          // take: -1,
        },
        recievedMessages: {
          include: {
            views: true,
          },
          where: {
            OR: [
              {
                senderId: opts.ctx.session.user.id,
              },
              {
                recipientId: opts.ctx.session.user.id,
              },
            ],
          },
          // take: -1,
        },
      },
    });

    return users;
  }),
});
