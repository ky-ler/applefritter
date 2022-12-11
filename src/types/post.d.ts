export type PostWithUser = {
  id: string;
  user: User;
  content: string;
  createdAt: Date;
  favorites: Favorite[];
  originalPostId: string | null;
  originalPost: Post | null;
  replyPost: Post[];
};
