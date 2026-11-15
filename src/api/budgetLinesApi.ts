import { request } from "./client";
import type { LineCreate, LineRow, NullableMoney } from "@/types";

export const budgetLinesApi = {
  createLine(
    year: number,
    month: number,
    data: LineCreate
  ): Promise<LineRow> {
    return request<LineRow>("POST", `/months/${year}/${month}/lines`, {
      body: data,
    });
  },

  updateExpected(id: string, expected: NullableMoney): Promise<LineRow> {
    return request<LineRow>("PATCH", `/budget-lines/${id}`, {
      body: { expected },
    });
  },

  deleteLine(id: string): Promise<void> {
    return request<void>("DELETE", `/budget-lines/${id}`);
  },
};
