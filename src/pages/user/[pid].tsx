import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { DeletePostBtn } from "../../components/DeletePostBtn";
import { FavoriteBtn } from "../../components/FavoriteBtn";
import { FollowBtn } from "../../components/FollowBtn";
import { NewReply } from "../../components/NewReply";
import { trpc } from "../../utils/trpc";

dayjs.extend(relativeTime);

const User = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { pid } = router.query;

  const { data: posts, isLoading } = trpc.posts.getAllByUser.useQuery({
    username: "" + pid,
  });

  const { data: userInfo } = trpc.user.getUser.useQuery({
    username: "" + pid,
  });

  console.log(userInfo);
  if (isLoading)
    return (
      <main className="flex h-screen flex-col items-center justify-center pt-4">
        Loading...
      </main>
    );

  return (
    <>
      {userInfo && (
        <div className="flex items-center justify-center gap-2 border-zinc-800 p-4 md:gap-4 md:border-x-2">
          {userInfo?.image && (
            <Image
              src={userInfo.image}
              alt={`${userInfo.username}'s profile picture`}
              width={50}
              height={50}
              className="rounded-full"
            />
          )}
          <h1 className="text-2xl font-semibold">{userInfo?.username}</h1>
          {session && userInfo.id !== session?.user?.id && (
            <FollowBtn
              followingId={userInfo.id}
              followersArray={userInfo.followedBy}
            />
          )}
        </div>
      )}
      <div className="flex w-full flex-col break-words">
        {posts?.map((post, index) => {
          return (
            <div
              key={index}
              id={post.id}
              className="border-b-2 border-zinc-800 p-4 first:border-t-2 md:border-x-2"
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
              <div className="items flex items-center justify-start gap-4">
                <div>
                  <NewReply postId={post.id} replyTo={post.user.username} />
                  <span className="ml-1">{post.replyPost.length}</span>
                </div>
                <div>
                  <FavoriteBtn
                    postId={post.id}
                    postFavorites={post.favorites}
                  />{" "}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default User;
