import { request } from "./client";
import type {
  Category,
  CategoryCreate,
  CategoryUpdate,
  Subcategory,
  SubcategoryCreate,
} from "@/types";

export const categoriesApi = {
  listCategories(params?: { includeArchived?: boolean }): Promise<Category[]> {
    return request<Category[]>("GET", "/categories", {
      query: params,
    });
  },

  createCategory(data: CategoryCreate): Promise<Category> {
    return request<Category>("POST", "/categories", {
      body: data,
    });
  },

  updateCategory(id: string, data: CategoryUpdate): Promise<Category> {
    return request<Category>("PATCH", `/categories/${id}`, {
      body: data,
    });
  },

  deleteCategory(id: string): Promise<void> {
    return request<void>("DELETE", `/categories/${id}`);
  },

  createSubcategory(data: SubcategoryCreate): Promise<Subcategory> {
    return request<Subcategory>("POST", "/subcategories", {
      body: data,
    });
  },

  updateSubcategory(id: string, data: CategoryUpdate): Promise<Subcategory> {
    return request<Subcategory>("PATCH", `/subcategories/${id}`, {
      body: data,
    });
  },

  deleteSubcategory(id: string): Promise<void> {
    return request<void>("DELETE", `/subcategories/${id}`);
  },
};
