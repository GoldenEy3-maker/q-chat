import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";
import { messagesRouter } from "./routers/messages";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  messages: messagesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
