import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import isAlphanumeric from "validator/lib/isAlphanumeric";
import { z } from "zod";

import { trpc } from "../utils/trpc";

const usernameSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be between 2 and 32 characters long." })
    .max(32, {
      message: "Username must be between 2 and 32 characters long.",
    })
    // TODO: First character must be a letter
    .refine((val) => isAlphanumeric(val, "en-US" /*, { ignore: "_" } */), {
      message: "Username can only contain letters, numbers, and underscores.",
    }),
});

const Username: NextPage = () => {
  const { data: session, status } = useSession({ required: true });
  console.log(session?.user?.email?.split("@")[0]);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  const router = useRouter();

  const createUsername = trpc.user.changeName.useMutation();

  if (createUsername.isSuccess && session?.user) {
    // Workaround to add username to session
    router.reload();
    // router.push("/");
  }

  if (status === "loading")
    return <main className="flex flex-col items-center pt-4">Loading...</main>;

  return (
    <main className="flex min-h-screen max-w-4xl flex-col items-center justify-center p-4">
      {!session.user?.username ? (
        <>
          <h2 className="text-semibold text-xl">
            Create a username to continue
          </h2>
          <form
            onSubmit={handleSubmit((data) => {
              createUsername.mutate({
                userId: session.user?.id as string,
                username: data.username,
              });
            })}
            className="flex flex-col items-center gap-4 pt-8"
          >
            <div className="flex flex-col items-center justify-center md:flex-row">
              <label htmlFor="username" className="mr-4">
                Username:
              </label>
              <input
                {...register("username")}
                aria-invalid={errors.username ? "true" : "false"}
                className={
                  errors.username
                    ? `rounded-md border-2 border-red-500 bg-neutral-900 px-4 py-2 tracking-tight transition-all  focus:outline-0 active:outline-0`
                    : `rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 tracking-tight transition-all  focus:outline-0 active:outline-0`
                }
              />
            </div>
            {errors.username && (
              <p role="alert">{"" + errors.username.message}</p>
            )}
            <button
              disabled={!isDirty || createUsername.isLoading}
              className="mt-2 flex cursor-pointer items-center justify-center rounded-md border-2 border-zinc-800 p-2 transition-colors hover:border-zinc-600 focus:outline-none active:border-zinc-600 active:bg-neutral-800 disabled:cursor-not-allowed disabled:hover:border-zinc-800 disabled:active:bg-transparent"
            >
              Submit
            </button>
            {createUsername.isError && <span>Name is already in use</span>}
          </form>
        </>
      ) : (
        <Link
          href="/"
          className="rounded-md border-2 border-zinc-800 p-2 transition-colors hover:border-zinc-600 focus:outline-none active:border-zinc-600 active:bg-neutral-800"
        >
          Home
        </Link>
      )}
    </main>
  );
};

export default Username;
