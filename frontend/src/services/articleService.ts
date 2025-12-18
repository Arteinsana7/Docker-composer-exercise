import api from "./api";
import type { Article, Category } from "../types";

export const articleService = {
  // Find all articles
  getAll: async (): Promise<Article[]> => {
    const response = await api.get("/articles");
    return response.data.data;
  },

  // Find an article by ID
  getById: async (id: string): Promise<Article> => {
    const response = await api.get(`/articles/${id}`);
    return response.data.data;
  },

  // Find articles by category
  getByCategory: async (category: Category): Promise<Article[]> => {
    const response = await api.get(`/articles/category/${category}`);
    return response.data.data;
  },

  // Create an article (admin)
  create: async (articleData: Partial<Article>): Promise<Article> => {
    const response = await api.post("/articles", articleData);
    return response.data.data;
  },

  // Update an article (admin)
  update: async (
    id: string,
    articleData: Partial<Article>
  ): Promise<Article> => {
    const response = await api.put(`/articles/${id}`, articleData);
    return response.data.data;
  },

  // Delete an article (admin)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/articles/${id}`);
  },
};
