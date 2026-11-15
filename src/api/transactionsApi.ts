import { request } from "./client";
import type {
  Transaction,
  TransactionCreate,
  TransactionUpdate,
} from "@/types";

export interface LineTransactionsResponse {
  total: number;
  transactions: Transaction[];
}

export const transactionsApi = {
  listLineTransactions(lineId: string): Promise<LineTransactionsResponse> {
    return request<LineTransactionsResponse>(
      "GET",
      `/budget-lines/${lineId}/transactions`
    );
  },

  createTransaction(
    lineId: string,
    data: TransactionCreate
  ): Promise<Transaction> {
    return request<Transaction>(
      "POST",
      `/budget-lines/${lineId}/transactions`,
      {
        body: data,
      }
    );
  },

  updateTransaction(
    id: string,
    data: TransactionUpdate
  ): Promise<Transaction> {
    return request<Transaction>("PATCH", `/transactions/${id}`, {
      body: data,
    });
  },

  deleteTransaction(id: string): Promise<void> {
    return request<void>("DELETE", `/transactions/${id}`);
  },
};
