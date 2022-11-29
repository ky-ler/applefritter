import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AllPosts } from "../components/AllPosts";
import { DeletePostBtn } from "../components/DeletePostBtn";
import { NewPostForm } from "../components/NewPostForm";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading")
    return <main className="flex flex-col items-center pt-4">Loading...</main>;

  return (
    <main className="flex max-w-4xl flex-col p-4">
      {session ? (
        <div className="flex justify-around">
          <div className="flex flex-col items-center justify-end">
            {session.user?.image && (
              <>
                <Image
                  src={session.user?.image}
                  alt=""
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </>
            )}
            <p>Hi {session.user?.name} </p>
            <button
              onClick={() => signOut()}
              className="rounded-md border-2 border-zinc-800 p-2 transition-colors hover:border-zinc-600 focus:outline-none active:border-zinc-600 active:bg-neutral-800"
            >
              Logout
            </button>
          </div>
          <div className="pt-4">
            <NewPostForm />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <button
            onClick={() => signIn("discord")}
            className="rounded-md border-2 border-zinc-800 p-2 transition-colors hover:border-zinc-600 focus:outline-none active:border-zinc-600 active:bg-neutral-800"
          >
            Login with Discord
          </button>
        </div>
      )}
      <div className="mt-4 flex w-full flex-col break-words">
        <AllPosts />
      </div>
    </main>
  );
};

export default Home;
