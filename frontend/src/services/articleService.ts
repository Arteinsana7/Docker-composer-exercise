import api from "./api";
import type { Article, Category } from "../types";

export const articleService = {
  // Find all articles
  getAll: async (): Promise<Article[]> => {
    const response = await api.get("/articles");
    return response.data;
  },

  // Find an article by ID
  getById: async (id: string): Promise<Article> => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },

  // Find articles by category
  getByCategory: async (category: Category): Promise<Article[]> => {
    const response = await api.get(`/articles/category/${category}`);
    return response.data;
  },

  // Create an article (admin)
  create: async (articleData: Partial<Article>): Promise<Article> => {
    const response = await api.post("/articles", articleData);
    return response.data;
  },

  // Update an article (admin)
  update: async (
    id: string,
    articleData: Partial<Article>
  ): Promise<Article> => {
    const response = await api.put(`/articles/${id}`, articleData);
    return response.data;
  },

  // Delete an article (admin)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/articles/${id}`);
  },
};
