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
          createdAt: true,
          favorites: true,
          originalPostId: true,
          originalPost: true,
          replyPost: true,
        },
        // orderBy: {
        //   createdAt: "desc",
        // },
      });
    } catch (error) {
      console.error(error);
    }
  }),
  getFollowingPosts: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const following = await ctx.prisma.follows.findMany({
          where: { followerId: input.userId },
        });
        const ids = following.map((user) => user.followingId);
        return await ctx.prisma.post.findMany({
          where: {
            user: {
              id: { in: ids },
            },
          },
          select: {
            user: true,
            id: true,
            content: true,
            createdAt: true,
            favorites: true,
            originalPostId: true,
            originalPost: true,
            replyPost: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getAllByUser: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.post.findMany({
          where: {
            user: {
              username: input.username,
            },
          },
          select: {
            user: true,
            id: true,
            content: true,
            createdAt: true,
            favorites: true,
            originalPostId: true,
            originalPost: true,
            replyPost: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        });
      } catch (error) {
        console.error(error);
      }
    }),
  createPost: protectedProcedure
    .input(
      z.object({
        author: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.post.create({
          data: {
            author: input.author,
            content: input.content,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }),
  createReply: protectedProcedure
    .input(
      z.object({
        author: z.string(),
        content: z.string(),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.post.create({
          data: {
            author: input.author,
            content: input.content,
            originalPostId: input.postId,
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
        await ctx.prisma.favorite.deleteMany({
          where: {
            postId: input.postId,
          },
        });
        return await ctx.prisma.post.delete({
          where: {
            id: input.postId,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }),
  addFavorite: protectedProcedure
    .input(z.object({ postId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.favorite.create({
          data: {
            postId: input.postId,
            userId: input.userId,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }),
  removeFavorite: protectedProcedure
    .input(z.object({ postId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.favorite.deleteMany({
          where: {
            postId: { contains: input.postId },
            userId: { contains: input.userId },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }),
});
