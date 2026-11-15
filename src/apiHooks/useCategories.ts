import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { categoriesApi } from "@/api";
import { queryKeys } from "@/constants";
import type { Category } from "@/types";

export interface UseCategoriesOptions {
  includeArchived?: boolean;
}

export function useCategories(
  options: UseCategoriesOptions = {}
): UseQueryResult<Category[], Error> {
  return useQuery({
    queryKey: queryKeys.categories.list(options.includeArchived),
    queryFn: () =>
      categoriesApi.listCategories({
        includeArchived: options.includeArchived,
      }),
  });
}
