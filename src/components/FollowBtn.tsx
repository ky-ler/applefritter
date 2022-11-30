import type { Follows } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FiUserMinus, FiUserPlus } from "react-icons/fi";
import { trpc } from "../utils/trpc";

export const FollowBtn = ({
  followingId,
  followersArray,
}: {
  followingId: string;
  followersArray: Follows[];
}) => {
  const { data: session } = useSession();

  const isFollower = followersArray.filter(
    (follower) => follower.followerId === session?.user?.id
  );

  const [isFollowing, setIsFollowing] = useState(
    isFollower.length ? true : false
  );
  const [numberOfFollowers, setNumberOfFollowers] = useState(
    followersArray.length
  );

  const follow = trpc.user.followUser.useMutation();
  const unfollow = trpc.user.unfollowUser.useMutation();

  const handleClick = () => {
    if (session !== null && session?.user?.id) {
      if (!isFollowing) {
        follow.mutate({
          followerId: session.user?.id,
          followingId: followingId,
        });
        setIsFollowing(true);
        setNumberOfFollowers((prevAmount) => prevAmount + 1);
      }
      if (isFollowing) {
        unfollow.mutate({
          followerId: session.user?.id,
          followingId: followingId,
        });
        setIsFollowing(false);
        setNumberOfFollowers((prevAmount) => prevAmount - 1);
      }
    }
  };

  return (
    <>
      {session?.user?.id !== followingId && (
        <div>
          <button
            disabled={unfollow.isLoading || follow.isLoading}
            onClick={handleClick}
            className="align-top text-3xl duration-300 active:-translate-y-1 active:transition-transform disabled:active:translate-y-0"
          >
            {isFollowing ? <FiUserMinus /> : <FiUserPlus />}
          </button>
        </div>
      )}
      <div className="flex flex-col">
        {numberOfFollowers} Follower
        {numberOfFollowers === 1 ? "" : "s"}
      </div>
    </>
  );
};
