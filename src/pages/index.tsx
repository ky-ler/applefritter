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
    <main className="flex flex-col items-center">
      {session ? (
        <>
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
          <button onClick={() => signOut()}>Logout</button>
          <NewPostForm />
        </>
      ) : (
        <>
          <button onClick={() => signIn("discord")}>Login with Discord</button>
        </>
      )}
      <div className="mt-4 flex w-full flex-col break-words">
        <AllPosts />
      </div>
    </main>
  );
};

export default Home;
