import type { Follows } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
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

  const setFavorite = () => {
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
      <button
        disabled={unfollow.isLoading || follow.isLoading}
        onClick={setFavorite}
        className=" align-top text-2xl duration-300 active:-translate-y-1 active:transition-transform disabled:active:translate-y-0"
      >
        {isFollower ? <FiHeart className="fill-red-500" /> : <FiHeart />}
      </button>
      <span className="ml-1">{numberOfFollowers}</span>
    </>
  );
};
