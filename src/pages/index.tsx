import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { NewPostForm } from "../components/NewPostForm";
import { PostComponent } from "../components/PostComponent";
import { trpc } from "../utils/trpc";

const AllPostsFeed: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: posts, isLoading } = trpc.posts.getAll.useQuery();

  if (status === "loading")
    return <div className="flex flex-col items-center pt-4">Loading...</div>;

  if (isLoading)
    return (
      <div className="flex flex-col items-center pt-4">Fetching Posts...</div>
    );

  return (
    <>
      {session && <NewPostForm />}
      <div className="flex w-full flex-col-reverse break-words">
        <div className="flex w-full flex-col-reverse break-words">
          {posts?.map((post, index) => {
            return <PostComponent key={index} post={post} />;
          })}
        </div>
      </div>
    </>
  );
};

export default AllPostsFeed;
