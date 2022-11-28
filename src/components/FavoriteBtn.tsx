import { Favorite } from "@prisma/client";
import { useSession } from "next-auth/react";
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
      if (!isFavorited.length) {
        addFavorite.mutate({ userId: session.user?.id, postId: postId });
      }
      if (isFavorited[0])
        removeFavorite.mutate({ favoriteId: isFavorited[0].id });
    } else return null;
  };

  return (
    <button onClick={setFavorite} className="align-middle text-2xl">
      {isFavorited.length ? <FiHeart className=" fill-red-500" /> : <FiHeart />}
    </button>
  );
};
