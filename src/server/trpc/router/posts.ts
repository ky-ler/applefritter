import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.post.findMany({
        select: {
          user: true,
          content: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error(error);
    }
  }),
  createPost: protectedProcedure
    .input(
      z.object({
        authorId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.post.create({
          data: {
            authorId: input.authorId,
            content: input.content,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }),
});
