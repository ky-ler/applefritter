import { type Favorite } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { trpc } from "../utils/trpc";

export const FavoriteBtn = ({
  postId,
  postFavorites,
}: {
  postId: string;
  postFavorites: Favorite[];
}) => {
  const { data: session } = useSession();
  const utils = trpc.useContext();

  const isFavorited = postFavorites.filter(
    (favorite) => favorite.userId === session?.user?.id
  );

  const [isFavorite, setIsFavorite] = useState(
    isFavorited.length ? true : false
  );
  const [numberOfFavorites, setNumberOfFavorites] = useState(
    postFavorites.length
  );

  const addFavorite = trpc.posts.addFavorite.useMutation({
    onMutate: () => {
      utils.posts.getAll.cancel();
      const optimisticUpdate = utils.posts.getAll.getData();

      if (optimisticUpdate) {
        utils.posts.getAll.setData(undefined, optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.posts.getAll.invalidate();
    },
  });

  const removeFavorite = trpc.posts.removeFavorite.useMutation({
    onMutate: () => {
      utils.posts.getAll.cancel();
      const optimisticUpdate = utils.posts.getAll.getData();

      if (optimisticUpdate) {
        utils.posts.getAll.setData(undefined, optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.posts.getAll.invalidate();
    },
  });

  const setFavorite = () => {
    if (session !== null && session?.user?.id) {
      if (!isFavorite) {
        addFavorite.mutate({ userId: session.user?.id, postId: postId });
        setIsFavorite(true);
        setNumberOfFavorites((prevAmount) => prevAmount + 1);
      }
      if (isFavorite) {
        removeFavorite.mutate({ userId: session.user?.id, postId: postId });
        setIsFavorite(false);
        setNumberOfFavorites((prevAmount) => prevAmount - 1);
      }
    }
  };

  return (
    <>
      <button
        disabled={removeFavorite.isLoading || addFavorite.isLoading}
        onClick={setFavorite}
        className=" align-top text-2xl duration-300 active:-translate-y-1 active:transition-transform disabled:active:translate-y-0"
      >
        {isFavorite ? <FiHeart className="fill-red-500" /> : <FiHeart />}
      </button>
      <span className="ml-1">{numberOfFavorites}</span>
    </>
  );
};
