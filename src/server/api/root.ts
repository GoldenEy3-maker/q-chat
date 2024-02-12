import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { conversationRouter } from "./routers/conversation";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  conversation: conversationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
