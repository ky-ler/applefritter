import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { trpc } from "../utils/trpc";

const Register: NextPage = () => {
  const { data: session, status } = useSession({ required: true });
  const [username, setUsername] = useState("");
  const router = useRouter();

  const createUsername = trpc.user.changeName.useMutation();

  const handleSubmit = () => {
    if (session !== null) {
      createUsername.mutate({
        userId: session.user?.id as string,
        username,
      });
    }
  };
  if (createUsername.isSuccess && session?.user) {
    session.user.username = username;
    // Workaround to add username to session
    router.reload();
    // router.push("/");
  }

  if (status === "loading")
    return <main className="flex flex-col items-center pt-4">Loading...</main>;

  return (
    <main className="flex max-w-4xl flex-col items-center p-4">
      {!session.user?.username ? (
        <>
          <h2>Add a Username</h2>
          <div className="flex flex-col items-center gap-4 pt-4">
            {createUsername.isError ? (
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                minLength={2}
                maxLength={32}
                className="rounded-md border-2 border-red-500 bg-neutral-900 px-4 py-2 ring-0 transition-all focus:outline-none"
              />
            ) : (
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                minLength={2}
                maxLength={32}
                className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 transition-all focus:outline-0  active:outline-0"
              />
            )}
            <button
              onClick={() => handleSubmit()}
              disabled={username.length < 2 || createUsername.isLoading}
              className="mt-2 flex cursor-pointer items-center justify-center rounded-md border-2 border-zinc-800 p-2 transition-colors hover:border-zinc-600 focus:outline-none active:border-zinc-600 active:bg-neutral-800 disabled:cursor-not-allowed disabled:hover:border-zinc-800 disabled:active:bg-transparent"
            >
              Submit
            </button>
            {createUsername.isError && <span>Name is already in use</span>}
          </div>
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

export default Register;
