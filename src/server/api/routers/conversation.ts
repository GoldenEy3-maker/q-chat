import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const conversationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async (opts) => {
    const conversations = await opts.ctx.db.conversation.findMany({
      where: {
        OR: [
          {
            creatorId: opts.ctx.session.user.id,
          },
          {
            memberId: opts.ctx.session.user.id,
            messages: {
              some: {
                NOT: [
                  {
                    text: null,
                    images: {
                      isEmpty: true,
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      include: {
        member: true,
        messages: true,
        creator: true,
      },
    });

    return conversations;
  }),

  create: protectedProcedure
    .input(z.object({ companionId: z.string() }))
    .mutation(async (opts) => {
      const alreadyExistConversation = await opts.ctx.db.conversation.findFirst(
        {
          where: {
            OR: [
              {
                AND: [
                  {
                    memberId: opts.input.companionId,
                  },
                  {
                    creatorId: opts.ctx.session.user.id,
                  },
                ],
              },
              {
                AND: [
                  {
                    memberId: opts.ctx.session.user.id,
                  },
                  {
                    creatorId: opts.input.companionId,
                  },
                ],
              },
            ],
          },
        },
      );

      if (alreadyExistConversation)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "У вас уже есть диалог с этим пользователем!",
        });

      // const companion = await opts.ctx.db.user.findUnique({
      //   where: {
      //     id: opts.input.companionId,
      //   },
      // });

      // if (!companion)
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Такого пользователя не найдено!",
      //   });

      const newConversation = await opts.ctx.db.conversation.create({
        data: {
          creatorId: opts.ctx.session.user.id,
          memberId: opts.input.companionId,
        },
      });

      return newConversation;
    }),
});
