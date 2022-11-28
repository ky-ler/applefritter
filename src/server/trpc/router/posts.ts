import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.post.findMany({
        select: {
          user: true,
          id: true,
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
  deletePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.post.delete({
          where: {
            id: input.postId,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }),
});
