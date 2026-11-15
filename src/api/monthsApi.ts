import { request } from "./client";
import type { MonthCreate, MonthRef, MonthView } from "@/types";

export const monthsApi = {
  listMonths(): Promise<MonthRef[]> {
    return request<MonthRef[]>("GET", "/months");
  },

  getMonth(year: number, month: number): Promise<MonthView> {
    return request<MonthView>("GET", `/months/${year}/${month}`);
  },

  createMonth(data: MonthCreate): Promise<MonthView> {
    return request<MonthView>("POST", "/months", {
      body: data,
    });
  },
};
