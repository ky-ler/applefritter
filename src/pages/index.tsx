import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { trpc } from "../utils/trpc";

const Posts = () => {
  const { data: posts, isLoading } = trpc.posts.getAll.useQuery();

  if (isLoading) return <div>Fetching Posts.....</div>;

  return (
    <div className="flex flex-col gap-4">
      {posts?.map((post, index) => {
        return (
          <div key={index}>
            <span>{post.user.name}</span>
            <p>{post.content}</p>
          </div>
        );
      })}
    </div>
  );
};

const NewPost = () => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const utils = trpc.useContext();

  const postMessage = trpc.posts.createPost.useMutation({
    onMutate: () => {
      utils.posts.getAll.cancel();
      const optimisticUpdate = utils.posts.getAll.getData();

      if (optimisticUpdate) {
        utils.posts.getAll.setData(undefined, optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.posts.getAll.invalidate();
    },
  });

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();

        if (session !== null) {
          postMessage.mutate({
            authorId: session.user?.id as string,
            content,
          });
        }

        setContent("");
      }}
    >
      <input
        type="text"
        value={content}
        placeholder="Your message..."
        minLength={2}
        maxLength={100}
        onChange={(event) => setContent(event.target.value)}
        className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
};

const Home: NextPage = () => {
  const { data: session, status } = useSession();

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
              <NewPost />
            </>
          )}
          <p>Hi {session.user?.name} </p>
          <button onClick={() => signOut()}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => signIn("discord")}>Login with Discord</button>
        </>
      )}
      <div className="flex w-full flex-col border">
        <Posts />
      </div>
    </main>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
