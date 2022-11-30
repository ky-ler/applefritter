import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { AllPosts } from "../components/AllPosts";
import { NewPostForm } from "../components/NewPostForm";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading")
    return <main className="flex flex-col items-center pt-4">Loading...</main>;

  return (
    <>
      {session && <NewPostForm />}
      <div className="flex w-full flex-col-reverse break-words">
        <AllPosts />
      </div>
    </>
  );
};

export default Home;
