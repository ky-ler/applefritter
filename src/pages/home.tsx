import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { NewPostForm } from "../components/NewPostForm";
import { PostComponent } from "../components/PostComponent";
import Layout from "../layouts/Layout";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: posts, isLoading } = trpc.posts.getFollowingPosts.useQuery({
    userId: "" + session?.user?.id,
  });

  const router = useRouter();

  if (status === "loading")
    return <div className="flex flex-col items-center pt-4">Loading...</div>;

  if (status === "unauthenticated") router.push("/login");

  if (isLoading)
    return (
      <div className="flex flex-col items-center pt-4">Fetching Posts...</div>
    );

  return (
    <Layout>
      {session && <NewPostForm />}
      <div className="flex w-full flex-col-reverse break-words">
        {!isLoading && !posts?.length && (
          <div className="flex flex-col items-center pt-4 text-lg">
            <span className="font-semibold text-red-500">
              Error fetching posts.
            </span>
            <h3>Possible Causes:</h3>
            <ul className="list-outside list-disc">
              <li>You aren&apos;t following anyone</li>
              <li>Users you follow have not posted</li>
            </ul>
          </div>
        )}
        <div className="flex w-full flex-col-reverse break-words">
          {posts &&
            posts?.map((post, index) => {
              return <PostComponent key={index} post={post} />;
            })}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
