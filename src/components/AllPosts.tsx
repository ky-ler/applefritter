import { trpc } from "../utils/trpc";
import { PostComponent } from "./Post";

export const AllPosts = () => {
  const { data: posts, isLoading } = trpc.posts.getAll.useQuery();

  if (isLoading)
    return (
      <div className="flex flex-col items-center pt-4">Fetching Posts...</div>
    );

  return (
    <div className="mt-4 flex w-full flex-col-reverse break-words">
      {posts?.map((post, index) => {
        return <PostComponent key={index} post={post} />;
      })}
    </div>
  );
};
