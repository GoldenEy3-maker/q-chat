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
});
