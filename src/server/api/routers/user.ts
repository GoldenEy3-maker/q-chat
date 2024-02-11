import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async (opts) => {
    const users = await opts.ctx.db.user.findMany({
      where: {
        email: {
          not: opts.ctx.session.user.email,
        },
      },
    });

    return users;
  }),
});
