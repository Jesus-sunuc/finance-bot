import { useSuspenseQuery } from "@tanstack/react-query";
import { axiosClient } from "../utils/axiosClient";
import type { finance } from "../models/Finance";

export const financeKeys = {
  all: ["finances"] as const,
};

export const useFinanceQuery = () => {
  return useSuspenseQuery({
    queryKey: financeKeys.all,
    queryFn: async (): Promise<finance[]> => {
      const res = await axiosClient.get("/api/finance/all");
      return res.data;
    },
  });
};
