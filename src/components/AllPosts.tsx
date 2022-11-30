import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { DeletePostBtn } from "./DeletePostBtn";
import { FavoriteBtn } from "./FavoriteBtn";
import { NewReply } from "./NewReply";

dayjs.extend(relativeTime);

export const AllPosts = () => {
  const { data: posts, isLoading } = trpc.posts.getAll.useQuery();

  if (isLoading)
    return (
      <div className="flex flex-col items-center pt-4">Fetching Posts...</div>
    );

  return (
    <div className="mt-4 flex w-full flex-col-reverse break-words">
      {posts?.map((post, index) => {
        return (
          <div
            key={index}
            id={post.id}
            className="border-b-2 border-zinc-800 p-4 last:border-t-2 md:border-x-2"
          >
            <div className="flex justify-between">
              <div className="flex items-center">
                {post.user?.image && (
                  <Image
                    src={post.user?.image}
                    alt={`${post.user.username}'s profile picture`}
                    width={50}
                    height={50}
                    className="mr-2 rounded-full"
                  />
                )}
                <span>
                  <Link
                    className="text-emerald-400"
                    href={`/user/${post.user.username}`}
                  >
                    @{post.user.username}
                  </Link>{" "}
                  {post.originalPost && (
                    <>&bull; Replying to {post.originalPost.author}</>
                  )}{" "}
                  &bull; {dayjs(post.createdAt).fromNow()}{" "}
                </span>
              </div>
              <DeletePostBtn postId={post.id} postUserId={post.user.id} />
            </div>
            <p className="py-4">{post.content}</p>
            <div className="items flex items-center justify-start space-x-4">
              <div>
                <NewReply postId={post.id} replyTo={post.user.username} />
                <span className="ml-1">{post.replyPost.length}</span>
              </div>
              <div>
                <FavoriteBtn postId={post.id} postFavorites={post.favorites} />{" "}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
