import { router } from "../trpc";
import { authRouter } from "./auth";
import { postsRouter } from "./posts";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  posts: postsRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
