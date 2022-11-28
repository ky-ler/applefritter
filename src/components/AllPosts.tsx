import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { DeletePostBtn } from "./DeletePostBtn";
import { FavoriteBtn } from "./FavoriteBtn";

dayjs.extend(relativeTime);

export const AllPosts = () => {
  const { data: posts, isLoading } = trpc.posts.getAll.useQuery();

  if (isLoading) return <div>Fetching Posts...</div>;

  return (
    <>
      {posts?.map((post, index) => {
        return (
          <div
            key={index}
            id={post.id}
            className="border-b border-zinc-800 p-4 first:border-t"
          >
            <div className="flex justify-between">
              <span>
                <Link href="#">@{post.user.name}</Link> &bull;{" "}
                {dayjs(post.createdAt).fromNow()}{" "}
              </span>
              <span className="text-right">
                <DeletePostBtn postId={post.id} postUserId={post.user.id} />
              </span>
            </div>
            <p>{post.content}</p>
            <FavoriteBtn postId={post.id} postFavorites={post.favorites} />{" "}
            {post.favorites.length}
          </div>
        );
      })}
    </>
  );
};
