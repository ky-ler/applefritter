import { Prisma } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
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
