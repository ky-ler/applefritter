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
            OR: [
              {
                user: {
                  id: input.userId,
                },
              },
              {
                user: {
                  id: { in: ids },
                },
              },
            ],
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
  getPostById: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const replies = [];
        const originalPost = [];
        const linkedPost = await ctx.prisma.post.findUnique({
          where: {
            id: input.postId,
          },
          select: {
            id: true,
            user: true,
            content: true,
            createdAt: true,
            favorites: true,
            originalPostId: true,
            originalPost: true,
            replyPost: true,
          },
        });
        if (linkedPost?.originalPostId) {
          const replyToPostId = linkedPost.originalPostId;
          originalPost.push(
            await ctx.prisma.post.findUnique({
              where: {
                id: replyToPostId,
              },
              select: {
                id: true,
                user: true,
                content: true,
                createdAt: true,
                favorites: true,
                originalPostId: true,
                originalPost: true,
                replyPost: true,
              },
            })
          );
          if (originalPost.at(-1)!.originalPostId) {
            let threadId: string | null | undefined =
              originalPost.at(-1)!.originalPostId;
            while (threadId) {
              originalPost.push(
                await ctx.prisma.post.findUnique({
                  where: {
                    id: threadId,
                  },
                  select: {
                    id: true,
                    user: true,
                    content: true,
                    createdAt: true,
                    favorites: true,
                    originalPostId: true,
                    originalPost: true,
                    replyPost: true,
                  },
                })
              );

              threadId = originalPost.at(-1)?.originalPostId;
            }
          }
        }

        // TODO: Allow for threads to be viewed by clicking on the 1st post in the thread rather than the last
        if (linkedPost?.replyPost) {
          replies.push(
            await ctx.prisma.post.findMany({
              where: {
                originalPostId: input.postId,
              },
              select: {
                id: true,
                user: true,
                content: true,
                createdAt: true,
                favorites: true,
                originalPostId: true,
                originalPost: true,
                replyPost: true,
              },
            })
          );
        }
        return { linkedPost, replies, originalPost };
      } catch (error) {
        console.error(error);
      }
    }),
});
