import { Prisma } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
  getUser: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.findUnique({
          where: {
            username: input.username,
          },
          select: {
            username: true,
            image: true,
          },
          // orderBy: {
          // createdAt: "desc",
          // },
        });
      } catch (error) {
        console.error(error);
      }
    }),
  changeName: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        username: z.string().min(2, {
          message: "Username must be between 2 and 32 characters long",
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            username: input.username,
          },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new Error("Name already in use");
          }
        }
        console.error(error);
      }
    }),
});
