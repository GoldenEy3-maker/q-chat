import { z } from "zod";
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
      });

      return newMessage;
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
                recivedMessages: {
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
        recivedMessages: {
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
