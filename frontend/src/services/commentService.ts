import api from "./api";
import type { Comment } from "@/types";

export const commentService = {
  getAll: async (): Promise<Comment[]> => {
    const response = await api.get("/comments");
    return response.data.data;
  },
  // Get comments for an article
  getByArticle: async (articleId: string): Promise<Comment[]> => {
    const response = await api.get(`/articles/${articleId}/comments`);
    return response.data.data;
  },

  // Create a comment
  create: async (commentData: {
    content: string;
    article: string;
  }): Promise<Comment> => {
    //Article on URl intead of body
    const response = await api.post(`/comments/${commentData.article}`, {
      content: commentData.content,
    });
    return response.data.data;
  },

  // modify a comment
  update: async (
    commentId: string,
    data: { content: string }
  ): Promise<Comment> => {
    const response = await api.put(`/comments/${commentId}`, data);
    return response.data.data;
  },

  // Delete a comment
  delete: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },
};
