import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async (opts) => {
    const users = await opts.ctx.db.user.findMany({
      where: {
        id: {
          not: opts.ctx.session.user.id,
        },
      },
    });

    return users;
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const user = await opts.ctx.db.user.findUnique({
        where: {
          id: opts.input.id,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Такого пользователя не существует!",
        });

      return user;
    }),
});
