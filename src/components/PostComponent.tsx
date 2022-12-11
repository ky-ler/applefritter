import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import type { PostWithUser } from "../types/post";
import { DeletePostBtn } from "./DeletePostBtn";
import { FavoriteBtn } from "./FavoriteBtn";
import { NewReply } from "./NewReply";

dayjs.extend(relativeTime);

const PostComponent = ({ post }: { post: PostWithUser }) => {
  return (
    <div className="border-b-2 border-zinc-800 p-4 md:border-x-2">
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
          <span> &bull; </span>
          <Link href={`/status/${post.id}`} className="text-emerald-500">
            {dayjs(post.createdAt).fromNow()}
          </Link>
        </span>
      </div>
      <p className="py-4">
        {post.originalPost && (
          <>
            Replying to{" "}
            <Link
              href={`/status/${post.originalPost.id}`}
              className="text-emerald-400"
            >
              @{post.originalPost.author}
            </Link>
            {": "}
          </>
        )}{" "}
        {post.content}
      </p>
      <div className="items flex items-center justify-start space-x-4">
        <div>
          <NewReply postId={post.id} replyTo={post.user.username} />
          <span className="ml-1">{post.replyPost.length}</span>
        </div>
        <div>
          <FavoriteBtn postId={post.id} postFavorites={post.favorites} />{" "}
        </div>
        <div>
          <DeletePostBtn postId={post.id} postUserId={post.user.id} />
        </div>
      </div>
    </div>
  );
};
export { PostComponent };
