import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { signUpFormSchema } from "~/libs/schemas";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure.input(signUpFormSchema).mutation(async (opts) => {
    const isUserExist = await opts.ctx.db.user.findFirst({
      where: {
        OR: [
          {
            email: opts.input.email,
          },
          {
            username: opts.input.username,
          },
        ],
      },
    });

    if (isUserExist)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Такой пользователь уже существует!",
      });

    const newUser = await opts.ctx.db.user.create({
      data: {
        ...opts.input,
        password: await bcrypt.hash(opts.input.password, 12),
      },
    });

    return newUser;
  }),
});
